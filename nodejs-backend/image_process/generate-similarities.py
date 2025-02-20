import pickle as pkl
import numpy as np
import os
import json
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to the image features and filenames
IMAGES_FEATURES = os.getenv("IMAGES_FEATURES_FILE")
FILENAMES = os.getenv("FILENAMES_FILE")

# Path to the saved image_clusters.json file
IMAGE_CLUSTERS_FILE = os.getenv("IMAGES_CLUSTERS_FILE")  # Path to the JSON file with cluster IDs

# Path to save the output JSON file
OUTPUT_JSON_FILE = os.getenv("SIMILARITIES_FILE")

# Load image features and filenames
Image_features = pkl.load(open(IMAGES_FEATURES, 'rb'))
filenames = pkl.load(open(FILENAMES, 'rb'))

# Load the image_clusters.json file
with open(IMAGE_CLUSTERS_FILE, 'r') as f:
    image_clusters = json.load(f)

# Convert image_clusters to a dictionary mapping filenames to cluster IDs
filename_to_cluster = {os.path.basename(k): v for k, v in image_clusters.items()}

# Create a list to store the closest images as an array of objects
closest_images = []

# Function to calculate cosine similarity
def calculate_similarity(image_idx):
    """Calculate cosine similarity for a single image."""
    feature = Image_features[image_idx].reshape(1, -1)
    similarities = cosine_similarity(feature, Image_features)
    return similarities.flatten()

# Loop through each image and find all similar images in the same cluster
for i, filename in enumerate(filenames):
    # Get the cluster label for the current image
    image_name = os.path.basename(filename)
    cluster_id = filename_to_cluster.get(image_name, -1)  # Default to -1 if not found
    
    # Find images in the same cluster
    cluster_indices = [
        idx for idx, fname in enumerate(filenames)
        if filename_to_cluster.get(os.path.basename(fname), -1) == cluster_id
    ]
    
    # Calculate similarities between the current image and others in the same cluster
    similarities = calculate_similarity(i)
    
    # Create a list of tuples (filename, similarity) for images in the same cluster
    cluster_similarities = [
        (filenames[idx], similarities[idx]) 
        for idx in cluster_indices 
        if idx != i  # Exclude the current image
    ]
    
    # Sort the similar images by similarity (descending order)
    cluster_similarities = sorted(cluster_similarities, key=lambda x: x[1], reverse=True)
    
    # Extract filenames of similar images in order of similarity
    similar_images = [
        f"{os.path.basename(similar_image)}" 
        for similar_image, _ in cluster_similarities
    ]
    
    # Append the result as an object to the list
    closest_images.append({
        "image_name": image_name,
        "similar_images": similar_images  # All similar images, ordered by similarity
    })

# Save the results as a JSON file
with open(OUTPUT_JSON_FILE, 'w') as json_file:
    json.dump(closest_images, json_file, indent=4)

print(f"Closest images data has been saved to {OUTPUT_JSON_FILE}.")