import os
import json
import numpy as np
from numpy.linalg import norm
from dotenv import load_dotenv
from resnet import resnet  # Assuming you have a ResNet model
from extract_features import extract_features_from_images  # Assuming you have this function

# Load environment variables
load_dotenv()

# Paths
IMAGES_FOLDER = os.getenv("IMAGES_FOLDER_PATH")
IMAGE_FEATURES_PATH = os.getenv("IMAGES_FEATURES_FILE")
FILENAMES_PATH = os.getenv("FILENAMES_FILE")
IMAGE_CLUSTERS_FILE = os.getenv("IMAGES_CLUSTERS_FILE")

# Load the ResNet model
model = resnet()

def load_features_and_filenames():
    with open(IMAGE_FEATURES_PATH, 'rb') as f:
        image_features = np.load(f, allow_pickle=True)
    with open(FILENAMES_PATH, 'rb') as f:
        filenames = np.load(f, allow_pickle=True)
    return image_features, filenames

def calculate_cosine_similarity(feature1, feature2):
    """
    Calculate cosine similarity between two feature vectors.
    
    Args:
        feature1 (np.array): Feature vector of the first image.
        feature2 (np.array): Feature vector of the second image.
    
    Returns:
        float: Cosine similarity between the two feature vectors.
    """
    return np.dot(feature1, feature2) / (norm(feature1) * norm(feature2))

def assign_cluster(new_feature, image_features, filenames):
    """
    Assign a new image to the most similar cluster.
    
    Args:
        new_feature (np.array): Feature vector of the new image.
        image_features (list): List of feature vectors for existing images.
        filenames (list): List of filenames for existing images.
    
    Returns:
        int: Cluster ID for the new image.
    """
    # Load the current clusters
    with open(IMAGE_CLUSTERS_FILE, 'r') as f:
        image_clusters = json.load(f)
    
    # Calculate average similarity to each cluster
    cluster_similarities = {}
    for filename, feature in zip(filenames, image_features):
        cluster_id = image_clusters.get(filename, -1)
        if cluster_id == -1:
            continue  # Skip unclustered images
        similarity = calculate_cosine_similarity(new_feature, feature)
        if cluster_id not in cluster_similarities:
            cluster_similarities[cluster_id] = []
        cluster_similarities[cluster_id].append(similarity)
    
    # Calculate average similarity per cluster
    avg_similarities = {
        cluster_id: np.mean(similarities)
        for cluster_id, similarities in cluster_similarities.items()
    }
    
    # Assign to the cluster with the highest average similarity
    if not avg_similarities:
        return -1  # No clusters found
    return max(avg_similarities, key=avg_similarities.get)

def add_new_image(new_image_path):
    """
    Add a new image, determine its cluster
    
    Args:
        new_image_path (str): Path to the new image file.
    """
    # Extract features for the new image
    new_feature = extract_features_from_images(new_image_path, model)
    
    # Load existing features and filenames
    image_features, filenames = load_features_and_filenames()
    
    # Assign the new image to a cluster
    cluster_id = assign_cluster(new_feature, image_features, filenames)
    
    if cluster_id == -1:
        print("No clusters found. Creating a new cluster.")
        cluster_id = 0  # Default to cluster 0 if no clusters exist
    
    # Update the clusters file
    with open(IMAGE_CLUSTERS_FILE, 'r') as f:
        image_clusters = json.load(f)
    
    new_image_name = os.path.basename(new_image_path)
    image_clusters[new_image_name] = cluster_id
    
    with open(IMAGE_CLUSTERS_FILE, 'w') as f:
        json.dump(image_clusters, f, indent=4)
    
    print(f"New image '{new_image_name}' added to cluster {cluster_id}.")

def main():
    # Example: Path to the new image
    new_image_path = "C:\\Users\\J.P.M\\Desktop\\ai-powered-ecomerce\\nodejs-backend\\public\\images\\5cb93982-d91e-4453-8a64-66f16a35d56d.jpg"  # Replace with the actual path
    
    # Add the new image and determine its cluster
    add_new_image(new_image_path)

if __name__ == "__main__":
    main()