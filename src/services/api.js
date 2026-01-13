import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ecommerce-backend--msofficialcs.replit.app/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerAPI = (userData) => API.post('/auth/register', userData);
export const loginAPI = (credentials) => API.post('/auth/login', credentials);
export const logoutAPI = () => API.get('/auth/logout');
export const getProfileAPI = () => API.get('/auth/profile');
export const updateProfileAPI = (data) => API.put('/auth/profile/update', data);
export const updatePasswordAPI = (data) => API.put('/auth/password/update', data);

// Product APIs
export const getAllProductsAPI = (params) => API.get('/products', { params });
export const getProductDetailsAPI = (id) => API.get(`/product/${id}`);
export const createProductAPI = (data) => API.post('/admin/product/new', data);
export const updateProductAPI = (id, data) => API.put(`/admin/product/${id}`, data);
export const deleteProductAPI = (id) => API.delete(`/admin/product/${id}`);
export const getAdminProductsAPI = () => API.get('/admin/products');
export const createReviewAPI = (data) => API.put('/review', data);

// Order APIs
export const createOrderAPI = (orderData) => API.post('/order/new', orderData);
export const getMyOrdersAPI = () => API.get('/orders/me');
export const getOrderDetailsAPI = (id) => API.get(`/order/${id}`);
export const getAllOrdersAPI = () => API.get('/admin/orders');
export const updateOrderAPI = (id, status) => API.put(`/admin/order/${id}`, status);
export const deleteOrderAPI = (id) => API.delete(`/admin/order/${id}`);

// Payment APIs
export const processPaymentAPI = (amount) => API.post('/payment/process', { amount });
export const getStripeKeyAPI = () => API.get('/stripeapikey');

// Newsletter/Subscription APIs
export const subscribeEmailAPI = (data) => API.post('/newsletter/subscribe', data);

export default API;
