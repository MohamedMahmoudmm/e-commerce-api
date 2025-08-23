import express from 'express';
import mongoose from 'mongoose';
import userRouter from './router/user.route.js';
import categoryRouter from './router/category.route.js';
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);

mongoose.connect('mongodb+srv://mm4574:mm4574@cluster0.xq5ja.mongodb.net/e-commerce').then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
})









app.listen(3000, () => {
  console.log('Server is running on port 3000');
});