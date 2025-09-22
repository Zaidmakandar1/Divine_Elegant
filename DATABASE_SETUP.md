# Database Setup Guide

## The Issue
The application is showing "user is not allowed to do action [find] on [test.users]" because MongoDB is not running locally.

## Quick Fix - Use MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Get Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

### Step 3: Update Environment Variables
1. Open `server/.env` file
2. Replace the MONGODB_URI with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/divine_elegant?retryWrites=true&w=majority
```

### Step 4: Create Admin User
Run this command in the server directory:
```bash
node createAdmin.js
```

## Alternative - Install MongoDB Locally

### Windows Installation
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

### Verify Installation
```bash
mongod --version
```

## Test the Setup
1. Start the server: `npm start` or `node server.js`
2. Check the console for "✅ Connected to MongoDB"
3. Try logging in with admin credentials

## Admin Credentials
- Email: admin@divineelegant.com
- Password: admin123

