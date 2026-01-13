import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { orderStart, orderSuccess, orderFailure } from '../redux/slices/orderSlice';
import { getOrderDetailsAPI } from '../services/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Delivered': return 'bg-green-100 text-green-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div></div>);
  if (!order) return (<div className="min-h-screen flex items-center justify-center"><p className="text-xl text-gray-600">Order not found</p></div>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/orders" className="inline-flex items-center gap-2 text-primary hover:underline mb-6"><FaArrowLeft />Back to Orders</Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Details</h1>
              <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{order._id}</span></p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
          </div>

          <div className="mb-8 pb-8 border-b">
            <h3 className="font-bold text-lg mb-4">Order Status</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <FaCheckCircle className={`text-3xl mx-auto mb-2 ${order.orderStatus ? 'text-green-500' : 'text-gray-300'}`} />
                <p className="text-sm font-semibold">Ordered</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full ${['Shipped','Delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-200'}`}></div></div>
              <div className="text-center">
                <FaCheckCircle className={`text-3xl mx-auto mb-2 ${['Shipped','Delivered'].includes(order.orderStatus) ? 'text-green-500' : 'text-gray-300'}`} />
                <p className="text-sm font-semibold">Shipped</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full ${order.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div></div>
              <div className="text-center">
                <FaCheckCircle className={`text-3xl mx-auto mb-2 ${order.orderStatus === 'Delivered' ? 'text-green-500' : 'text-gray-300'}`} />
                <p className="text-sm font-semibold">Delivered</p>
                {order.deliveredAt && (<p className="text-xs text-gray-500">{new Date(order.deliveredAt).toLocaleDateString()}</p>)}
              </div>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b">
            <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
            <div className="text-gray-600">
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
              <p>{order.shippingInfo.country}</p>
              <p className="mt-2">Phone: {order.shippingInfo.phoneNo}</p>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id || item.product} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1"><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-500">Quantity: {item.quantity}</p></div>
                  <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">${order.totalPrice.toFixed(2)}</span></div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600"><strong>Payment Status:</strong> {order.paymentInfo.status}</p>
              <p className="text-sm text-gray-600"><strong>Payment ID:</strong> {order.paymentInfo.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
