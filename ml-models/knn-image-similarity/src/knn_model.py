import pickle as pkl
from sklearn.neighbors import NearestNeighbors
import numpy as np
import os
from utils import show_image 
# from extract_features import extract_features_from_images;
from dotenv import load_dotenv
from numpy.linalg import norm
from extract_features import extract_features_from_images
from resnet import resnet
load_dotenv()

# Get the path to the raw dataset from the environment variables
IMAGES_FOLDER = os.getenv("IMAGES_FOLDER");
IMAGE_FEATURES_PATH = os.getenv("IMAGES_FEAUTURES_FILE");
FILENAMES_PATH =  os.getenv("FILENAMES_FILE");

# resnet model
model = resnet();

# Load data
Image_features = pkl.load(open(IMAGE_FEATURES_PATH, 'rb'))
filenames = pkl.load(open(FILENAMES_PATH, 'rb'))

# KNN Model
neighbors = NearestNeighbors(n_neighbors=5, algorithm='brute', metric='euclidean')
neighbors.fit(Image_features)

# Input image
input_image_path = os.path.join(IMAGES_FOLDER, '10.jpg')

# Extract input image features
input_feature = extract_features_from_images(input_image_path, model)

# Find similar images
distances, indices = neighbors.kneighbors([input_feature])

# Display results
print("Distances:", distances[0])
print("Indices:", indices[0])
show_image(input_image_path)

for index in indices[0]:
    similar_image_path = filenames[index]
    if os.path.exists(similar_image_path):
        show_image(similar_image_path)
    else:
        print(f"Image not found: {similar_image_path}")
