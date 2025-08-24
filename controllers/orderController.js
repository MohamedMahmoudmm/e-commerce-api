import OrderModel from "../models/orderModel.js";

const getAllOrders = async (req, res) => {
    if(!req.user.isAdmin){
      return res.status(403).json({ message: 'Access denied' });
    }
  try {
    const orders = await OrderModel.find().populate('userId', 'name email').populate('items.productId', 'name');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({status:"error", message: 'something went wrong', data:[] });
  }
}
const getUserOrders = async (req, res) => {
  const userId = req.user.userId;
  try {
    const orders = await OrderModel.find({ userId }).populate('items.productId', 'name');
    res.status(200).json({ status:"success", message: 'User orders fetched', data:orders });
  } catch (error) {
    res.status(500).json({ status:"error", message: 'something went wrong', data:[] });
  }
}

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findById(orderId).populate('userId', 'name email').populate('items.productId', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const updateOrderStatus = async (req, res) => {
    if(!req.user.isAdmin){
      return res.status(403).json({ status:"fail", message: 'Access denied',data:[] });
    }
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({status:"fail", message: 'Invalid status value',data:[] });
  }

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({status:"fail", message: 'Order not found',data:[] });

    order.status = status;
    await order.save();
    res.status(200).json({ status:"success", message: 'Order status updated', data:order });
  } catch (error) {
    res.status(500).json({status:"error", message: 'Server error', data:[] });
  }
}

const deleteOrder = async (req, res) => {
    if(!req.user.isAdmin){
      return res.status(403).json({ status:"fail", message: 'Access denied',data:[] });
    }
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ status:"fail", message: 'Order not found',data:[] });
    res.status(200).json({ status:"success", message: 'Order deleted', data:[] });
  } catch (error) {
    res.status(500).json({status:"error", message: 'Server error', data:[] });
  }
}

const orderController = {
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
  };
  
  export default orderController;   
