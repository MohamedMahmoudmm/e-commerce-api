import orderController from "../controllers/orderController.js";
import express from "express";
import {auth} from "../middleWare/auth.js";
import {admin} from "../middleWare/checkAdmin.js";
const router = express.Router();
router.get("/", auth,admin, orderController.getAllOrders);
router.get("/user", auth, orderController.getUserOrders);
router.get("/:orderId", auth, orderController.getOrderById);
router.put("/:orderId", auth, admin,orderController.updateOrderStatus);
router.delete("/:orderId", auth,admin, orderController.deleteOrder);


export default router;