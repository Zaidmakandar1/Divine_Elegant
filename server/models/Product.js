import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['rudraksha', 'karungali', 'spatika', 'tulasi', 'panchamuki']
  },
  variants: [variantSchema],
  spiritualBenefits: String,
  careInstructions: String,
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  certification: {
    type: String,
    default: 'Lab Certified'
  },
  material: {
    type: String,
    required: [true, 'Material is required']
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);