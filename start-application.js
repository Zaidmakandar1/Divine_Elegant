#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting Divine Elegant E-commerce Application...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found. Please run setup first.');
  process.exit(1);
}

// Check if MongoDB is running
console.log('🔍 Checking MongoDB connection...');
try {
  execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { stdio: 'pipe' });
  console.log('✅ MongoDB is running');
} catch (error) {
  console.log('⚠️  MongoDB is not running. Please start MongoDB first:');
  console.log('   Windows: net start MongoDB');
  console.log('   macOS/Linux: brew services start mongodb-community');
  console.log('   Or run: mongod');
  console.log('');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
}

// Seed database if needed
console.log('🌱 Checking database...');
try {
  execSync('npm run seed', { stdio: 'pipe' });
  console.log('✅ Database seeded');
} catch (error) {
  console.log('⚠️  Database seeding failed. This is normal if data already exists.');
}

console.log('\n🎯 Starting the application...');
console.log('📱 Frontend will be available at: http://localhost:5173');
console.log('🔧 Backend will be available at: http://localhost:5000');
console.log('\n💡 To stop the application, press Ctrl+C');
console.log('');

// Start the development server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error starting application:', error.message);
  process.exit(1);
}
