from flask import Flask, request, send_from_directory, jsonify
import os;
import pickle as pkl
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
from PIL import Image
import io
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
dirname = os.path.dirname(__file__)
# Access environment variables
IMAGES_FOLDER = os.path.join(dirname ,os.getenv("IMAGES_FOLDER_PATH"))
IMAGES_FEATURES = os.path.join(dirname ,os.getenv("IMAGES_FEATURES_FILE"))
FILENAMES = os.path.join(dirname ,os.getenv("FILENAMES_FILE"))

SERVER_IP = os.getenv("SERVER_IP");
PROTOCOLE = os.getenv("SERVER_PROTOCOLE");
SERVER_PORT = os.getenv("SERVER_PORT");
DISTANCE_THRESHOLD = 0.5  # Example threshold; adjust based on your data

# Initialize Flask app
app = Flask(__name__)
cors = CORS(app);


# Load precomputed image features and filenames from pickle files
Image_features = pkl.load(open(IMAGES_FEATURES, 'rb'))
filenames = pkl.load(open(os.path.join(dirname ,FILENAMES), 'rb'))

# Set up K-Nearest Neighbors model for finding similar images
neighbors = NearestNeighbors(n_neighbors=5, algorithm='brute', metric='euclidean')
neighbors.fit(Image_features)

# Load ResNet50 model for feature extraction
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224,224,3))
model.trainable = False
model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])

# Function to extract features from an image using ResNet50
def extract_features_from_image(img):
    # Resize and preprocess the image
    img = img.convert('RGB')  # Ensure it's RGB format
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_preprocessed = preprocess_input(img_array)

    # Extract features
    features = model.predict(img_preprocessed).flatten()
    features = features / np.linalg.norm(features)  # Normalize the features
    return features

# Route to handle image upload and find similar images
@app.route('/find_similar_images', methods=['POST'])
def find_similar_images():
    # Check if the image is part of the request
    # if 'image' not in request.files:
    #     return jsonify({'error': 'No image part'}), 400

    # file = request.files['image']

    # if file.filename == '':
    #     return jsonify({'error': 'No selected file'}), 400
    # image_url = request.form.get('image');

    # Get the 'url' parameter from the form data in the POST request
    image = request.form.get('url')  # This is the dynamic image path

    # Ensure the 'url' parameter is provided
    if not image:
        return jsonify({'error': 'No image URL provided'}), 400

    # Construct the full image path
    img_path = os.path.join(IMAGES_FOLDER, image) 

    print(f"Image Path: {img_path}");
    # Read the image and extract features
    try:
        # img = Image.open(io.BytesIO(file.read()))
        img = Image.open(img_path)
        img_features = extract_features_from_image(img)

        # Find similar images using KNN
        distances, indices = neighbors.kneighbors([img_features])

        # Get the paths of the similar images
        similar_images = [filenames[i] for i in indices[0]]

        # Create URLs for the similar images by appending the base URL
        base_url = request.host_url + 'images/'
        similar_images = [base_url + os.path.basename(filename) for filename in similar_images]

        # Return the paths of the similar images as JSON response
        return jsonify({'similar_images': similar_images}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




image_files = [f for f in os.listdir(IMAGES_FOLDER) if f.endswith(('jpg', 'jpeg', 'png'))]
api = [];
for i in range(len(image_files)):
    api.append({
        'id': i,
        'image': PROTOCOLE + '://' + SERVER_IP + ':' + SERVER_PORT + '/images/' + image_files[i],
        'title': "test image",
        'description': "test image description",
        'category': "test",
        'price': (i+1)*100
    })

### IMAGES SERVER
@app.route('/images/', methods=['GET'])
def list_images():
    try:
        # List all files in the images folder
        # Return the list of image file names as JSON
        return jsonify(api)
    
    except Exception as e:
        return str(e), 500

@app.route('/images/id/<id>', methods=['GET'])
def serving_image(id):
    try:
        # Serve the specific image from the folder
        return jsonify(api[int(id)]);
    except Exception as e:
        return str(e), 500

# Route to serve a specific image
@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    try:
        # Serve the specific image from the folder
        return send_from_directory(IMAGES_FOLDER, filename)
    
    except Exception as e:
        return str(e), 500


# Start the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=SERVER_PORT, debug=True)