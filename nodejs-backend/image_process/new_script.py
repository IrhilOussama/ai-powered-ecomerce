import os
import json
import cloudinary
import cloudinary.api
import pickle as pkl
import numpy as np
from numpy.linalg import norm
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from resnet import resnet  # Ensure ResNet is correctly implemented
from extract_features import extract_features_from_images_with_url  # Your feature extraction function
import time

# Load environment variables
load_dotenv()

CLOUDINARY_FOLDER = "products"
IMAGE_FEATURES_PATH = os.getenv("IMAGES_FEATURES_FILE", "image_features.pkl")
FILENAMES_PATH = os.getenv("FILENAMES_FILE", "filenames.pkl")
IMAGE_CLUSTERS_FILE = os.getenv("IMAGES_CLUSTERS_FILE", "image_clusters.json")
SIMILARITIES_FILE = os.getenv("SIMILARITIES_FILE", "similarities.json")
CLOUDINARY_PRODUCTS_FOLDER_URL = os.getenv("CLOUDINARY_PRODUCTS_FOLDER_URL")

# Configure Cloudinary API
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Load ResNet model
model = resnet()

# Function to fetch image URLs from Cloudinary with retry mechanism
def fetch_cloudinary_images(retries=3, delay=5):
    for attempt in range(retries):
        try:
            response = cloudinary.api.resources(
                type="upload",
                prefix=CLOUDINARY_FOLDER,
                max_results=500
            )
            images = [f"{CLOUDINARY_PRODUCTS_FOLDER_URL}/{img['public_id']}" for img in response["resources"]]
            return images
        except Exception as e:
            print(f"Error fetching images from Cloudinary (attempt {attempt+1}): {e}")
            time.sleep(delay)
    return []

# Fetch images
image_urls = fetch_cloudinary_images()
print(f"Fetched {len(image_urls)} images from Cloudinary.")

# Extract features with error handling
image_features = []
valid_image_urls = []

for url in image_urls:
    try:
        features = extract_features_from_images_with_url(url, model)
        if isinstance(features, (list, np.ndarray)):  # Ensure it's a list or numpy array
            image_features.append(np.array(features).flatten())
            valid_image_urls.append(url)
        else:
            print(f"Warning: Feature extraction failed for {url}")
    except Exception as e:
        print(f"Error processing {url}: {e}")

# Ensure all features have the same shape
if len(image_features) > 0:
    feature_size = len(image_features[0])
    image_features = np.array([f if len(f) == feature_size else np.zeros(feature_size) for f in image_features])
else:
    print("Error: No valid features extracted. Exiting.")
    exit()

# Save extracted features and valid image URLs
pkl.dump(image_features, open(IMAGE_FEATURES_PATH, 'wb'))
pkl.dump(valid_image_urls, open(FILENAMES_PATH, 'wb'))

# Perform clustering (e.g., KMeans)
NUM_CLUSTERS = min(3, len(image_features))  # Ensure we don't set more clusters than data points
if NUM_CLUSTERS > 1:
    kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(image_features)

    # Save clusters to JSON
    image_clusters = {valid_image_urls[i]: int(cluster_labels[i]) for i in range(len(valid_image_urls))}
    with open(IMAGE_CLUSTERS_FILE, 'w') as f:
        json.dump(image_clusters, f, indent=4)

    print(f"Clustered images and saved to {IMAGE_CLUSTERS_FILE}.")
else:
    print("Skipping clustering: Not enough images to form multiple clusters.")
    image_clusters = {valid_image_urls[i]: 0 for i in range(len(valid_image_urls))}  # Assign all to one cluster

# Compute cosine similarity
closest_images = []
for i, image_name in enumerate(valid_image_urls):
    cluster_id = image_clusters.get(image_name, -1)
    cluster_indices = [idx for idx, img in enumerate(valid_image_urls) if image_clusters.get(img, -1) == cluster_id]
    similarities = cosine_similarity([image_features[i]], [image_features[j] for j in cluster_indices]).flatten()
    
    # Get top similar images
    sorted_indices = np.argsort(similarities)[::-1][1:6]  # Top 5 similar images
    similar_images = [valid_image_urls[cluster_indices[j]] for j in sorted_indices]

    closest_images.append({
        "image_name": image_name,
        "similar_images": similar_images
    })

# Save similarities
with open(SIMILARITIES_FILE, 'w') as json_file:
    json.dump(closest_images, json_file, indent=4)

print(f"Similarities saved to {SIMILARITIES_FILE}.")
