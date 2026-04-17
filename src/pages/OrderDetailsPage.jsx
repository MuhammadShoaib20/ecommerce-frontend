import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FaArrowLeft, FaTruck, FaCheckCircle, FaMapMarkerAlt,
  FaCreditCard, FaBox
} from 'react-icons/fa';
import { orderStart, orderSuccess, orderFailure } from '../redux/slices/orderSlice';
import { getOrderDetailsAPI } from '../services/api';

const paymentLabel = (method) => {
  if (method === 'card') return 'Credit / Debit Card';
  if (method === 'cash_on_delivery') return 'Cash on Delivery';
  return method || 'N/A';
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((s) => s.order);

  useEffect(() => { fetchOrderDetails(); }, [id]);

  const fetchOrderDetails = async () => {
    dispatch(orderStart());
    try {
      const { data } = await getOrderDetailsAPI(id);
      dispatch(orderSuccess(data.order));
    } catch (error) {
      dispatch(orderFailure(error.response?.data?.message || 'Failed to fetch order'));
      toast.error('Failed to fetch order details');
    }
  };

  const statusConfig = {
    processing: 'bg-amber-50 text-amber-600 border-amber-200',
    shipped:    'bg-blue-50 text-blue-600 border-blue-200',
    delivered:  'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled:  'bg-red-50 text-red-600 border-red-200',
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const trackingSteps = [
    { key: 'ordered',   label: 'Order Placed', icon: <FaBox size={13} />,         active: true },
    { key: 'shipped',   label: 'Shipped',      icon: <FaTruck size={13} />,        active: order?.orderStatus === 'Shipped'   || order?.orderStatus === 'Delivered' },
    { key: 'delivered', label: 'Delivered',    icon: <FaCheckCircle size={13} />,  active: order?.orderStatus === 'Delivered' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="font-bold text-gray-700 mb-4">Order not found</p>
        <Link to="/orders" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">
          Back to Orders
        </Link>
      </div>
    </div>
  );

  const statusKey = order.orderStatus?.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link to="/orders"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> My Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Details</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order._id}</p>
          </div>
          <span className={`self-start sm:self-auto px-4 py-2 rounded-full text-xs font-bold border ${statusConfig[statusKey] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {order.orderStatus}
          </span>
        </div>

        {/* Tracking */}
        {order.orderStatus?.toLowerCase() !== 'cancelled' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Shipment Tracking</p>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-100 mx-10" />
              {trackingSteps.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                    step.active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-semibold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  {i === 0 && <span className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</span>}
                  {i === 2 && (
                    <span className="text-[10px] text-gray-400">
                      {order.deliveredAt ? formatDate(order.deliveredAt) : 'Pending'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900 text-sm">Items ({order.orderItems?.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <img src={item.image} alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`}
                        className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors block truncate">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} · ${item.price}/ea</p>
                    </div>
                    <p className="font-bold text-gray-900 flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-blue-500" size={12} />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ship To</h3>
              </div>
              <p className="font-semibold text-sm text-gray-900">{order.shippingInfo.address}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
              <p className="text-sm text-gray-500">{order.shippingInfo.country}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{order.shippingInfo.phoneNo}</p>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaCreditCard className="text-blue-500" size={12} />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-800">
                    {paymentLabel(order.paymentInfo?.method)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-bold capitalize ${
                    order.paymentInfo?.status === 'succeeded' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {order.paymentInfo?.status}
                  </span>
                </div>
              </div>

              {/* COD reminder */}
              {order.paymentInfo?.method === 'cash_on_delivery' && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-600 font-medium">
                    Please keep the exact amount ready for delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Items</span>
                  <span className="font-medium text-gray-700">${order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={`font-medium ${order.shippingPrice === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 pb-2 border-b border-gray-100">
                  <span>Tax</span>
                  <span className="font-medium text-gray-700">${order.taxPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-gray-900">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/contact"
              className="block text-center text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Need help? <span className="text-blue-600 font-bold">Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;