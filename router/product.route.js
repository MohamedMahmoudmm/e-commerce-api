import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { auth } from "../middleWare/auth.js";
import { admin } from "../middleWare/checkAdmin.js";

const productRouter = express.Router();


productRouter.get("/", getAllProducts);                // Get all products (paginated)
productRouter.get("/:id", getProductById);             // Get single product by ID
productRouter.get("/category/:category", getProductsByCategory); // Get products by category


productRouter.post("/", auth, admin, createProduct);       // Admin create
productRouter.put("/:id", auth, admin, updateProduct);     // Admin update
productRouter.delete("/:id", auth, admin, deleteProduct);  // Admin soft delete

export default productRouter;
