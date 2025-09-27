import express from "express";
import { auth } from "../middleWare/auth.js";
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const wishlistRoute = express.Router();

wishlistRoute.post("/", auth, addToWishlist);
wishlistRoute.get("/", auth, getMyWishlist);
wishlistRoute.delete("/:productId", auth, removeFromWishlist);
wishlistRoute.delete("/", auth, clearWishlist);

export default wishlistRoute;
