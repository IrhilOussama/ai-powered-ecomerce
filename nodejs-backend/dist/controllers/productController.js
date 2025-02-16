import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { saveBase64Image } from '../utils/fileUtils.js';
import { promises as fs } from 'fs';
import path from 'path';
const SIMILARITIES_FILE = "./data/similarities.json";
const IMAGES_FOLDER_PATH = "./public/images";
if (!SIMILARITIES_FILE) {
    throw new Error("SIMILARITIES_FILE is not defined");
}
if (!IMAGES_FOLDER_PATH) {
    throw new Error("IMAGES_FOLDER_PATH is not defined");
}
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    }
    catch (error) {
        console.error("error fetching products: " + error);
        res.status(500).json({ error: "error fetching products" });
    }
};
export const getProduct = async (req, res) => {
    try {
        const product = await Product.getOne(req.params.id);
        if (product === undefined)
            return res.json({ error: "no such product with this id" });
        let similarProducts = await Product.getSimilars(req.params.id);
        let ids = similarProducts.map((e) => {
            return e.similar_product_id;
        });
        product['similar_products_ids'] = ids;
        res.json(product);
    }
    catch (error) {
        console.error("error fetching product: " + error);
        res.status(500).json({ error: "error fetching product" });
    }
};
export const getSimilarProducts = async (req, res) => {
    try {
        const similar_products = await Product.getSimilars(req.params.id);
        res.json({ product_id: req.params.id, similar_products });
    }
    catch (error) {
        console.error("error fetching similar products: " + error);
        res.status(500).json({ error: "error fetching similar products" });
    }
};
export const getRecommandedProducts = async (req, res) => {
    try {
        let user_id = req.user.userId;
        console.log(user_id);
        const user_product_recommandations = (await Product.getRecommanded(user_id));
        const recommanded_products_ids = user_product_recommandations.map(e => e.product_id);
        res.json({ recommanded_products_ids });
    }
    catch (error) {
        console.error("error fetching similar products: " + error);
        res.status(500).json({ error: "error fetching similar products" });
    }
};
export const createProduct = async (req, res) => {
    try {
        let { title, description, category_id, price, image } = req.body;
        // Validate required fields
        if (!title || !price || !description || !image || !category_id) {
            res.status(400).json({ error: 'title, description, categorie_id, image and price are required fields' });
            return;
        }
        // check for the category id
        const myCategorie = await Category.getOne(category_id);
        if (myCategorie === undefined)
            res.json({ error: "category dosn't exist" });
        // Save the base64 image and get the image
        let filename = await saveBase64Image(image);
        console.log('Image saved as:', filename);
        // Insert product with the new image image
        const newProduct = await Product.create({ title, description, category_id, price, image: filename });
        // response
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    }
    catch (error) {
        console.error("error creating product: " + error);
        res.status(500).json({ error: "error creating product" });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id, title, description, category_id, price, image } = req.body;
        let result;
        // Validate required fields
        if (!id || !title || !price || !image || !description || !category_id) {
            res.status(400).json({ error: 'id, title, description, categorie_id, image and price are required fields' });
            return;
        }
        // check for the category id
        const myCategorie = Category.getOne(category_id);
        if (!myCategorie)
            res.json({ error: "category dosn't exist" });
        if (image == "do-not-update") {
            // update product with the new data
            result = await Product.updateExceptImage({ id, title, description, category_id, price });
            if (result !== undefined)
                res.status(201).json({
                    message: 'Product updated successfully',
                    product: result
                });
            else {
                res.status(500).json({
                    message: 'error while updating product'
                });
            }
        }
        else {
            // Save the base64 image and get the image
            const filename = await saveBase64Image(image);
            console.log('Image saved as:', filename);
            // update product with the new data + image
            result = await Product.update({ id, title, description, category_id, price, image: filename });
            res.status(201).json({
                message: 'Product updated successfully',
                product: result
            });
        }
    }
    catch (error) {
        console.error("error updating product: " + error);
        res.status(500).json({ error: "error updating product" });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const productImage = (await Product.getOne(req.params.id)).image;
        if (!productImage)
            throw new Error("error in product controller image is undefined");
        console.log(path.join(IMAGES_FOLDER_PATH, productImage));
        if (productImage) {
            fs.unlink(path.resolve(IMAGES_FOLDER_PATH, productImage));
        }
        const product = await Product.delete(req.params.id);
        res.json({ msg: "product with id " + req.params.id + " has deleted successfuly" });
    }
    catch (error) {
        console.error("error deleting product: " + error);
        res.status(500).json({ error: "error deleting product" });
    }
};
