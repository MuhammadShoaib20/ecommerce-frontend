import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShieldAlt, FaHome } from 'react-icons/fa';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10 text-center animate-fade-in">
          
          {/* Security Icon */}
          <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <FaShieldAlt className="text-red-500 text-4xl" />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed font-medium">
            Oops! It looks like you don't have the required permissions to access this restricted area.
          </p>

          {/* Action Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:-translate-y-1 active:scale-95"
          >
            <FaHome size={18} />
            Back to Homepage
          </Link>

          {/* Subtle Help Text */}
          <p className="mt-6 text-xs text-gray-400 font-semibold uppercase tracking-widest">
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
