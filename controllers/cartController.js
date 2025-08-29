import cartModel from "../models/cartModel.js"
import orderModel from "../models/orderModel.js"
import productModel from "../models/ProductModule.js"
import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import {asyncHandler} from "../middleWare/errorHandler.js"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//add product in Cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    //  check if product exists and has enough stock
    const product = await productModel.findById(productId);
    if (!product) { res.status(404); throw new Error(" product not found ");}
    if (product.stock < quantity) {return res.status(400).json({ status: "fail", message: "Not enough stock available" });}
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
        cart = new cartModel({
            userId,
            items: [{ productId, quantity }]
        });
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );
        if (itemIndex > -1) {
            // لو المنتج موجود بالفعل في الكارت
            const newQty = cart.items[itemIndex].quantity + quantity;
            if (product.stock < newQty) {
                return res.status(400).json({
                    status: "fail",
                    message: "Not enough stock for this quantity"
                });
            }
            cart.items[itemIndex].quantity = newQty;
        } else {
            cart.items.push({ productId, quantity });
        }
    }
    await cart.save();
    res.status(201).json({ status: "success", message: "Product added to cart", data: cart });
});





// display the cart for specific user
export const myCart =asyncHandler( async (req, res) => {

        //search in the collection for the first document userId be in it match req.user._id
        const cart = await cartModel.findOne({ userId: req.user._id })
            //populate return the data of the product and replace it with objectId so the data will be like this
            //items: [
            //   { productId: { _id:"66b...", name:"AirPods", price: 3000 }, quantity: 2 },
            //   { productId: { _id:"66c...", name:"Case",    price: 200  }, quantity: 1 },
            // ]
            .populate('items.productId');
        if (!cart) { res.status(404); throw new Error(" cart not found ");}
        res.status(200).json({ status: "success", message: "My cart", data: cart });
     
})
  // update product qty in the cart 
// export const updateQuantity = async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const cart = await cartModel.findOneAndUpdate(
//       { userId: req.user._id, "items._id": req.params.id }, 
//$set → MongoDB update operator that sets a field’s value.
//items.$.quantity → the $ positional operator means: “the first element in the items array that matched the filter condition.”
//       { $set: { "items.$.quantity": quantity } },           
//       { new: true }                                      
//     );
//     if (!cart) return res.status(404).json({ message: "Cart not found or Item not found in cart" });
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "error", error: error.message });
//   }
// };

// update product qty in the cart 
export const updateQuantity =asyncHandler( async (req, res) => {
 const { productId, quantity } = req.body;
  const userId = req.user.userId;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) { res.status(404); throw new Error(" cart not found ");};
    const product = await productModel.findById(productId);
    if (!product){ res.status(404); throw new Error(" product not found ");};
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart});
  } 
);

export const DeleteCart =asyncHandler( async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
    const cart = await cartModel.findOne({ userId });
    if (!cart){ res.status(404); throw new Error(" cart not found ");};
    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
});


export const clearCart =asyncHandler( async (req, res) => {
 const userId = req.user._id;

    const cart = await cartModel.findOne({ userId });
    if (!cart) { res.status(404); throw new Error(" cart not found ");};
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart });
  });


export const placeOrder = asyncHandler(async (req, res) => {
const userId =req.user._id;

    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({status:"fail", message: 'your Cart is empty',data:null });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ status:"fail",message: `Insufficient stock for ${product.name}`,data:null });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    if(!req.body.shippingAddress ||!req.body){
      return res.status(400).json({status:"fail", message: 'Shipping address is required',data:null });
    }
    const order = new orderModel({
      userId,
      items: orderItems,
      totalPrice: totalAmount,
      paymentMethod: req.body.paymentMethod || 'cash',
      shippingAddress: req.body.shippingAddress,
    });

    const newOrder = await order.save();

    // Clear the cart after placing the order
   

    const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount * 100,
                currency: "usd",
                metadata: { orderId: newOrder._id.toString(), userId },
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                }
            });
    
    
            const payment = await Payment.create({
                userId: userId,
                orderId: newOrder._id,
                amount: totalAmount,
                currency: "usd",
                status: "pending",
                stripePaymentIntentId: paymentIntent.id
            });
    
           cart.items = [];
    await cart.save();
    res.status(200).json({
      status: "success", message: 'Order placed successfully', data: order,payment
    });
  });



