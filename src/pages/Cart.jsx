import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleUpdateQuantity = (productId, variantSize, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, variantSize, quantity }));
    }
  };

  const handleRemoveItem = (productId, variantSize) => {
    dispatch(removeFromCart({ productId, variantSize }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some spiritual adornments to begin your journey</p>
          <Link
            to="/shop"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link 
                      to={`/product/${item.product._id}`}
                      className="hover:text-indigo-600 transition-colors duration-200"
                    >
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600">Size: {item.variant.size}</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    ₹{item.variant.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.variant.size, item.quantity - 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium px-3">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.variant.size, item.quantity + 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{(item.variant.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.product._id, item.variant.size)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;