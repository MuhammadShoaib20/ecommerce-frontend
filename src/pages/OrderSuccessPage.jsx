import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const { id } = useParams();

  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. Your order has been placed successfully.</p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-mono text-sm font-semibold text-gray-800">{id}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">You will receive an email confirmation shortly with your order details.</p>

        <div className="space-y-3">
          <Link to="/orders" className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition">View My Orders</Link>
          <Link to="/shop" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
