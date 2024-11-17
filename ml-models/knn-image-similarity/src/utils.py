from PIL import Image
import matplotlib.pyplot as plt

def show_image(image_path):
    img = Image.open(image_path)
    plt.imshow(img)
    plt.axis('off')
    plt.show()
