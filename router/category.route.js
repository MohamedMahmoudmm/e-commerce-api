import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";
import {auth} from "../middleWare/auth.js";

router.post("/categories",auth, categoryController.createCategory);
router.get("/categories", auth,categoryController.getAllCategories);
router.put("/categories/:id",auth, categoryController.updateCategory);
router.delete("/categories/:id", auth,categoryController.deleteCategory);


export default router;