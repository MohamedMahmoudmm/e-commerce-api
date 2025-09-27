import wishlistModel from "../models/wishlistModel.js";
import productModel from "../models/ProductModule.js";
import { asyncHandler } from "../middleWare/errorHandler.js";

// Add product to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await productModel.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await wishlistModel.findOne({ userId });
  if (!wishlist) {
    wishlist = new wishlistModel({ userId, items: [{ productId }] });
  } else {
    const alreadyExist = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );
    if (alreadyExist) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    wishlist.items.push({ productId });
  }

  await wishlist.save();
  res.status(201).json({ message: "Product added to wishlist", wishlist });
});

// Get wishlist
export const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistModel
    .findOne({ userId: req.user._id })
    .populate("items.productId");

  if (!wishlist) {
    return res.status(200).json({ message: "Wishlist is empty", wishlist: [] });
  }

  res.status(200).json({ message: "My wishlist", wishlist });
});

// Remove product from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await wishlistModel.findOne({ userId: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await wishlist.save();
  res.status(200).json({ message: "Product removed from wishlist", wishlist });
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistModel.findOne({ userId: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.items = [];
  await wishlist.save();
  res.status(200).json({ message: "Wishlist cleared", wishlist });
});
