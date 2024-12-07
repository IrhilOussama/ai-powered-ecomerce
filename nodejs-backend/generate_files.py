import os
import pickle as pkl
import numpy as np
from numpy.linalg import norm
from dotenv import load_dotenv
from resnet import resnet
from extract_features import extract_features_from_images
load_dotenv()

dirname = os.path.dirname(__file__)

# Get the path to the raw dataset from the environment variables
IMAGES_FOLDER = os.path.join(dirname, os.getenv("IMAGES_FOLDER_PATH"));
IMAGE_FEATURES_PATH = os.path.join(dirname, os.getenv("IMAGES_FEATURES_FILE"));
FILENAMES_PATH =  os.path.join(dirname, os.getenv("FILENAMES_FILE"));

# Load model
model = resnet();

# Process all images\# Helper function to extract the numeric part of the file name
def extract_number(filename):
    # Remove the file extension and extract the name
    return os.path.splitext(filename)[0]

# List files and sort numerically by the numeric part
filenames = [
    os.path.join(IMAGES_FOLDER, file)
    for file in sorted(os.listdir(IMAGES_FOLDER), key=extract_number)
]

image_features = [extract_features_from_images(file, model) for file in filenames]

# Save features and filenames
pkl.dump(image_features, open(IMAGE_FEATURES_PATH, 'wb'))
pkl.dump(filenames, open(FILENAMES_PATH, 'wb'));

