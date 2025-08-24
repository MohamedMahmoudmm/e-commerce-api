import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { protect } from "../middleWare/auth.js";
import { admin } from "../middleWare/checkAdmin.js";

const productRouter = express.Router();


router.get("/", getAllProducts);                // Get all products (paginated)
router.get("/:id", getProductById);             // Get single product by ID
router.get("/category/:category", getProductsByCategory); // Get products by category


router.post("/", protect, admin, createProduct);       // Admin create
router.put("/:id", protect, admin, updateProduct);     // Admin update
router.delete("/:id", protect, admin, deleteProduct);  // Admin soft delete

export default productRouter;
