import OrderModel from "../models/orderModel.js";
import {asyncHandler} from "../middleWare/errorHandler.js";

const getAllOrders =asyncHandler( async (req, res) => {
     
    const orders = await OrderModel.find().populate('userId', 'name email').populate('items.productId', 'name images price');
    res.status(200).json({status:"success", message: 'All orders fetched', data: orders });
  
})
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const orders = await OrderModel.find({ userId }).populate('items.productId', 'name images price');
  console.log('Query result count:', orders.length);
  if (orders.length === 0) {
    console.log('Sample order items with images:', orders[0].items[0]?.productId);
    console.log('No orders for this userId:', userId);
    return res.status(404).json({ 
      status: "fail", 
      message: 'No orders found for this user', 
      data: []
    });
  }
  res.status(200).json({ status: "success", message: 'User orders fetched', data: orders });
});

const getOrderById =asyncHandler(  async (req, res) => {
  const { orderId } = req.params;
  
    const order = await OrderModel.findById(orderId).populate('userId', 'name email').populate('items.productId', 'name images price');
    if (!order) return res.status(404).json({status:"fail", message: 'Order not found',data:[] });
    res.status(200).json({ status:"success", message: 'Order fetched', data:order });
  
})

const updateOrderStatus =asyncHandler(  async (req, res) => {
   
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({status:"fail", message: 'Invalid status value',data:[] });
  }

  
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({status:"fail", message: 'Order not found',data:[] });

    order.status = status;
    await order.save();
    res.status(200).json({ status:"success", message: 'Order status updated', data:order });
  
})

const deleteOrder = asyncHandler(async  (req, res) => {
   
  const { orderId } = req.params;
  
    const order = await OrderModel.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ status:"fail", message: 'Order not found',data:[] });
    res.status(200).json({ status:"success", message: 'Order deleted', data:[] });
  
})

const orderController = {
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
  };
  
  export default orderController;   
