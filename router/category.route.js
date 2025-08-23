import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";

router.post("/categories", categoryController.createCategory);
router.get("/categories", categoryController.getAllCategories);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);


export default router;