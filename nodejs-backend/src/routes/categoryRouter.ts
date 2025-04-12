import express, { Request, Response } from "express";
import { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { cloudinaryUpload, upload } from "../utils/fileUtils.js";
const CategoryRouter = express.Router();
CategoryRouter.get("/", getAllCategories);
CategoryRouter.get("/:id", getCategory);
CategoryRouter.post("/", upload.single('image'), cloudinaryUpload, createCategory);
CategoryRouter.put("/:id", upload.single('image'), cloudinaryUpload, updateCategory);
CategoryRouter.delete("/:id", deleteCategory);

export default CategoryRouter;