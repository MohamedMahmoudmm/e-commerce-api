import express from "express";
import bodyParser from "body-parser";
import { createPayment, handleWebhook } from "../controllers/paymentController.js";
import {auth} from "../middleWare/auth.js";
const paymentRouter = express.Router();

//paymentRouter.post("/create",auth, createPayment);

// webhook يستخدم bodyParser.raw
paymentRouter.post("/webhook", bodyParser.raw({ type: "application/json" }), handleWebhook);

export default paymentRouter;