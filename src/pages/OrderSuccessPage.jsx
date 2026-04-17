import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaCopy, FaShoppingBag, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getOrderDetailsAPI } from '../services/api';

const paymentLabel = (method) => {
  if (method === 'card') return '💳 Credit / Debit Card';
  if (method === 'cash_on_delivery') return '💵 Cash on Delivery';
  return method || 'N/A';
};

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('cart');
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await getOrderDetailsAPI(id);
      setOrder(data.order || data);
    } catch {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success('Order ID copied!');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Success Header */}
          <div className="bg-emerald-500 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaCheckCircle className="text-emerald-500 text-3xl" />
              </div>
              <h1 className="text-2xl font-black text-white mb-1">Order Confirmed!</h1>
              <p className="text-emerald-100 text-sm">We've received your order and we're on it.</p>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* Order ID */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order Reference</p>
                <p className="font-mono text-xs font-bold text-gray-700 break-all">{id}</p>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex-shrink-0 ml-3">
                <FaCopy size={11} /> Copy
              </button>
            </div>

            {/* Summary */}
            {order && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${order.itemsPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-semibold ${order.shippingPrice === 0 ? 'text-emerald-600' : ''}`}>
                      {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">${order.taxPrice?.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-black text-gray-900">${order.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment method */}
            {order?.paymentInfo?.method && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="font-semibold text-gray-700 text-sm">{paymentLabel(order.paymentInfo.method)}</p>
                {order.paymentInfo.method === 'cash_on_delivery' && (
                  <p className="text-xs text-amber-600 mt-1">Please keep the exact amount ready for delivery.</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/order/${id}`}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] text-sm">
                <FaEye size={12} /> View Order
              </Link>
              <Link to="/shop"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all active:scale-[.98] text-sm">
                <FaShoppingBag size={12} /> Shop More
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              A confirmation email has been sent to your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;