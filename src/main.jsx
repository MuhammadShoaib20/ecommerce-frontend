import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import './index.css';
import store from './redux/store.js';
import { loginSuccess } from './redux/slices/authSlice.js';
import { getProfileAPI } from './services/api.js';

// Component to restore auth state on app load
const AuthRestorer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by fetching user profile
      getProfileAPI()
        .then(({ data }) => {
          if (data.success && data.user) {
            dispatch(loginSuccess({ user: data.user, token }));
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthRestorer />
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
