import pickle as pkl
import numpy as np
import os
import json
from sklearn.cluster import KMeans
from resnet import resnet
from PIL import Image
from torchvision import transforms
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to the image features and filenames
IMAGES_FEATURES = os.getenv("IMAGES_FEATURES_FILE")
FILENAMES = os.getenv("FILENAMES_FILE")

# Path to save the JSON file
OUTPUT_JSON_FILE = "image_clusters.json"  # Output JSON file

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

# Create a dictionary to store image filenames and their cluster IDs
image_clusters = {}

# Loop through each image and assign its cluster ID
for i, filename in enumerate(filenames):
    image_name = os.path.basename(filename)
    cluster_id = int(cluster_labels[i])  # Convert to int for JSON compatibility
    image_clusters[image_name] = cluster_id

# Save the results as a JSON file
with open(OUTPUT_JSON_FILE, 'w') as json_file:
    json.dump(image_clusters, json_file, indent=4)

print(f"Image clusters data has been saved to {OUTPUT_JSON_FILE}.")