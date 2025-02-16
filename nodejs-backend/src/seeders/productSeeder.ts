import Product, { MyProduct } from "../models/Product.js";
import Category, { MyCategory } from "../models/Category.js";
import db from "../config/database.js";
import fs, { mkdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {faker} from '@faker-js/faker';
dotenv.config();

const {IMAGES_FOLDER_PATH} = process.env;
if (!IMAGES_FOLDER_PATH){
    throw new Error("images path doesn't exist");
}

const imageNames = fs.readdirSync(IMAGES_FOLDER_PATH).filter(file => 
    fs.statSync(path.join(IMAGES_FOLDER_PATH, file)).isFile()
);

// Function to generate a random product
function generateProduct(categoryIds: string[], image: string) : MyProduct {
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: parseInt(faker.commerce.price()),
        category_id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
        image
    };
}

// Function to seed categories and products
async function seedProducts(imagesNames: string[]) {
    try {
        await db.query("TRUNCATE product cascade");
        const categories: MyCategory[] = await Category.getAll();
        // Extract category IDs
        const categoryIds: string[] = categories.map(cat => cat.id).filter(id => id !== undefined);

        // Step 2: Seed products
        console.log('Seeding products...');
        const products: MyProduct[] = [];
        for (let i = 0; i < imageNames.length; i++) {
            products.push(generateProduct(categoryIds, imageNames[i]));
        }
        await Promise.all(
            products.map(async product => {
                await Product.create(product);
            })
        );

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedProducts(imageNames)



