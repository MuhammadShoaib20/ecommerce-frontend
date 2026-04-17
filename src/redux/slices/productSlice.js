import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],   // ✅ always array
  product: null,
  loading: false,
  error: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    productStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products || [];  // ✅ safe
      state.totalProducts = action.payload.totalProducts || 0;
      state.currentPage = action.payload.currentPage || 1;
      state.totalPages = action.payload.totalPages || 1;
    },
    productSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    productFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  }
});

export const { productStart, productsSuccess, productSuccess, productFailure, clearErrors } = productSlice.actions;
export default productSlice.reducer;