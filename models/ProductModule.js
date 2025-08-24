// import { string } from "joi";
import mongoose from "mongoose";
const { Schema, model } = mongoose;
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

// helpful compound index for queries
productSchema.index({ category: 1, price: 1 });

const productModel = model("Product", productSchema);

export default productModel;