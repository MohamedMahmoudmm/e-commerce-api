import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";
import {auth} from "../middleware/auth.js";

router.post("/",auth, categoryController.createCategory);
router.get("/", auth,categoryController.getAllCategories);
router.put("/:id",auth, categoryController.updateCategory);
router.delete("/:id", auth,categoryController.deleteCategory);


export default router;