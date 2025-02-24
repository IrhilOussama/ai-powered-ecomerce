import numpy as np
from numpy.linalg import norm
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
# Feature extraction function

import requests
import numpy as np
from PIL import Image
from io import BytesIO
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image

def extract_features_from_images_with_url(image_url, model):
    try:
        # Download image from URL
        response = requests.get(image_url)
        response.raise_for_status()  # Raise error for invalid requests
        
        # Convert to PIL Image
        img = Image.open(BytesIO(response.content)).convert("RGB")
        img = img.resize((224, 224))  # Resize for ResNet
        
        # Convert to array
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)  # Normalize for ResNet
        
        # Extract features using the model
        features = model.predict(img_array)
        return features.flatten()
    
    except Exception as e:
        print(f"Error processing {image_url}: {e}")
        return None  # Return None for failed images

def extract_features_from_images(image_path, model):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocess = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocess).flatten()
    norm_result = result / norm(result)
    return norm_result