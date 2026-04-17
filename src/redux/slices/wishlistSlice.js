import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const wishlistData = localStorage.getItem('wishlist');
    return wishlistData ? JSON.parse(wishlistData) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      if (!exists) {
        state.items.push(product);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;