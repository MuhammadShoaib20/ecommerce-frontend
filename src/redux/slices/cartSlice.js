import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch (error) {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          stock: newItem.stock,
          quantity: newItem.quantity,
          totalPrice: newItem.price * newItem.quantity
        });
      }

      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);

      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);

      saveCartToStorage(state);
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
      }

      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);

      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      saveCartToStorage(state);
    }
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
