import pickle as pkl
import numpy as np
import os
from sklearn.cluster import KMeans
from dotenv import load_dotenv
from extract_features import extract_features_from_images
from utils import show_image 
from resnet import resnet

# Load environment variables
load_dotenv()

# Paths
IMAGES_FOLDER = os.getenv("IMAGES_FOLDER")
IMAGE_FEATURES_PATH = os.getenv("IMAGES_FEAUTURES_FILE")
FILENAMES_PATH = os.getenv("FILENAMES_FILE")

# Load ResNet model
model = resnet()

# Load image features and filenames
Image_features = pkl.load(open(IMAGE_FEATURES_PATH, 'rb'))
filenames = pkl.load(open(FILENAMES_PATH, 'rb'))

# Set number of clusters (K)
K = 3  # You can change this value to the desired number of clusters

# Apply K-means clustering to the image features
kmeans = KMeans(n_clusters=K, random_state=42)
kmeans.fit(Image_features)

# Get the cluster labels for each image
cluster_labels = kmeans.labels_

# Print out the cluster labels for each image
print("Cluster Labels for each image:")
for i, label in enumerate(cluster_labels):
    print(f"Image {filenames[i]} is in cluster {label}")

# Save the cluster labels for further use (optional)
with open('cluster_labels.pkl', 'wb') as f:
    pkl.dump(cluster_labels, f)

 