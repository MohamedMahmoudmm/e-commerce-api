// import { string } from "joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

// helpful compound index for queries
productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);

