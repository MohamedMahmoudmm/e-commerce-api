import cartModel from "../models/cartModel.js"
import orderModel from "../models/orderModel.js"
//add product in Cart
export const addToCart = async (req, res) => {
    try {
        //get the data i need to insert in cart model
        const { productId, quantity } = req.body
        const userId = req.user._id
        let cart = await cartModel.findOne(userId)
        // if the cart not found make an instance from cart model and fill the fields
        if (!cart) {
            cart = new cartModel({
                userId,
                items: [{ productId, quantity }]
            })
        } else {
            //find index looping in my array[cart.items] and returns the index of the element incase the element not found it return -1
            // and i take every item and compare the productId inside it but i need to convert it to string because the Id in my DB is objectID 
            //unlike the id from req.body which is the type of string
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
            if (itemIndex > -1) {// it means that this product already exist in the cart so i just decrease the qty
                cart.items[itemIndex].quantity += quantity;
            } else {//push the new product in the array[cart.items]
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: "error", error: err.message })
    }
}
// display the cart for specific user
export const myCart = async (req, res) => {
    try {
        //search in the collection for the first document userId be in it match req.user._id
        const cart = await cartModel.findOne({ userId: req.user._id })
            //populate return the data of the product and replace it with objectId so the data will be like this
            //items: [
            //   { productId: { _id:"66b...", name:"AirPods", price: 3000 }, quantity: 2 },
            //   { productId: { _id:"66c...", name:"Case",    price: 200  }, quantity: 1 },
            // ]
            .populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: "error", error: err.message })
    }
}
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
export const updateQuantity = async (req, res) => {
 const { productId, quantity } = req.body;
  const userId = req.user.userId;

  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: ' error', error });
  }
};

export const DeleteCart = async (req, res) => {
const { productId } = req.params;
  const userId = req.user.userId;
  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'error', error });
  }
};


export const clearCart =async (req, res) => {
const userId = req.user.userId;
  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const placeOrder =async (req, res) => {
const userId = req.user.userId;
  try {
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
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
    if(!req.body.shippingAddress){
      return res.status(400).json({ message: 'Shipping address is required' });
    }
    const order = new orderModel({
      userId,
      items: orderItems,
      totalPrice: totalAmount,
      paymentMethod: req.body.paymentMethod || 'cash',
      shippingAddress: req.body.shippingAddress,
    });

    await order.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}


