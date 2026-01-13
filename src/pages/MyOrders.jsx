import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaShoppingBag } from 'react-icons/fa';
import { orderStart, ordersSuccess, orderFailure } from '../redux/slices/orderSlice';
import { getMyOrdersAPI } from '../services/api';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    dispatch(orderStart());
    try {
      const { data } = await getMyOrdersAPI();
      dispatch(ordersSuccess(data.orders));
    } catch (error) {
      dispatch(orderFailure(error.response?.data?.message || 'Failed to fetch orders'));
      toast.error('Failed to fetch orders');
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

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-gray-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold">{order._id}</p>
                </div>
                <span className={`px-4 py-1 rounded-full font-semibold text-sm ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div><p className="text-sm text-gray-500">Order Date</p><p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-sm text-gray-500">Total Amount</p><p className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-500">Items</p><p className="font-semibold">{order.orderItems.length} item(s)</p></div>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Link to={`/order/${order._id}`} className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"><FaEye />View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
