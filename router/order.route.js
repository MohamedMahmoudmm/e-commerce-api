import orderController from "../controllers/orderController.js";
import express from "express";
import {auth} from "../middleWare/auth.js";
const router = express.Router();
router.get("/", auth, orderController.getAllOrders);
router.get("/user/:userId", auth, orderController.getUserOrders);
router.get("/:orderId", auth, orderController.getOrderById);
router.put("/:orderId", auth, orderController.updateOrderStatus);
router.delete("/:orderId", auth, orderController.deleteOrder);


export default router;