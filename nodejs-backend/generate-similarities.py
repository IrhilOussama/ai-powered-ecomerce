import pickle as pkl
import numpy as np
import os
import json
from sklearn.cluster import KMeans
from resnet import resnet
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv();

# Paths
dirname = os.path.dirname(__file__)
IMAGES_FEATURES = os.path.join(dirname, os.getenv("IMAGES_FEATURES_FILE"))
FILENAMES = os.path.join(dirname, os.getenv("FILENAMES_FILE"))

jsonFilePath = os.path.join(dirname, "similarities.json");
SERVER_IP = os.getenv("SERVER_IP")
PROTOCOLE = os.getenv("SERVER_PROTOCOLE")
SERVER_PORT = os.getenv("SERVER_PORT")

# Load ResNet model 
model = resnet()

# Load image features and filenames
Image_features = pkl.load(open(IMAGES_FEATURES, 'rb'))
filenames = pkl.load(open(FILENAMES, 'rb'))

# Set number of clusters (K)
K = 3  # You can change this value to the desired number of clusters

# Apply K-means clustering to the image features
kmeans = KMeans(n_clusters=K, random_state=42)
kmeans.fit(Image_features)

# Get the cluster labels for each image
cluster_labels = kmeans.labels_

# Similarity threshold (adjustable)
SIMILARITY_THRESHOLD = 0.6  # Include images with similarity above this threshold

# Create a dictionary to store the closest images by cluster
closest_images = {}

# Function to calculate cosine similarity
def calculate_similarity(image_idx):
    """Calculate cosine similarity for a single image."""
    feature = Image_features[image_idx].reshape(1, -1)
    similarities = cosine_similarity(feature, Image_features)
    return similarities.flatten()

# Loop through each image and find dynamically filtered closest images
for i, filename in enumerate(filenames):
    # Get the cluster label for the current image
    cluster_id = cluster_labels[i]
    
    # Find images in the same cluster
    cluster_indices = np.where(cluster_labels == cluster_id)[0]
    
    # Calculate similarities between the current image and others in the same cluster
    similarities = calculate_similarity(i)
    
    # Filter by threshold and exclude the current image
    cluster_similarities = [
        (filenames[idx], similarities[idx]) 
        for idx in cluster_indices 
        if idx != i and similarities[idx] >= SIMILARITY_THRESHOLD
    ]
    
    # Sort the similar images by similarity (descending order)
    cluster_similarities = sorted(cluster_similarities, key=lambda x: x[1], reverse=True)
    
    # Construct the structure as needed
    similar_images = [
        f"{PROTOCOLE}://{SERVER_IP}:{SERVER_PORT}/api/images/{os.path.basename(similar_image)}" 
        for similar_image, _ in cluster_similarities
    ]
    
    # Store the results in the desired format
    closest_images[str(i)] = {
        "image_name": os.path.basename(filename),
        "similar_images": similar_images
    }

# Save the results as a JSON file
with open(jsonFilePath, 'w') as json_file:
    json.dump(closest_images, json_file, indent=4)

print(f"Closest images data has been saved to {jsonFilePath}.")
