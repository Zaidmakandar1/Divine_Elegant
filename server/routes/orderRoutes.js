import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod === 'card' || paymentMethod === 'upi'
    });

    const savedOrder = await order.save();
    await savedOrder.populate('orderItems.product', 'name images');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;