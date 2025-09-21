import request from 'supertest';
import express from 'express';
import productRoutes from '../server/routes/productRoutes.js';
import Product from '../server/models/Product.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  beforeEach(async () => {
    // Create test products
    const products = [
      {
        name: 'Test Bracelet',
        description: 'A beautiful test bracelet',
        images: ['https://example.com/image1.jpg'],
        category: 'bracelets',
        variants: [
          { size: '6mm', price: 1299, stockCount: 25 }
        ],
        featured: true
      },
      {
        name: 'Test Necklace',
        description: 'A beautiful test necklace',
        images: ['https://example.com/image2.jpg'],
        category: 'necklaces',
        variants: [
          { size: 'Small', price: 899, stockCount: 15 }
        ],
        featured: false
      }
    ];

    await Product.insertMany(products);
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('category');
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=bracelets')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('bracelets');
    });

    it('should filter featured products', async () => {
      const response = await request(app)
        .get('/api/products?featured=true')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].featured).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product by id', async () => {
      const products = await Product.find();
      const productId = products[0]._id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body._id).toBe(productId.toString());
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Product not found');
    });
  });
});
