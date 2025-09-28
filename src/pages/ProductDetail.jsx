import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, ShoppingCart, Heart, Star, Shield, Sparkles, Package } from 'lucide-react';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { getBaseUrl } from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedImageIndex(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      dispatch(addToCart({ product, variant: selectedVariant, quantity }));
    }
  };

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stockCount) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600">{error || 'The product you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'description', name: 'Detailed Description', icon: <Package className="h-5 w-5" /> },
    { id: 'spiritual', name: 'Spiritual Benefits', icon: <Sparkles className="h-5 w-5" /> },
    { id: 'care', name: 'Care Instructions', icon: <Shield className="h-5 w-5" /> }
  ];

  // Helper to ensure image URL is absolute when backend returns 
  // relative paths (e.g., /assets/images/products/filename.jpg)
  const resolveImageUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    // Prepend current backend origin if available via env, else same origin
    const backend = getBaseUrl();
    return `${backend}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images && product.images.length > 0 ? 
                resolveImageUrl(product.images[selectedImageIndex] || product.images[0]) : 
                'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=600'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Only use the reliable fallback image
                e.target.src = 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=600';
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-indigo-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={resolveImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Use a simple fallback for thumbnails
                      e.target.src = 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=100';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          
          {(!product.images || product.images.length === 0) && (
            <div className="text-center text-gray-500 py-4">
              <p>No images available for this product</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.numReviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-b py-6">
            <p className="text-xl font-bold text-gray-900 mb-2">
              ₹{selectedVariant?.price.toLocaleString()}
            </p>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Variant Selection */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                      if (product.images && product.images.length > 0) {
                        const variantIndex = Math.max(0, Math.min(index, product.images.length - 1));
                        setSelectedImageIndex(variantIndex);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
                      selectedVariant?.size === variant.size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedVariant.stockCount > 0 
                    ? `${selectedVariant.stockCount} in stock` 
                    : 'Out of stock'
                  }
                </p>
              )}
            </div>
          )}

          {/* Quantity Selection - Hidden for admin users */}
          {user?.role !== 'admin' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium px-4">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={!selectedVariant || quantity >= selectedVariant.stockCount}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons - Hidden for admin users */}
          {user?.role !== 'admin' && (
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockCount === 0}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Spiritual Protection</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Energy Charged</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Heart className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Handcrafted</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Detailed product description coming soon...'}
              </p>
            </div>
          )}
          
          {activeTab === 'spiritual' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.spiritualBenefits || 'This beautiful piece carries ancient wisdom and positive energy, designed to enhance your spiritual journey and bring harmony to your life.'}
              </p>
            </div>
          )}
          
          {activeTab === 'care' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.careInstructions || 'Handle with care and love. Clean gently with a soft cloth. Store in a sacred space when not worn to maintain its spiritual energy.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;