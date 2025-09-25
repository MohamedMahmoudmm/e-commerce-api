import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";
import {auth} from "../middleWare/auth.js";
import {admin} from "../middleWare/checkAdmin.js";

router.post("/",auth, admin,categoryController.createCategory);
router.get("/", auth,categoryController.getAllCategories);
router.put("/:id",auth,admin, categoryController.updateCategory);
router.delete("/:id", auth,admin,categoryController.deleteCategory);


export default router;