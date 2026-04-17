import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderDetailsAPI, updateOrderAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaTruck } from 'react-icons/fa';
import AdminNav from '../components/admin/AdminNav';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await getOrderDetailsAPI(id);
      const orderData = data.order || data;
      setOrder(orderData);
      setStatus(orderData.orderStatus || 'Processing');
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateOrderAPI(id, { status });
      toast.success('Order status updated');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    Processing: 'bg-amber-50 text-amber-600 border-amber-200',
    Shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center max-w-sm">
        <p className="text-lg font-bold text-gray-700 mb-4">Order not found</p>
        <Link to="/admin/orders" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm">Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/admin/orders" className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium mb-2 transition-colors">
              <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to Orders
            </Link>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Details</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order._id}</p>
          </div>
          <span className={`self-start sm:self-center px-4 py-2 rounded-full text-xs font-bold border ${statusConfig[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {order.orderStatus}
          </span>
        </div>

        <AdminNav />

        <div className="mt-6 space-y-6">

          {/* Status Update */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <FaTruck size={13} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Update Status</h3>
                <p className="text-xs text-gray-500">Change the current shipment phase</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button onClick={handleUpdate} disabled={updating || status === order.orderStatus}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {updating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave size={12} />}
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <FaUser size={12} />, label: 'Customer',
                content: <><p className="font-bold text-gray-900 text-sm">{order.user?.name || 'N/A'}</p><p className="text-xs text-gray-500 mt-0.5">{order.user?.email || 'N/A'}</p></>
              },
              {
                icon: <FaCalendarAlt size={12} />, label: 'Placed On',
                content: <><p className="font-bold text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p><p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleTimeString()}</p></>
              },
              {
                icon: <FaMapMarkerAlt size={12} />, label: 'Ship To',
                content: <><p className="font-bold text-gray-900 text-sm">{order.shippingInfo?.city}, {order.shippingInfo?.country}</p><p className="text-xs text-gray-500 mt-0.5">{order.shippingInfo?.phoneNo}</p></>
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-500">{item.icon}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                </div>
                {item.content}
              </div>
            ))}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Order Items</h3>
              <span className="text-xs text-gray-500 font-medium">{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} · ${item.price}/ea</p>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-blue-500" size={13} />
                <h3 className="font-bold text-gray-900 text-sm">Payment Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-800">Stripe / Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-bold ${order.paymentInfo?.status === 'succeeded' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentInfo?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-xs text-gray-400 font-mono break-all">{order.paymentInfo?.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Order Total</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span className="font-medium text-gray-800">${order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span><span className="font-medium text-gray-800">${order.shippingPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span><span className="font-medium text-gray-800">${order.taxPrice?.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}