import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/divine-elegant';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@divineelegant.com' });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists!');
      console.log('Email: admin@divineelegant.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@divineelegant.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Save admin user
    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@divineelegant.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
    console.log('');
    console.log('You can now login through the regular login page!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
