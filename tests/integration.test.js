import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from '../server/routes/userRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import User from '../server/models/User.js';
import Product from '../server/models/Product.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

describe('Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register and login a user
    const userData = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      password: 'password123'
    };

    // Register user
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send(userData);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    // Create some test products
    const products = [
      {
        name: 'Integration Test Product 1',
        description: 'Test product for integration testing',
        images: ['https://example.com/test1.jpg'],
        category: 'bracelets',
        variants: [
          { size: '6mm', price: 1299, stockCount: 25 }
        ],
        featured: true
      },
      {
        name: 'Integration Test Product 2',
        description: 'Another test product',
        images: ['https://example.com/test2.jpg'],
        category: 'necklaces',
        variants: [
          { size: 'Small', price: 899, stockCount: 15 }
        ],
        featured: false
      }
    ];

    await Product.insertMany(products);
  });

  describe('Complete User Flow', () => {
    it('should allow user to register, login, and access products', async () => {
      // Test product access
      const productsResponse = await request(app)
        .get('/api/products')
        .expect(200);

      expect(productsResponse.body.length).toBeGreaterThan(0);

      // Test user profile access
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(profileResponse.body.user.email).toBe('integration@example.com');
    });

    it('should handle product filtering correctly', async () => {
      // Test category filtering
      const braceletsResponse = await request(app)
        .get('/api/products?category=bracelets')
        .expect(200);

      expect(braceletsResponse.body.every(p => p.category === 'bracelets')).toBe(true);

      // Test featured filtering
      const featuredResponse = await request(app)
        .get('/api/products?featured=true')
        .expect(200);

      expect(featuredResponse.body.every(p => p.featured === true)).toBe(true);
    });
  });

  describe('Database Operations', () => {
    it('should maintain data consistency across operations', async () => {
      // Count initial products
      const initialCount = await Product.countDocuments();

      // Create a new product
      const newProduct = {
        name: 'Consistency Test Product',
        description: 'Testing data consistency',
        images: ['https://example.com/consistency.jpg'],
        category: 'rings',
        variants: [
          { size: 'Size 7', price: 1599, stockCount: 10 }
        ]
      };

      const product = new Product(newProduct);
      await product.save();

      // Verify count increased
      const newCount = await Product.countDocuments();
      expect(newCount).toBe(initialCount + 1);

      // Verify product exists
      const foundProduct = await Product.findById(product._id);
      expect(foundProduct).toBeTruthy();
      expect(foundProduct.name).toBe(newProduct.name);
    });
  });
});
