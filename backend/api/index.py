from flask import Flask, send_from_directory, jsonify
import os
import pickle as pkl
from flask_cors import CORS
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
dirname = os.path.dirname(__file__)
IMAGES_FOLDER = os.path.join(dirname, os.getenv("IMAGES_FOLDER_PATH"))
FILENAMES = os.path.join(dirname, os.getenv("FILENAMES_FILE"))
SERVER_IP = os.getenv("SERVER_IP")
PROTOCOLE = os.getenv("SERVER_PROTOCOLE")
SERVER_PORT = os.getenv("SERVER_PORT")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load filenames
try:
    filenames = pkl.load(open(FILENAMES, 'rb'))
except FileNotFoundError:
    filenames = []
    print(f"Warning: File {FILENAMES} not found. Filenames list is empty.")

# Load precomputed similarities
similarities_file = os.path.join(dirname, "similarities.json")
try:
    with open(similarities_file, 'r') as f:
        similarities = json.load(f)
except FileNotFoundError:
    similarities = {}
    print(f"Warning: File {similarities_file} not found. Similarities data is empty.")

# Create API data
image_files = [f for f in os.listdir(IMAGES_FOLDER) if f.lower().endswith(('jpg', 'jpeg', 'png'))]
api = []
for file_name in image_files:
    # Extract numeric part from the filename
    image_id = ''.join(filter(str.isdigit, file_name))
    image_id = int(image_id) if image_id else None

    api.append({
        'id': image_id,
        'image': f"{PROTOCOLE}://{SERVER_IP}:{SERVER_PORT}/images/{file_name}",
        'title': "Test Image",
        'description': "Test image description",
        'category': "Test Category",
        'price': (image_id + 1) * 100 if image_id is not None else 0
    })

# Utility functions
def extract_number(filename):
    """Extract number from a filename."""
    try:
        return int(os.path.splitext(filename)[0])
    except ValueError:
        return None

def get_image_by_number(number):
    """Find image file corresponding to a given number."""
    for file in image_files:
        if extract_number(os.path.basename(file)) == number:
            return file
    return None

# API Endpoints
@app.route('/images/', methods=['GET'])
def list_images():
    """List all available images with their metadata."""
    try:
        return jsonify(api)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/images/id/<int:id>', methods=['GET'])
def serving_image(id):
    """Return metadata for an image with a given ID."""
    try:
        result = next((item for item in api if item['id'] == id), None)
        if result:
            return jsonify(result)
        else:
            return jsonify({'error': 'Image ID not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    """Serve an image file by its filename."""
    try:
        return send_from_directory(IMAGES_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/similar_product/<int:image_id>', methods=['GET'])
def get_product_similar(image_id):
    """Return the image and its similar images based on the provided image_id."""
    try:
        # Search for the specific image_id in the similarities JSON
        similar_items = next((item for item in similarities.values() if item["image_id"] == image_id), None)
        if similar_items:
            return jsonify(similar_items), 200
        else:
            return jsonify({'error': 'Image ID not found in similarities'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=SERVER_PORT, debug=True)
