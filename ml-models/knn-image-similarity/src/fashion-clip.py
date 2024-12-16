import open_clip
from PIL import Image
import torch
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Paths
IMAGES_FOLDER = os.getenv("IMAGES_FOLDER")

# Use a faster/lighter model
MODEL_NAME = 'ViT-B-32-quickgelu'  # Smaller and faster model
PRETRAINED = 'openai'

# Load the model, tokenizer, and preprocessors
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED)
model = model.to(device)
tokenizer = open_clip.get_tokenizer(MODEL_NAME)

# Process image
myImg = os.path.join(IMAGES_FOLDER, "10.jpg")
image = preprocess(Image.open(myImg)).unsqueeze(0).to(device)

# Text inputs
texts = ["a hat", "a t-shirt", "shoes"]
text_tokens = tokenizer(texts).to(device)

# Perform inference
with torch.no_grad():
    # Encode image and text
    image_features = model.encode_image(image)
    text_features = model.encode_text(text_tokens)

    # Normalize features
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)

    # Compute probabilities
    text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)

# Output results
print("Label probs:", text_probs)
