import Product from '../dist/models/Product.js';
import {promises as fs} from 'fs';
import dotenv from "dotenv";
import db from '../dist/config/database.js';
dotenv.config();
const {SIMILARITIES_FILE} = process.env;


const improveSimilarities = async () => {
    try{
        if (!SIMILARITIES_FILE){
            console.log("error SIMILARITIES FILE doesn't exist")
        }
        const bufferedData = await fs.readFile(SIMILARITIES_FILE);
        const dataObj = await JSON.parse(bufferedData);
        const dataArr = Object.values(dataObj);

        const improvedSimilarities = await Promise.all(dataArr.map(async (obj) => {
            let image_name = obj.image_name;
            let similar_images = obj.similar_images;
            let product = (await Product.getOneByImage(image_name));
            if (product === undefined) console.log(`the image with name ${image_name} doesn't belong to a product!`);

            let similar_products_ids = await Promise.all(similar_images.map( async (image) => {
                let current_image_name = image.split("/").pop();
                let current_product = (await Product.getOneByImage(current_image_name));
                if (current_product === undefined) console.log(`the image with name ${current_image_name} doesn't belong to a product!`);
                return current_product.id;
            }))
    
            let myNewObj = {
                id: product.id,
                similar_products: similar_products_ids
            }
            return myNewObj;
        }))
        return improvedSimilarities;
    } catch(err){
        console.error(err);
    }
}

try {
    await db.query("TRUNCATE similar_products CASCADE");
    const similaritiesArray = await improveSimilarities();
    console.log(similaritiesArray)
    await Promise.all(similaritiesArray.map(async (element) => {
        const similarProducts = element['similar_products'];
        
        if (similarProducts.length > 0){
            return await Promise.all(similarProducts.map( async (similar_product_id, index) => {
                return await Product.addSimilarProduct(element.id, similar_product_id, index+1);
            }))
        }
    }))
    console.log("similarities stored successfuly")
} catch(err) {
    console.error(err);
}



