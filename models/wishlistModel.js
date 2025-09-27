import mongoose from "mongoose";

const { Schema, model } = mongoose;

const wishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const wishlistModel = model("Wishlist", wishlistSchema);
export default wishlistModel;
