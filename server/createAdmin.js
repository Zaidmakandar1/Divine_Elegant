import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import logger from './logger.js';

// Load environment variables (support root and server .env like server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');
dotenv.config({ path: rootEnvPath });
dotenv.config({ path: serverEnvPath });

// Resolve Mongo URI and db name similarly to server.js
const preferredMongoKeys = [
  'MONGODB_URI',
  'MONGO_URI',
  'MONGO_URL',
  'DATABASE_URL',
  'ATLAS_URI',
  'DB_URI',
  'DB_URL'
];

const presentPreferredKey = preferredMongoKeys.find((key) => {
  const value = process.env[key];
  return typeof value === 'string' && value.trim().length > 0;
});

let resolvedKey = presentPreferredKey;
if (!resolvedKey) {
  const allKeys = Object.keys(process.env || {});
  resolvedKey = allKeys.find((k) => /MONGO/i.test(k) && /(URI|URL|CONN|CONNECT|STRING|DB)/i.test(k) && String(process.env[k] || '').trim() !== '');
}

const resolvedMongoUri = (resolvedKey ? process.env[resolvedKey] : null) || 'mongodb://localhost:27017/divine_elegant';
const fallbackDbName = process.env.MONGODB_DB_NAME || process.env.MONGO_DB || process.env.DB_NAME || 'divine_elegant';
const hasDbInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/i.test(resolvedMongoUri);
const mongooseOptions = hasDbInUri ? {} : { dbName: fallbackDbName };

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
  await mongoose.connect(resolvedMongoUri, mongooseOptions);
  logger.info('✅ Connected to MongoDB');

    // Admin identity from env or defaults
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@divineelegant.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: String(ADMIN_EMAIL).toLowerCase().trim() });
    
    if (existingAdmin) {
  logger.info('👤 Admin user already exists! Ensuring password and role...');
  existingAdmin.password = ADMIN_PASSWORD; // pre-save hook will hash
  existingAdmin.role = 'admin';
  await existingAdmin.save();
  logger.info(`📧 Email: ${ADMIN_EMAIL}`);
  logger.info('🔑 Password reset to (hidden)');
  logger.info('👑 Role ensured: admin');
      process.exit(0);
    }

    // Create admin user (let the model hook hash the password)
    const adminUser = new User({
      name: ADMIN_NAME,
      email: String(ADMIN_EMAIL).toLowerCase().trim(),
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    await adminUser.save();
    
  logger.info('🎉 Admin user created successfully!');
  logger.info('📧 Email: admin@divineelegant.com');
  logger.info('🔑 Password: admin123');
  logger.info('👑 Role: admin');
  logger.info('');
  logger.info('You can now login through the regular login page!');
    
    process.exit(0);
  } catch (error) {
  // If user exists already, reset password and role to ensure known credentials
  if (error && /duplicate key/i.test(error.message)) {
    try {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@divineelegant.com';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      const user = await User.findOne({ email: String(ADMIN_EMAIL).toLowerCase().trim() });
      if (user) {
        user.password = ADMIN_PASSWORD; // will be hashed by pre-save hook
        user.role = 'admin';
        await user.save();
        logger.info('🔁 Existing admin found. Password reset and role ensured.');
        process.exit(0);
      }
    } catch (e) {
      logger.error('❌ Error updating existing admin user:', e.message);
    }
  }
  logger.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
