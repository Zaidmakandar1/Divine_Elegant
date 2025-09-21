import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test database
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/divine-elegant-test';

// Connect to test database
beforeAll(async () => {
  try {
    await mongoose.connect(MONGODB_TEST_URI);
    console.log('✅ Connected to test database');
  } catch (error) {
    console.error('❌ Test database connection error:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log('✅ Test database connection closed');
});
