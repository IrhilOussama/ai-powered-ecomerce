import os
import pickle as pkl
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
from PIL import Image
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
dirname = os.path.dirname(__file__)
IMAGES_FOLDER = os.path.join(dirname, os.getenv("IMAGES_FOLDER_PATH"))
IMAGES_FEATURES = os.path.join(dirname, os.getenv("IMAGES_FEATURES_FILE"))
FILENAMES = os.path.join(dirname, os.getenv("FILENAMES_FILE"))
PROTOCOLE = os.getenv("SERVER_PROTOCOLE")
SERVER_IP = os.getenv("SERVER_IP")
SERVER_PORT = os.getenv("SERVER_PORT")

# Load ResNet50 model for feature extraction
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])

# Load precomputed features and filenames
Image_features = pkl.load(open(IMAGES_FEATURES, 'rb'))
filenames = pkl.load(open(FILENAMES, 'rb'))

# Initialize K-Nearest Neighbors model
neighbors = NearestNeighbors(n_neighbors=5, algorithm='brute', metric='euclidean')
neighbors.fit(Image_features)

# Function to extract features from an image
def extract_features_from_image(img):
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_preprocessed = preprocess_input(img_array)
    features = model.predict(img_preprocessed).flatten()
    return features / np.linalg.norm(features)

# Precompute similarities
def precompute_similarities():
    results = {}
    image_files = [f for f in os.listdir(IMAGES_FOLDER) if f.endswith(('jpg', 'jpeg', 'png'))]

    for idx, img_name in enumerate(image_files):
        try:
            img_path = os.path.join(IMAGES_FOLDER, img_name)
            img = Image.open(img_path)
            img_features = extract_features_from_image(img)

            # Find the 5 most similar images
            distances, indices = neighbors.kneighbors([img_features])
            
            # Generate URLs with only the basename of the image
            similar_images = [
                f"{PROTOCOLE}://{SERVER_IP}:{SERVER_PORT}/images/{os.path.basename(filenames[i])}"
                for i in indices[0]
            ]
            results[idx] = {
                'image_id': idx,
                'similar_images': similar_images
            }
        except Exception as e:
            print(f"Error processing {img_name}: {e}")

    # Save results to JSON file
    similarities_file = os.path.join(dirname, "similarities.json")
    with open(similarities_file, 'w') as f:
        json.dump(results, f, indent=4)
    print("Similarities saved to 'similarities.json'")

if __name__ == '__main__':
    precompute_similarities()
