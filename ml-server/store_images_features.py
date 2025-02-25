import cloudinary
import cloudinary.api
import psycopg2
import numpy as np
import requests
import io
import os
from dotenv import load_dotenv
from tensorflow.keras.preprocessing import image
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.layers import GlobalMaxPool2D
from PIL import Image

# 🔹 Load Environment Variables
load_dotenv()

# 🔹 Cloudinary Configuration (Now Secure)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# 🔹 Load ResNet50 Feature Extractor
def resnet():
    model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    model.trainable = False
    model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])
    return model

feature_extractor = resnet()

# 🔹 Function to Extract Features from Image URL
def extract_features_from_url(img_url, model):
    response = requests.get(img_url)
    img = Image.open(io.BytesIO(response.content)).convert("RGB")  # Convert to RGB
    img = img.resize((224, 224))  # Resize for ResNet
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)  # Normalize

    features = model.predict(img_array)  # Extract features
    return features.flatten().tolist()  # Convert to list for PostgreSQL storage

# 🔹 Connect to PostgreSQL Using Env Variables
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT", "5432"),  # Default PostgreSQL port
    sslmode=os.getenv("SSL_MODE", "require")
)
cursor = conn.cursor()

# 🔹 Ensure Table Exists
cursor.execute("""
    CREATE TABLE IF NOT EXISTS images_features (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        features FLOAT8[]  -- Using ARRAY instead of VECTOR
    )
""")
conn.commit()

# 🔹 Fetch Image URLs from Cloudinary
cloudinary_images = cloudinary.api.resources(type="upload", max_results=100)  # Adjust max_results as needed

# 🔹 Process Each Image and Store Features
for img in cloudinary_images["resources"]:
    img_name = img["public_id"]
    img_url = img["secure_url"]

    print(f"Processing: {img_name}")

    # Extract Features
    features = extract_features_from_url(img_url, feature_extractor)

    # Insert into PostgreSQL
    cursor.execute(
        "INSERT INTO images_features (name, url, features) VALUES (%s, %s, %s)",
        (img_name, img_url, features)  # ✅ Convert to list before inserting
    )

# 🔹 Commit and Close DB Connection
conn.commit()
cursor.close()
conn.close()

print("✅ All images processed and stored in PostgreSQL!")
