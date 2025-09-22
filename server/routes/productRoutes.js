import express from 'express';
import Product from '../models/Product.js';
import logger from '../logger.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
  logger.debug('Fetching products with query:', req.query);
    const { category, featured } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

  logger.debug('MongoDB query:', query);
    const products = await Product.find(query).sort({ createdAt: -1 });
  logger.debug(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
  logger.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
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

export default router;