import Category from '../models/Category.js';
import Product, { user_product_recommandation } from '../models/Product.js';
import { saveBase64Image } from '../utils/fileUtils.js';
import { Request, Response } from 'express';
import {promises as fs} from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

const SIMILARITIES_FILE = "./data/similarities.json";
const IMAGES_FOLDER_PATH = "./public/images";

if (!SIMILARITIES_FILE){
    throw new Error("SIMILARITIES_FILE is not defined")
}
if (!IMAGES_FOLDER_PATH){
    throw new Error("IMAGES_FOLDER_PATH is not defined")
}

export const getAllProducts = async (req: Request, res: Response) => {
    try{
        const products = await Product.getAll();
        
        res.json(products);
    } catch(error){
        console.error("error fetching products: " + error);
        res.status(500).json({error: "error fetching products"});
    }
}

interface similar_product {
    product_id: string,
    similar_product_id: string, 
    rank: string
}

export const getProduct = async (req: Request, res: Response) : Promise<void> => {
    try{
        const product = await Product.getOne(req.params.id);
        if (product === undefined) res.json({error: "no such product with this id"});
        let similarProducts: similar_product[] = await Product.getSimilars(req.params.id);
        let ids: string[] = similarProducts.map((e: similar_product) => {
            return e.similar_product_id;
        })
        product['similar_products_ids'] = ids;
        res.json(product);
    } catch(error){
        console.error("error fetching product: " + error);
        res.status(500).json({error: "error fetching product"});
    }
}


export const getSimilarProducts = async (req: Request, res: Response) => {
    try {
        const similar_products = await Product.getSimilars(req.params.id);
        res.json({product_id: req.params.id, similar_products})
    } catch(error){
        console.error("error fetching similar products: " + error);
        res.status(500).json({error: "error fetching similar products"});
    }
}



export const getRecommandedProducts = async (req: Request, res: Response) => {
    try {
        let user_id = (req as any).user.userId;
        console.log(user_id)
        const user_product_recommandations: user_product_recommandation[] = (await Product.getRecommanded(user_id));
        const recommanded_products_ids: string[] = user_product_recommandations.map(e => e.product_id );
        res.json({recommanded_products_ids})
    } catch(error){
        console.error("error fetching similar products: " + error);
        res.status(500).json({error: "error fetching similar products"});
    }
}



export const createProduct = async (req: Request, res: Response) => {
    let uploadedImage;
    try {
        let { title, description, category_id, price, image } = req.body;
        const base64Prefix = "data:image/jpeg;base64,";

        // Validate required fields
        if (!title || !price || !description || !image || !category_id) {
            res.status(400).json({ error: 'title, description, category_id, image, and price are required fields' });
            return;
        }
        console.log(1)

        // Check if the category exists
        const myCategory = await Category.getOne(category_id);
        if (!myCategory) {
            res.status(404).json({ error: "Category doesn't exist" });
            return;
        }

        if (!image.startsWith("data:image")) {
            image = base64Prefix + image;
        }
        console.log(3)

        // Upload image to Cloudinary
        uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "products", // Organize images in a Cloudinary folder
            use_filename: true,
            unique_filename: true,
            overwrite: true,
        });
        
        console.log(4)

        // Save product to database with Cloudinary image URL
        const newProduct = await Product.create({
            title,
            description,
            category_id,
            price,
            image: uploadedImage.secure_url, // Use Cloudinary URL instead of local filename
        });
        

        // Send response
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        // console.error("Error creating product:", error);
        console.log(uploadedImage)
        res.status(500).json({ error: "Internal server error" });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    try{
        const { id, title, description, category_id, price, image } = req.body;
        let result;
        
        // Validate required fields
        if (!id || !title || !price || !image || !description || !category_id) {
            res.status(400).json({ error: 'id, title, description, categorie_id, image and price are required fields' });
            return;
        }
        
        // check for the category id
        const myCategorie = Category.getOne(category_id);
        if (!myCategorie) res.json({error: "category dosn't exist"})
        
        if (image == "do-not-update") {
            // update product with the new data
            result = await Product.updateExceptImage({ id, title, description, category_id, price})
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
            result = await Product.update({id, title, description, category_id, price, image: filename})
        
            res.status(201).json({
            message: 'Product updated successfully',
            product: result
            });
        }
    } catch(error){
        console.error("error updating product: " + error);
        res.status(500).json({error: "error updating product"});
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try{
        const productImage = (await Product.getOne(req.params.id)).image;
        if (!productImage) throw new Error("error in product controller image is undefined")
        // console.log(path.join(IMAGES_FOLDER_PATH, productImage))
        if (productImage) {
            // Extract public ID from the full Cloudinary URL
            const urlParts = productImage.split("/");
            const filenameWithExtension = urlParts.pop(); // Get last part: "vsv1uhtye0ntmv4rhrve.jpg"
            const publicId = filenameWithExtension?.split(".")[0]; // Remove file extension
    
            if (publicId) {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log(`Cloudinary image deleted: products/${publicId}`);
            }
        }
        
        const product = await Product.delete(req.params.id);
        res.json({msg: "product with id " + req.params.id + " has deleted successfuly"});
    } catch(error){
        
        console.error("error deleting product: " + error);
        res.status(500).json({error: "error deleting product"});
    }
}



