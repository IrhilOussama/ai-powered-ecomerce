import express from "express";
import { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
const CategoryRouter = express.Router();

CategoryRouter.get("/", getAllCategories);
CategoryRouter.get("/:id", getCategory);
CategoryRouter.post("/", createCategory);
CategoryRouter.put("/:id", updateCategory);
CategoryRouter.delete("/:id", deleteCategory);

export default CategoryRouter;