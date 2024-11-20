from flask import Flask, request, send_from_directory, jsonify
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
cors = CORS(app)

# Load filenames
filenames = pkl.load(open(FILENAMES, 'rb'))

# Load precomputed similarities
similarities_file = os.path.join(dirname, "similarities.json")
with open(similarities_file, 'r') as f:
    similarities = json.load(f)

# Create API data
image_files = [f for f in os.listdir(IMAGES_FOLDER) if f.endswith(('jpg', 'jpeg', 'png'))]
api = []
for file_name in image_files:
    # Extract numeric part from the filename manually
    image_id = ''
    for char in file_name:
        if char.isdigit():  # Check if the character is a digit
            image_id += char

    # Convert the extracted numeric part to an integer if found, otherwise set to None
    image_id = int(image_id) if image_id else None

    api.append({
        'id': image_id,
        'image': f"{PROTOCOLE}://{SERVER_IP}:{SERVER_PORT}/images/{file_name}",
        'title': "test image",
        'description': "test image description",
        'category': "test",
        'price': (image_id + 1) * 100 if image_id is not None else 0  # Default price for invalid IDs
    })

### API Endpoints

@app.route('/images/', methods=['GET'])
def list_images():
    try:
        return jsonify(api)
    except Exception as e:
        return str(e), 500

@app.route('/images/id/<int:id>', methods=['GET'])
def serving_image(id):
    try:
        return jsonify(api[id])
    except Exception as e:
        return str(e), 500

@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    try:
        return send_from_directory(IMAGES_FOLDER, filename)
    except Exception as e:
        return str(e), 500

@app.route('/similar_product/<int:image_id>', methods=['GET'])
def get_similar_product(image_id):
    try:
        if str(image_id) in similarities:
            return jsonify(similarities[str(image_id)]), 200
        else:
            return jsonify({'error': 'Image ID not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=SERVER_PORT, debug=True)
