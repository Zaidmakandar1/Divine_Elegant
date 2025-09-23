import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import logger from './logger.js';

// Load environment variables
// Try loading from project root first, then fallback to server/.env
// This allows placing .env at either root or server directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env if present, then server .env to override
const rootEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');
dotenv.config({ path: rootEnvPath });
// Ensure server/.env overrides root .env when both exist
dotenv.config({ path: serverEnvPath, override: true });

// Debug: show which env files exist and whether a Mongo URI is set
const rootEnvExists = fs.existsSync(rootEnvPath);
const serverEnvExists = fs.existsSync(serverEnvPath);
const existingKey = process.env.MONGODB_URI ? 'MONGODB_URI'
  : process.env.MONGO_URI ? 'MONGO_URI'
  : process.env.DATABASE_URL ? 'DATABASE_URL'
  : process.env.ATLAS_URI ? 'ATLAS_URI'
  : null;
if (process.env.DEBUG_STARTUP === 'true') {
  logger.info(`Env files → root: ${rootEnvExists ? 'found' : 'missing'}, server: ${serverEnvExists ? 'found' : 'missing'}`);
  logger.info(`Mongo URI key detected: ${existingKey || 'none'}`);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Flexible CORS: allow 5173, 5174 by default and any provided in env FRONTEND_URLS/FRONTEND_URL
const defaultCorsOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envCorsOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedCorsOrigins = Array.from(new Set([...defaultCorsOrigins, ...envCorsOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowedCorsOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection
// Support multiple common env var names and a heuristic fallback
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
  // Heuristic: any env var containing MONGO and URI/URL/CONN/STRING/DB
  const allKeys = Object.keys(process.env || {});
  resolvedKey = allKeys.find((k) => /MONGO/i.test(k) && /(URI|URL|CONN|CONNECT|STRING|DB)/i.test(k) && String(process.env[k] || '').trim() !== '');
}

const resolvedMongoUri = (resolvedKey ? process.env[resolvedKey] : null) || 'mongodb://localhost:27017/divine_elegant';

// If a DB name is provided via env, use it. Otherwise, do not override.
// For Atlas/SRV URIs, forcing a dbName can cause bad auth.
const dbNameFromEnv = process.env.MONGODB_DB_NAME || process.env.MONGO_DB || process.env.DB_NAME;
const hasDbInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/i.test(resolvedMongoUri);
const mongooseOptions = dbNameFromEnv ? { dbName: dbNameFromEnv } : {};

// Log which URI we are using (masking credentials)
try {
  const masked = resolvedMongoUri.replace(/:\/\/([^:@/]+):([^@]+)@/i, '://$1:******@');
  if (process.env.DEBUG_STARTUP === 'true') {
    logger.info(`Using MongoDB key: ${resolvedKey || 'default'} → ${masked}`);
    if (dbNameFromEnv) {
      logger.info(`Using env dbName override → options.dbName='${dbNameFromEnv}'`);
    }
  }
} catch {}

mongoose.connect(resolvedMongoUri, mongooseOptions)
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch((error) => {
    logger.error('❌ MongoDB connection error:', error.message);
    logger.info('💡 Ensure MongoDB is running and credentials/DB name are correct.');
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error stack only in development to avoid noisy terminals in production
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  } else {
    logger.error(err.message || 'Server error');
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

// Global handlers to avoid unhandled traces in terminal
process.on('unhandledRejection', (reason) => {
  // Keep rejection logging concise
  logger.error('Unhandled Rejection:', reason && (reason.message || reason));
  // In production, exit to avoid unknown state
  if (process.env.NODE_ENV !== 'development') process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err && (err.message || err));
  // Exit in production on uncaught exceptions
  if (process.env.NODE_ENV !== 'development') process.exit(1);
});

// Start server with port fallback in case PORT is already in use
const MAX_PORT_ATTEMPTS = 10;
async function startServer(initialPort) {
  let port = Number(initialPort) || 5000;
  for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt++) {
    const tryPort = port + attempt;
    try {
      await new Promise((resolve, reject) => {
        const srv = app.listen(tryPort);
        srv.once('listening', () => resolve({ srv, tryPort }));
        srv.once('error', (err) => reject(err));
      });
      // Success: only print the concise server start message
      logger.info(`Server is running on port ${tryPort}`);
      return;
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        // Port conflict: try next port quietly (debug)
        logger.debug(`Port ${tryPort} in use, trying next port`);
        continue;
      }
      // Other errors: log and exit
      logger.error('Server start error:', err && (err.message || err));
      process.exit(1);
    }
  }
  logger.error(`Unable to bind to a port after ${MAX_PORT_ATTEMPTS} attempts`);
  process.exit(1);
}

startServer(PORT).catch((e) => {
  logger.error('Failed to start server:', e && (e.message || e));
  process.exit(1);
});