import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingBag, FaChevronRight } from 'react-icons/fa';
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

  const statusConfig = {
    processing: 'bg-amber-50 text-amber-600 border-amber-200',
    shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  };

  const progressWidth = { processing: 'w-1/3 bg-amber-400', shipped: 'w-2/3 bg-blue-500', delivered: 'w-full bg-emerald-500' };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  if (!orders || orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <FaShoppingBag className="text-gray-300 text-2xl" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">You haven't placed any orders. Start exploring our store!</p>
        <Link to="/shop" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] text-sm text-center">
          Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = order.orderStatus?.toLowerCase();
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">

                {/* Order Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order</p>
                      <p className="font-mono text-xs font-bold text-gray-700">#{order._id.slice(-10).toUpperCase()}</p>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-gray-100" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Placed</p>
                      <p className="text-xs font-semibold text-gray-700">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${statusConfig[statusKey] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Order Body */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.orderItems?.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl border-2 border-white shadow-sm" />
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="w-12 h-12 bg-gray-100 rounded-xl border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
                      <p className="text-xl font-black text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <Link to={`/order/${order._id}`}
                      className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-[.98] group">
                      Details <FaChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                {statusKey !== 'cancelled' && (
                  <div className="h-1 bg-gray-50">
                    <div className={`h-full transition-all duration-700 ${progressWidth[statusKey] || 'w-0'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mt-10">
          — End of order history —
        </p>
      </div>
    </div>
  );
};

export default MyOrders;