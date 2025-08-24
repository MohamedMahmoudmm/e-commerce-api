import mongoose from 'mongoose'

const {Schema,model} = mongoose;
const orderSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items:[{
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "paypal"],
      default: "cash",
    },

    shippingAddress: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel = model('Order', orderSchema);
  export default orderModel;