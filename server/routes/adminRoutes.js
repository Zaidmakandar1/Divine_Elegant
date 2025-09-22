import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { cloudinaryEnabled, uploadImageBufferToCloudinary } from '../services/cloudinary.js';
import logger from '../logger.js';

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
  logger.debug('Product creation request received');
  logger.debug('Request body:', req.body);
  logger.debug('Request files:', req.files);
    
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
      logger.error('Variants parsing error:', e);
      return res.status(400).json({ message: 'Invalid variants format' });
    }

    // Process uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      if (cloudinaryEnabled) {
        const uploads = await Promise.all(
          req.files.map(async (file) => {
            const result = await uploadImageBufferToCloudinary(file.buffer, file.originalname);
            return result.secure_url;
          })
        );
        imageUrls = uploads;
      } else {
        imageUrls = req.files.map(file => `/assets/images/products/${file.filename}`);
      }
    } else {
      imageUrls = ['https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400'];
    }

  logger.debug('Image URLs:', imageUrls);

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

  logger.debug('Product data to save:', productData);

    const product = new Product(productData);
    const savedProduct = await product.save();
  logger.debug('Product saved successfully:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (error) {
  logger.error('Product creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/products/:id', upload.array('images', 10), async (req, res) => {
  try {
  logger.debug('Product update request received');
  logger.debug('Request body:', req.body);
  logger.debug('Request files:', req.files);
    
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
      variants,
      existingImages
    } = req.body;

    // Parse variants if it's a string
    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      logger.error('Variants parsing error:', e);
      return res.status(400).json({ message: 'Invalid variants format' });
    }

    // Parse existing images if it's a string
    let parsedExistingImages = [];
    try {
      parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    } catch (e) {
      logger.error('Existing images parsing error:', e);
    }

    // Process new uploaded images
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      if (cloudinaryEnabled) {
        const uploads = await Promise.all(
          req.files.map(async (file) => {
            const result = await uploadImageBufferToCloudinary(file.buffer, file.originalname);
            return result.secure_url;
          })
        );
        newImageUrls = uploads;
      } else {
        newImageUrls = req.files.map(file => `/assets/images/products/${file.filename}`);
      }
    }

    // Combine existing and new images
    const allImages = [...parsedExistingImages, ...newImageUrls];

  logger.debug('Existing images:', parsedExistingImages);
  logger.debug('New images:', newImageUrls);
  logger.debug('All images:', allImages);

    // Create product update object
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
      images: allImages
    };

  logger.debug('Product data to update:', productData);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
  logger.debug('Product updated successfully:', product._id);
    res.json(product);
  } catch (error) {
  logger.error('Product update error:', error);
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