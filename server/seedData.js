import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import logger from './logger.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/divine-elegant';

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@divineelegant.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

const products = [
  {
    name: 'Rudraksha Mala 6mm',
    description: 'Authentic Rudraksha Mala with 108 beads, 6mm size. Each bead is carefully selected and blessed for spiritual practice.',
    images: [
      '/assets/images/products/rudraksha-mala-6mm/1.jpg',
      '/assets/images/products/rudraksha-mala-6mm/2.jpg',
      '/assets/images/products/rudraksha-mala-6mm/3.jpg'
    ],
    category: 'rudraksha',
    variants: [
      { size: '6mm', price: 1299, stockCount: 50 }
    ],
    spiritualBenefits: 'Rudraksha beads help in meditation, reduce stress, and enhance spiritual energy. Perfect for japa meditation.',
    careInstructions: 'Keep dry, avoid water. Clean with soft cloth. Store in sacred place.',
    featured: true,
    rating: 4.9,
    numReviews: 256,
    certification: 'Lab Certified',
    material: 'Natural Rudraksha Seeds'
  },
  {
    name: 'Rudraksha Mala 7mm',
    description: 'Premium Rudraksha Mala with 108 beads, 7mm size. Larger beads for enhanced spiritual energy.',
    images: [
      '/assets/images/products/rudraksha-mala-7mm/1.jpg',
      '/assets/images/products/rudraksha-mala-7mm/2.jpg',
      '/assets/images/products/rudraksha-mala-7mm/3.jpg'
    ],
    category: 'rudraksha',
    variants: [
      { size: '7mm', price: 1599, stockCount: 40 }
    ],
    spiritualBenefits: 'Larger Rudraksha beads provide stronger spiritual vibrations and deeper meditation experience.',
    careInstructions: 'Keep dry, avoid water. Clean with soft cloth. Store in sacred place.',
    featured: true,
    rating: 4.8,
    numReviews: 189,
    certification: 'Lab Certified',
    material: 'Natural Rudraksha Seeds'
  },
  {
    name: 'Rudraksha Mala 8mm',
    description: 'Extra Large Rudraksha Mala with 108 beads, 8mm size. Maximum spiritual energy and presence.',
    images: [
      '/assets/images/products/rudraksha-mala-8mm/1.jpg',
      '/assets/images/products/rudraksha-mala-8mm/2.jpg',
      '/assets/images/products/rudraksha-mala-8mm/3.jpg'
    ],
    category: 'rudraksha',
    variants: [
      { size: '8mm', price: 1999, stockCount: 30 }
    ],
    spiritualBenefits: 'Extra large beads provide maximum spiritual energy and are perfect for advanced practitioners.',
    careInstructions: 'Keep dry, avoid water. Clean with soft cloth. Store in sacred place.',
    featured: true,
    rating: 4.9,
    numReviews: 142,
    certification: 'Lab Certified',
    material: 'Natural Rudraksha Seeds'
  },
  {
    name: 'Karungali Mala 6mm',
    description: 'Authentic Karungali (Ebony Wood) Mala with 108 beads, 6mm size. Sacred wood for spiritual practice.',
    images: [
      '/assets/images/products/karungali-mala-6mm/1.jpg',
      '/assets/images/products/karungali-mala-6mm/2.jpg',
      '/assets/images/products/karungali-mala-6mm/3.jpg'
    ],
    category: 'karungali',
    variants: [
      { size: '6mm', price: 899, stockCount: 45 }
    ],
    spiritualBenefits: 'Karungali wood is sacred and helps in grounding energy, meditation, and spiritual protection.',
    careInstructions: 'Keep dry, polish with natural oil. Store in cool, dry place.',
    featured: true,
    rating: 4.7,
    numReviews: 203,
    certification: 'Lab Certified',
    material: 'Natural Ebony Wood'
  },
  {
    name: 'Karungali Mala 7mm',
    description: 'Premium Karungali Mala with 108 beads, 7mm size. Enhanced spiritual energy with larger beads.',
    images: [
      '/assets/images/products/karungali-mala-7mm/1.jpg',
      '/assets/images/products/karungali-mala-7mm/2.jpg',
      '/assets/images/products/karungali-mala-7mm/3.jpg'
    ],
    category: 'karungali',
    variants: [
      { size: '7mm', price: 1199, stockCount: 35 }
    ],
    spiritualBenefits: 'Larger Karungali beads provide stronger grounding energy and deeper meditation experience.',
    careInstructions: 'Keep dry, polish with natural oil. Store in cool, dry place.',
    featured: true,
    rating: 4.8,
    numReviews: 167,
    certification: 'Lab Certified',
    material: 'Natural Ebony Wood'
  },
  {
    name: 'Karungali Mala 8mm',
    description: 'Extra Large Karungali Mala with 108 beads, 8mm size. Maximum grounding and spiritual energy.',
    images: [
      '/assets/images/products/karungali-mala-8mm/1.jpg',
      '/assets/images/products/karungali-mala-8mm/2.jpg',
      '/assets/images/products/karungali-mala-8mm/3.jpg'
    ],
    category: 'karungali',
    variants: [
      { size: '8mm', price: 1499, stockCount: 25 }
    ],
    spiritualBenefits: 'Extra large Karungali beads provide maximum grounding energy and spiritual protection.',
    careInstructions: 'Keep dry, polish with natural oil. Store in cool, dry place.',
    featured: true,
    rating: 4.9,
    numReviews: 98,
    certification: 'Lab Certified',
    material: 'Natural Ebony Wood'
  },
  {
    name: 'Spatika Mala 6mm',
    description: 'Crystal Quartz (Spatika) Mala with 108 beads, 6mm size. Pure crystal energy for spiritual practice.',
    images: [
      '/assets/images/products/spatika-mala-6mm/1.jpg',
      '/assets/images/products/spatika-mala-6mm/2.jpg',
      '/assets/images/products/spatika-mala-6mm/3.jpg'
    ],
    category: 'spatika',
    variants: [
      { size: '6mm', price: 1099, stockCount: 40 }
    ],
    spiritualBenefits: 'Crystal quartz enhances spiritual energy, clarity of mind, and meditation practice.',
    careInstructions: 'Clean with soft cloth. Avoid harsh chemicals. Store separately to prevent scratches.',
    featured: true,
    rating: 4.8,
    numReviews: 178,
    certification: 'Lab Certified',
    material: 'Natural Crystal Quartz'
  },
  {
    name: 'Spatika Mala 7mm',
    description: 'Premium Crystal Quartz Mala with 108 beads, 7mm size. Enhanced crystal energy and clarity.',
    images: [
      '/assets/images/products/spatika-mala-7mm/1.jpg',
      '/assets/images/products/spatika-mala-7mm/2.jpg',
      '/assets/images/products/spatika-mala-7mm/3.jpg'
    ],
    category: 'spatika',
    variants: [
      { size: '7mm', price: 1399, stockCount: 30 }
    ],
    spiritualBenefits: 'Larger crystal beads provide stronger spiritual energy and enhanced mental clarity.',
    careInstructions: 'Clean with soft cloth. Avoid harsh chemicals. Store separately to prevent scratches.',
    featured: true,
    rating: 4.9,
    numReviews: 134,
    certification: 'Lab Certified',
    material: 'Natural Crystal Quartz'
  },
  {
    name: 'Tulasi Mala',
    description: 'Sacred Tulasi (Holy Basil) Mala with 108 beads. Most sacred mala for Vaishnava devotees.',
    images: [
      '/assets/images/products/tulasi-mala/1.jpg',
      '/assets/images/products/tulasi-mala/2.jpg',
      '/assets/images/products/tulasi-mala/3.jpg'
    ],
    category: 'tulasi',
    variants: [
      { size: 'Standard', price: 799, stockCount: 60 }
    ],
    spiritualBenefits: 'Tulasi mala is most sacred for devotees of Lord Vishnu and Krishna. Brings divine blessings.',
    careInstructions: 'Handle with reverence. Keep dry. Store in sacred place. Avoid touching with unclean hands.',
    featured: true,
    rating: 4.9,
    numReviews: 312,
    certification: 'Lab Certified',
    material: 'Sacred Tulasi Wood'
  },
  {
    name: 'Panchamuki Rudraksha',
    description: 'Rare 5-Faced (Panchamuki) Rudraksha Mala with 108 beads. Most powerful Rudraksha for spiritual growth.',
    images: [
      '/assets/images/products/panchamuki-rudraksha/1.jpg',
      '/assets/images/products/panchamuki-rudraksha/2.jpg',
      '/assets/images/products/panchamuki-rudraksha/3.jpg'
    ],
    category: 'rudraksha',
    variants: [
      { size: 'Rare', price: 2999, stockCount: 15 }
    ],
    spiritualBenefits: 'Panchamuki Rudraksha represents Lord Shiva and provides maximum spiritual energy and protection.',
    careInstructions: 'Handle with utmost care. Keep dry, avoid water. Store in sacred place with proper reverence.',
    featured: true,
    rating: 5.0,
    numReviews: 89,
    certification: 'Lab Certified',
    material: 'Rare 5-Faced Rudraksha'
  }
];

const seedDatabase = async () => {
  try {
  await mongoose.connect(MONGODB_URI);
  logger.debug('Connected to MongoDB');

    // Insert products only (skip users for now due to permissions)
    try {
  const createdProducts = await Product.insertMany(products);
  logger.debug('Created products:', createdProducts.length);
    } catch (insertError) {
      if (insertError.code === 11000) {
  logger.debug('Products already exist, skipping insertion');
      } else {
        throw insertError;
      }
    }

  logger.debug('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
  logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();