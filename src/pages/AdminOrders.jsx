import { useEffect, useState } from 'react';
import { getAllOrdersAPI, deleteOrderAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaTrash, FaSearch, FaBoxOpen } from 'react-icons/fa';
import AdminNav from '../components/admin/AdminNav';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrdersAPI();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrderAPI(id);
      toast.success('Order deleted');
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const statusConfig = {
    Processing: 'bg-amber-50 text-amber-600 border-amber-200',
    Shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm font-bold text-gray-700">{filteredOrders.length}</span>
            <span className="text-xs text-gray-400 font-medium">Total Orders</span>
          </div>
        </div>

        <AdminNav />

        {/* Search */}
        <div className="relative mt-6 mb-6 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input type="text" placeholder="Search by ID, name or email..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all" />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <FaBoxOpen className="text-gray-200 text-5xl mx-auto mb-4" />
            <p className="font-bold text-gray-700">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="mt-4 text-sm text-blue-600 font-bold hover:underline">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-800">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{order.orderItems?.length} items</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/admin/order/${order._id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <FaEye size={15} />
                          </Link>
                          <button onClick={() => handleDelete(order._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}