import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderDetailsAPI, updateOrderAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaCheckCircle } from 'react-icons/fa';

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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateOrderAPI(id, { status });
      toast.success('Order status updated successfully');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Order not found</p>
          <Link to="/admin/orders" className="mt-4 inline-block text-primary hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <FaArrowLeft /> Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
              <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{order._id}</span></p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          {/* Order Status Update */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Order Status</h3>
            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleUpdate}
                disabled={updating || status === order.orderStatus}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSave /> {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
              <p className="text-sm text-gray-600"><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600"><strong>Total:</strong> <span className="text-primary font-semibold">${order.totalPrice?.toFixed(2)}</span></p>
              <p className="text-sm text-gray-600"><strong>Items:</strong> {order.orderItems?.length || 0}</p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingInfo && (
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{order.shippingInfo.address}</p>
                <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                <p>{order.shippingInfo.country}</p>
                <p className="mt-2">Phone: {order.shippingInfo.phoneNo}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${order.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
            {order.paymentInfo && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600"><strong>Payment Status:</strong> {order.paymentInfo.status}</p>
                <p className="text-sm text-gray-600"><strong>Payment ID:</strong> {order.paymentInfo.id}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
