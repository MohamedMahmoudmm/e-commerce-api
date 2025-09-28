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
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';


dotenv.config();
const app = express();
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use(cors({origin:"http://localhost:3001"}));
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

const onlineUsers = new Map(); // userId -> { socketId, role }

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Register user/admin as online
  socket.on("user-online", ({ userId, role }) => {
    onlineUsers.set(userId, { socketId: socket.id, role });
    console.log(`User ${userId} (${role}) is online on socket ${socket.id}`);
  });

  // User places order → notify ALL admins
  socket.on("order-placed", (payload) => {
    // payload = { userId, orderId, message }
    const { userId, orderId, message } = payload;
    console.log(`User ${userId} placed order ${orderId}`);

    // Loop through online users and notify all admins
    onlineUsers.forEach(({ socketId, role }, id) => {
      if (role === "admin") {
        io.to(socketId).emit("notify-admin", {
          from: userId,
          orderId,
          message,
        });
      }
    });
  });

  // Admin accepts order → notify the specific user
  socket.on("order-accepted", (payload) => {
    // payload = {  userId, message }
    const {  userId, message } = payload;
    console.log(`Admin accepted order`);

    const user = onlineUsers.get(userId);
    if (user) {
      io.to(user.socketId).emit("notify-user", {
        message,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    onlineUsers.forEach((data, userId) => {
      if (socket.id === data.socketId) {
        onlineUsers.delete(userId);
      }
    });
  });
});










server.listen(3000, () => {
  console.log('Server is running on port 3000');
});