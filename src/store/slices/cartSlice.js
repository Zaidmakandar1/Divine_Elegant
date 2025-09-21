import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      // Clear cart if no user is logged in
      localStorage.removeItem('cart');
      return [];
    }
    
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cartItems) => {
  try {
    // Only save cart if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  } catch (error) {
    console.error('Failed to save cart to localStorage');
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        item => item.product._id === product._id && item.variant.size === variant.size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          variant,
          quantity,
          id: `${product._id}-${variant.size}`
        });
      }
      
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { productId, variantSize } = action.payload;
      state.items = state.items.filter(
        item => !(item.product._id === productId && item.variant.size === variantSize)
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, variantSize, quantity } = action.payload;
      const item = state.items.find(
        item => item.product._id === productId && item.variant.size === variantSize
      );
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    // Clear cart when user logs out
    clearCartOnLogout: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearCartOnLogout } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);

export default cartSlice.reducer;