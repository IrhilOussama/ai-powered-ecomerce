import os
import io
import json
import time
import pickle as pkl
import numpy as np
from numpy.linalg import norm
from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List
import uvicorn
from PIL import Image
from dotenv import load_dotenv
import cloudinary
import cloudinary.api

# Import your model and feature extraction function.
from resnet import resnet
from extract_features import extract_features_from_images_with_url

# ====== Load Environment Variables ======
load_dotenv()

# Cloudinary & file config
CLOUDINARY_FOLDER = "products"
IMAGE_FEATURES_PATH = "/data/image_features.pkl"
FILENAMES_PATH = "/data/filenames.pkl";
IMAGE_CLUSTERS_FILE = "/data/image_clusters.json";
SIMILARITIES_FILE = "/data/similarities.json";
CLOUDINARY_PRODUCTS_FOLDER_URL = os.getenv("CLOUDINARY_PRODUCTS_FOLDER_URL")

# Define the base data directory relative to the script location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get script's directory
DATA_DIR = os.path.join(BASE_DIR, "data")  # Store data inside a 'data' folder

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Define relative paths for data storage
IMAGE_FEATURES_PATH = os.path.join(DATA_DIR, "image_features.pkl")
FILENAMES_PATH = os.path.join(DATA_DIR, "filenames.pkl")
IMAGE_CLUSTERS_FILE = os.path.join(DATA_DIR, "image_clusters.json")
SIMILARITIES_FILE = os.path.join(DATA_DIR, "similarities.json")

# Configure Cloudinary API
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# ====== Helper Function to Fetch Images from Cloudinary ======
def fetch_cloudinary_images(retries=3, delay=5):
    """
    Fetch images from Cloudinary under the given folder.
    Returns a list of image URLs.
    """
    for attempt in range(retries):
        try:
            response = cloudinary.api.resources(
                type="upload",
                prefix=CLOUDINARY_FOLDER,
                max_results=500
            )
            images = [
                f"{CLOUDINARY_PRODUCTS_FOLDER_URL}/{img['public_id']}"
                for img in response["resources"]
            ]
            return images
        except Exception as e:
            print(f"Error fetching images from Cloudinary (attempt {attempt+1}): {e}")
            time.sleep(delay)
    return []

# ====== Compute and Save Image Features if Needed ======
if not os.path.exists(IMAGE_FEATURES_PATH) or not os.path.exists(FILENAMES_PATH):
    print("Precomputed feature files not found. Fetching images from Cloudinary and computing features...")
    
    # Load the model
    model = resnet()
    
    # Fetch images from Cloudinary
    image_urls = fetch_cloudinary_images()
    print(f"Fetched {len(image_urls)} images from Cloudinary.")
    
    image_features = []
    valid_image_urls = []
    
    for url in image_urls:
        try:
            features = extract_features_from_images_with_url(url, model)
            if isinstance(features, (list, np.ndarray)):
                image_features.append(np.array(features).flatten())
                valid_image_urls.append(url)
            else:
                print(f"Warning: Feature extraction failed for {url}")
        except Exception as e:
            print(f"Error processing {url}: {e}")
    
    if len(image_features) == 0:
        print("Error: No valid features extracted. Exiting.")
        exit(1)
    
    # Ensure consistency in feature shape
    feature_size = len(image_features[0])
    image_features = np.array([
        f if len(f) == feature_size else np.zeros(feature_size)
        for f in image_features
    ])
    
    # Save features and corresponding image URLs
    pkl.dump(image_features, open(IMAGE_FEATURES_PATH, 'wb'))
    pkl.dump(valid_image_urls, open(FILENAMES_PATH, 'wb'))
    print(f"Saved image features to '{IMAGE_FEATURES_PATH}' and filenames to '{FILENAMES_PATH}'.")

    # ====== Clustering ======
    # (This example uses KMeans with a maximum of 3 clusters or the number of images, whichever is smaller.)
    from sklearn.cluster import KMeans
    NUM_CLUSTERS = min(3, len(image_features))
    if NUM_CLUSTERS > 1:
        kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(image_features)
        image_clusters = { valid_image_urls[i]: int(cluster_labels[i]) for i in range(len(valid_image_urls)) }
        with open(IMAGE_CLUSTERS_FILE, 'w') as f:
            json.dump(image_clusters, f, indent=4)
        print(f"Clustered images and saved to '{IMAGE_CLUSTERS_FILE}'.")
    else:
        print("Skipping clustering: Not enough images to form multiple clusters.")
        image_clusters = { url: 0 for url in valid_image_urls }
        with open(IMAGE_CLUSTERS_FILE, 'w') as f:
            json.dump(image_clusters, f, indent=4)
    
    # ====== Precompute Similarities ======
    # For each image, compute cosine similarity to other images in the same cluster
    from sklearn.metrics.pairwise import cosine_similarity
    closest_images = []
    for i, image_url in enumerate(valid_image_urls):
        cluster_id = image_clusters.get(image_url, -1)
        cluster_indices = [
            idx for idx, url in enumerate(valid_image_urls)
            if image_clusters.get(url, -1) == cluster_id
        ]
        sims = cosine_similarity([image_features[i]], image_features[cluster_indices]).flatten()
        # Exclude self and get top 5 similar images
        sorted_indices = np.argsort(sims)[::-1][1:6]
        similar_images = [valid_image_urls[cluster_indices[j]] for j in sorted_indices]
        closest_images.append({
            "image_name": image_url,
            "similar_images": similar_images
        })
    with open(SIMILARITIES_FILE, 'w') as f:
        json.dump(closest_images, f, indent=4)
    print(f"Similarities saved to '{SIMILARITIES_FILE}'.")
else:
    print("Precomputed feature files found. Loading data...")

# ====== Load Precomputed Data ======
with open(IMAGE_FEATURES_PATH, 'rb') as f:
    image_features = pkl.load(f)
with open(FILENAMES_PATH, 'rb') as f:
    valid_image_urls = pkl.load(f)
with open(IMAGE_CLUSTERS_FILE, 'r') as f:
    image_clusters = json.load(f)
with open(SIMILARITIES_FILE, 'r') as f:
    similarities_list = json.load(f)
similarities_dict = {
    item["image_name"]: item["similar_images"]
    for item in similarities_list
}

# ====== Precompute Normalized Features and Cluster Centroids ======
norm_image_features = []
for feat in image_features:
    feat_norm = norm(feat)
    norm_feat = feat / feat_norm if feat_norm != 0 else feat
    norm_image_features.append(norm_feat)
norm_image_features = np.array(norm_image_features)

# Build mapping from cluster id to indices of images
cluster_to_indices = {}
for idx, url in enumerate(valid_image_urls):
    cluster_id = image_clusters.get(url)
    if cluster_id is not None:
        cluster_to_indices.setdefault(cluster_id, []).append(idx)

# Compute cluster centroids (normalized)
cluster_centroids = {}
for cluster_id, indices in cluster_to_indices.items():
    cluster_feats = norm_image_features[indices]
    centroid = np.mean(cluster_feats, axis=0)
    centroid_norm = norm(centroid)
    centroid = centroid / centroid_norm if centroid_norm != 0 else centroid
    cluster_centroids[cluster_id] = centroid

# ====== Ensure the Model is Loaded ======
if 'model' not in globals():
    model = resnet()

# ====== Helper Function for On-the-Fly Feature Extraction ======
def extract_features_from_image(image: Image.Image, model) -> np.ndarray:
    """
    Given a PIL image, extract and return a flattened feature vector using the model.
    Adjust this function based on your model’s API.
    """
    features = model.predict(image)
    return features.flatten()

# ====== FastAPI Application ======
app = FastAPI()

@app.post("/api/get_similar_images")
async def get_similar_images(files: List[UploadFile] = File(...)):
    """
    Accepts one or more image file uploads.
    For each image, it:
      1. Extracts features,
      2. Determines the best matching cluster (via cosine similarity with cluster centroids),
      3. Finds the closest dataset image in that cluster, and
      4. Returns the matched dataset image along with its precomputed similar images.
    """
    results = []
    for upload in files:
        try:
            contents = await upload.read()
            image = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing image {upload.filename}: {e}")
        
        try:
            feat = extract_features_from_image(image, model)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Feature extraction failed for {upload.filename}: {e}")
        
        feat_norm = norm(feat)
        norm_feat = feat / feat_norm if feat_norm != 0 else feat
        
        # Find the best cluster by comparing the image feature with each centroid
        best_cluster = None
        best_cluster_sim = -1
        for cluster_id, centroid in cluster_centroids.items():
            similarity = np.dot(norm_feat, centroid)  # Cosine similarity (features already normalized)
            if similarity > best_cluster_sim:
                best_cluster_sim = similarity
                best_cluster = cluster_id
        
        if best_cluster is None:
            raise HTTPException(status_code=500, detail=f"Could not determine a cluster for {upload.filename}.")
        
        indices = cluster_to_indices.get(best_cluster, [])
        if not indices:
            raise HTTPException(status_code=404, detail=f"No dataset images found in cluster {best_cluster}.")
        
        # Compute cosine similarities within the selected cluster
        cluster_feats = norm_image_features[indices]
        sims = np.dot(cluster_feats, norm_feat)
        best_local_idx = indices[int(np.argmax(sims))]
        matched_dataset_url = valid_image_urls[best_local_idx]
        similarity_score = float(np.max(sims))
        similar_images = similarities_dict.get(matched_dataset_url, [])
        
        results.append({
            "input_image": upload.filename,
            "matched_dataset_image": matched_dataset_url,
            "cluster": best_cluster,
            "similarity_score": similarity_score,
            "similar_images": similar_images
        })
    
    if not results:
        raise HTTPException(status_code=404, detail="No images were processed.")
    
    return {"results": results}

# ====== Run the Server ======
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
