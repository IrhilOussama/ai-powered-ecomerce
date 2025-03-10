import express from "express";
import { getAllProducts, getRecommandedProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductByImageFilename } from "../controllers/productController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const ProductRouter = express.Router(); 
import upload from "../middlewares/upload.js";

ProductRouter.get("/image/:filename", getProductByImageFilename);
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/recommended", authenticate, getRecommandedProducts);
ProductRouter.get("/:id", getProduct); 
ProductRouter.post("/", createProduct);
ProductRouter.put("/", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter;
