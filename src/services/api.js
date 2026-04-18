import axios from 'axios';

const API = axios.create({
  // Vite ke liye baseURL logic
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request Interceptor: Token automatically har request ke header mein add karega
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth Endpoints ---
export const registerAPI = (userData) => API.post('/auth/register', userData);
export const loginAPI = (credentials) => API.post('/auth/login', credentials);
export const logoutAPI = () => API.get('/auth/logout');
export const getProfileAPI = () => API.get('/auth/profile');
export const updateProfileAPI = (data) => API.put('/auth/profile/update', data);
export const updatePasswordAPI = (data) => API.put('/auth/password/update', data);

// --- Product Endpoints ---
export const getAllProductsAPI = (params) => API.get('/products', { params });
export const getProductDetailsAPI = (id) => API.get(`/product/${id}`);
export const createProductAPI = (data) => API.post('/admin/product/new', data);
export const updateProductAPI = (id, data) => API.put(`/admin/product/${id}`, data);
export const deleteProductAPI = (id) => API.delete(`/admin/product/${id}`);
export const getAdminProductsAPI = () => API.get('/admin/products');
export const createReviewAPI = (data) => API.put('/review', data);

// --- Order Endpoints ---
export const createOrderAPI = (orderData) => API.post('/order/new', orderData);
export const getMyOrdersAPI = () => API.get('/orders/me');
export const getOrderDetailsAPI = (id) => API.get(`/order/${id}`);
export const getAllOrdersAPI = () => API.get('/admin/orders');
export const updateOrderAPI = (id, status) => API.put(`/admin/order/${id}`, status);
export const deleteOrderAPI = (id) => API.delete(`/admin/order/${id}`);

// --- Payment Endpoints ---
// IMPORTANT: The correct endpoint for Stripe Elements is /payment/intent.
// It expects amount in cents and returns clientSecret.
export const processPaymentAPI = (data) => API.post('/payment/process', data); // kept for backward compatibility
export const createPaymentIntentAPI = (data) => API.post('/payment/intent', data); // 
export const getStripeKeyAPI = () => API.get('/stripeapikey');

// --- Newsletter Endpoints ---
export const subscribeEmailAPI = (data) => API.post('/newsletter/subscribe', data);
export const unsubscribeEmailAPI = (data) => API.post('/newsletter/unsubscribe', data);
export const getAllSubscriptionsAPI = () => API.get('/admin/newsletter/subscribers');
export const deleteSubscriptionAPI = (id) => API.delete(`/admin/subscription/${id}`);

// --- Contact Endpoints ---
export const submitContactAPI = (data) => API.post('/contact', data);
export const getAllContactsAPI = () => API.get('/admin/contacts');
export const deleteContactAPI = (id) => API.delete(`/admin/contact/${id}`);

// --- User Management (Admin) ---
export const getAllUsersAPI = () => API.get('/admin/users');
export const deleteUserAPI = (id) => API.delete(`/admin/user/${id}`);
export const updateUserRoleAPI = (id, data) => API.put(`/admin/user/${id}/role`, data);

export default API;