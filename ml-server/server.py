import os
import io
import numpy as np
import psycopg2
from fastapi import FastAPI, HTTPException, UploadFile, File
from numpy.linalg import norm
from dotenv import load_dotenv
from urllib.parse import unquote
import logging
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
from PIL import Image
import requests
import ast  # Used to safely parse the string representation of lists

# Import your model (ensure resnet.py exists and has a resnet() function)
from resnet import resnet

# Setup logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Database credentials
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
BACKEND_API = os.getenv("BACKEND_API")

# Function to get a database connection
def get_db_connection():
    try:
        return psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Initialize FastAPI app
app = FastAPI()

# Load the feature extraction model once, globally
model = resnet()

@app.post("/api/get_similar_images")
async def get_similar_images(file: UploadFile = File(...)):
    """
    Accepts an image file, extracts its features using the model,
    compares with features in the database, and returns similar image URLs.
    """
    try:
        # Read file contents and load the image
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((224, 224))
        
        # Preprocess the image for ResNet50
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        # Extract features from the uploaded image
        input_features = model.predict(img_array).flatten()
        
        # Connect to the database and retrieve stored image features
        conn = get_db_connection()
        cur = conn.cursor()
        TABLE_NAME = "images_features"  # Ensure this matches your table name
        
        cur.execute(f"SELECT url, features FROM {TABLE_NAME}")
        all_images = cur.fetchall()
        
        similarities = []
        for img_url, features in all_images:
            # If features are stored as a string, parse them into a list
            if isinstance(features, str):
                try:
                    features_parsed = ast.literal_eval(features)
                except Exception as parse_error:
                    logging.error(f"Error parsing features for {img_url}: {parse_error}")
                    continue
            else:
                features_parsed = features
            
            features_np = np.array(features_parsed, dtype=np.float32)
            
            # Compute cosine similarity between the input features and stored features
            similarity = np.dot(input_features, features_np) / (norm(input_features) * norm(features_np))
            similarities.append((img_url, similarity))
        
        # Sort by similarity (highest first) and get top 5 similar images
        similarities.sort(key=lambda x: x[1], reverse=True)
        similar_images = [img[0] for img in similarities][:5]
        similar_images_filenames = []

        for image_url in similar_images:
            # Extract the filename from the URL
            filename = image_url.split("/")[-1]
            # Remove the file extension
            filename_without_extension = filename.split(".")[0]
            # Add the filename (without extension) to the new array
            similar_images_filenames.append(filename_without_extension)
        
        cur.close()
        conn.close()

        products = []

        # Loop through each image filename and make a request
        for filename in similar_images_filenames:
            url = f"{BACKEND_API}/products/image/{filename}"
            
            try:
                response = requests.get(url)
                if response.status_code == 200:  # Ensure request was successful
                    product_data = response.json()
                    products.append(product_data)
                else:
                    print(f"Failed to fetch product for {filename}, Status Code: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"Error fetching product for {filename}: {e}")
        
        # SERVERING PRODUCTS ARRAY
        logging.info(f"Similar images found: {products}")
        return products
    
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=traceback.format_exc())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
