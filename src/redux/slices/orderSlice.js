import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    ordersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
    }
  }
});

export const { orderStart, orderSuccess, ordersSuccess, orderFailure, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
