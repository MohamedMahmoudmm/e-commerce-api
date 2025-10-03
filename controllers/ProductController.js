import Product from "../models/ProductModule.js";
import { asyncHandler } from "../middleWare/errorHandler.js";
import mongoose from "mongoose";

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, images } = req.body;

  const product = new Product({
    name,
    price,
    description,
    category,
    stock,
    images,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get all products (with pagination)
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 200;
  const skip = (page - 1) * limit;

  const products = await Product.find().populate("category").skip(skip).limit(limit);
  const count = await Product.countDocuments();

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const {cat} = req.body
  console.log(cat);
  const objectIds = cat.map(id => new mongoose.Types.ObjectId(id));
  console.log(objectIds);
  
  const products = await Product.find({ category: {$in: objectIds} });

  if (!products || products.length === 0) {
    res.status(404);
    throw new Error("No products found in this category");
  }

  res.json(products);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, price, description, category, stock, images, isActive } = req.body;

  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.category = category || product.category;
  product.stock = stock ?? product.stock;
  product.images = images || product.images;
  product.isActive = isActive ?? product.isActive;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
   product.isActive=false;
  await product.save();
  
  res.json({ message: "Product removed" });
});
