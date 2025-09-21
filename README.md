# Divine Elegant - Spiritual Jewelry E-commerce

A modern e-commerce platform for spiritual and elegant jewelry, built with React, Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Catalog**: Browse spiritual jewelry with categories (bracelets, necklaces, rings, pendants, sets)
- **Shopping Cart**: Add products with different variants and sizes
- **Order Management**: Complete checkout and order tracking
- **Admin Panel**: Manage products and orders
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Real-time Updates**: Redux state management

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Testing
- Jest for unit and integration testing
- Supertest for API testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd divine-elegant
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📋 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server
- `npm run seed` - Seed the database with sample data
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

### User Model
- name, email, password, role (customer/admin)
- Password hashing with bcryptjs
- JWT token authentication

### Product Model
- name, description, images, category
- variants (size, price, stockCount)
- spiritualBenefits, careInstructions
- featured flag, rating, numReviews

### Order Model
- user reference, orderItems array
- shippingAddress, paymentMethod
- totalPrice, status, timestamps

## 🧪 Testing

The application includes comprehensive tests:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: MongoDB operations testing

Run tests with:
```bash
npm test
```

## 🔧 Configuration

Environment variables are configured in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/divine-elegant
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📁 Project Structure

```
divine-elegant/
├── server/                 # Backend code
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Express server
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── store/            # Redux store
│   └── App.tsx           # Main App component
├── tests/                # Test files
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)

### Admin
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

## 🎨 Sample Data

The application comes with sample spiritual jewelry data including:
- Sacred Chakra Bracelets
- Om Symbol Pendant Necklaces
- Moonstone Healing Rings
- Protection Amulet Pendants
- Complete Chakra Sets
- Rose Quartz Love Bracelets

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- Protected routes with middleware

## 🚀 Deployment

1. Build the frontend: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`
4. Ensure MongoDB is running in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images from Pexels
- Icons from Lucide React
- Styling with Tailwind CSS
