import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ShoppingCart } from 'lucide-react';
import { getBaseUrl } from '../utils/api.js';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useSelector((state) => state.auth);
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add the first available variant
    const firstVariant = product.variants[0];
    if (firstVariant && onAddToCart) {
      onAddToCart(product, firstVariant, 1);
    }
  };

  const resolveImageUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const backend = getBaseUrl();
    return `${backend}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200">
          <img
            src={product.images && product.images.length > 0 ? resolveImageUrl(product.images[0]) : 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Only use the reliable fallback image
              e.target.src = 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400';
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {product.name}
            </h3>
            {product.certification && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                {product.certification}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {product.material && (
            <p className="text-xs text-gray-500 mb-3">
              <span className="font-medium">Material:</span> {product.material}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({product.numReviews})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                {minPrice === maxPrice ? (
                  `₹${minPrice.toLocaleString()}`
                ) : (
                  `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
                )}
              </span>
              <span className="text-sm text-gray-500">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {onAddToCart && user?.role !== 'admin' && (
              <button
                onClick={handleQuickAdd}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:scale-105 transform"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;