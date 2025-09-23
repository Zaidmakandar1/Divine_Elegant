import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import url from 'url';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import { cloudinaryEnabled, uploadImageBufferToCloudinary } from './services/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root then server, mirroring server/server.js
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

async function connectMongo() {
  const preferredKeys = ['MONGODB_URI','MONGO_URI','MONGO_URL','DATABASE_URL','ATLAS_URI','DB_URI','DB_URL'];
  const key = preferredKeys.find(k => (process.env[k] || '').trim());
  const uri = (key ? process.env[key] : null) || 'mongodb://localhost:27017/divine_elegant';
  const dbNameFromEnv = process.env.MONGODB_DB_NAME || process.env.MONGO_DB || process.env.DB_NAME;
  const options = dbNameFromEnv ? { dbName: dbNameFromEnv } : {};
  await mongoose.connect(uri, options);
}

function isLocalOrRelativeImage(imageUrl) {
  if (!imageUrl) return false;
  if (/^https?:\/\//i.test(imageUrl)) {
    // Treat localhost or 127.x as local
    return /\blocalhost\b|127\.0\.0\.1|::1/.test(imageUrl);
  }
  return imageUrl.startsWith('/') || imageUrl.startsWith('assets');
}

async function readLocalImageBuffer(imageUrl) {
  // Map URL path to file on disk in public/
  let pathname = imageUrl;
  try {
    if (/^https?:\/\//i.test(imageUrl)) {
      const u = new url.URL(imageUrl);
      pathname = u.pathname; // e.g., /assets/images/products/file.jpg
    }
  } catch {}
  const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const absPath = path.resolve(__dirname, '../public', relativePath);
  const buf = await fs.readFile(absPath);
  return { buf, originalName: path.basename(absPath) };
}

async function migrate() {
  if (!cloudinaryEnabled) {
    console.error('Cloudinary is not configured. Set CLOUDINARY_* env vars and retry.');
    process.exit(1);
  }

  await connectMongo();
  console.log('Connected to MongoDB');

  const products = await Product.find();
  let updatedCount = 0;

  for (const product of products) {
    const newImages = [...product.images];
    let changed = false;

    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      if (!isLocalOrRelativeImage(img)) continue;
      try {
        const { buf, originalName } = await readLocalImageBuffer(img);
        const uploaded = await uploadImageBufferToCloudinary(buf, originalName);
        newImages[i] = uploaded.secure_url;
        changed = true;
        console.log(`Migrated image for product ${product._id} → ${uploaded.secure_url}`);
      } catch (e) {
        console.warn(`Skip image for product ${product._id}: ${img} (${e.message})`);
      }
    }

    if (changed) {
      product.images = newImages;
      await product.save();
      updatedCount += 1;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} product(s).`);
  await mongoose.disconnect();
}

migrate().catch(async (e) => {
  console.error('Migration failed:', e && (e.message || e));
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


