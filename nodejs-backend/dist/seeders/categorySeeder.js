import db from "../config/database.js";
const myCategories = ["tshirt", "shoes", "hats", "jackets", "glasses", "sweeters"];
const seedCategories = async (categories) => {
    await db.query("TRUNCATE categorie cascade");
    await Promise.all(categories.map(async (c) => {
        return await db.query("INSERT INTO categorie(title) VALUES($1)", [c]);
    }));
    console.log("seeding is completed");
};
seedCategories(myCategories);
