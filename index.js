import express from 'express';
import mongoose from 'mongoose';
import userRouter from './router/user.route.js';
import categoryRouter from './router/category.route.js';
import orderRouter from './router/order.route.js';
import productRouter from './router/product.route.js';
import paymentRouter from './router/payment.route.js';
import {errorHandler} from './middleWare/errorHandler.js';
import cartRoute from './router/cart.route.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use('/user',userRouter);
app.use('/categories',categoryRouter);
app.use('/orders', orderRouter);
app.use("/api/products", productRouter);
app.use('/cart', cartRoute);
app.use(errorHandler);
app.use("/payments", paymentRouter);

mongoose.connect(process.env.URL).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
})









app.listen(3000, () => {
  console.log('Server is running on port 3000');
});