#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up Divine Elegant E-commerce Application...\n');

// Create .env file if it doesn't exist
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/divine-elegant

# JWT Secret
JWT_SECRET=divine-elegant-super-secret-key-2024

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if MongoDB is running
console.log('\n🔍 Checking MongoDB connection...');
try {
  execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { stdio: 'pipe' });
  console.log('✅ MongoDB is running');
} catch (error) {
  console.log('⚠️  MongoDB is not running. Please start MongoDB before running the application.');
  console.log('   You can start MongoDB by running: mongod');
}

console.log('\n🎯 Setup complete! Next steps:');
console.log('1. Make sure MongoDB is running: mongod');
console.log('2. Seed the database: npm run seed');
console.log('3. Start the development server: npm run dev');
console.log('4. Run tests: npm test');
console.log('\n📱 The application will be available at:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend: http://localhost:5000');
console.log('\n✨ Happy coding!');
