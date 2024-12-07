from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
import tensorflow as tf

# Load model
def resnet():
    # Load model
    model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    model.trainable = False
    model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])
    return model