import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product management
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', upload.array('images', 10), async (req, res) => {
  try {
    // Extract product data from form fields
    const {
      name,
      description,
      category,
      material,
      spiritualBenefits,
      careInstructions,
      featured,
      certification,
      variants
    } = req.body;

    // Parse variants if it's a string
    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants format' });
    }

    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/assets/images/products/${file.filename}`) : [];

    // Create product object
    const productData = {
      name,
      description,
      category,
      material,
      spiritualBenefits,
      careInstructions,
      featured: featured === 'true',
      certification,
      variants: parsedVariants,
      images: imageUrls
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order management
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'delivered' && { isDelivered: true, deliveredAt: new Date() })
      },
      { new: true }
    ).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;