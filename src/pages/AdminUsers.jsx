import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash, FaUsers } from 'react-icons/fa';
import { getAllUsersAPI, deleteUserAPI, updateUserRoleAPI } from '../services/api';
import AdminNav from '../components/admin/AdminNav';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsersAPI();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUserAPI(id);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const { data } = await updateUserRoleAPI(id, { role: newRole });
      toast.success(data.message);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // Safe comparison — guards against undefined _id on either side
  const isCurrentUser = (userId) => {
    if (!userId || !currentUser?._id) return false;
    return String(userId) === String(currentUser._id);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage registered user accounts</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <FaUsers className="text-blue-500" size={13} />
            <span className="text-sm font-bold text-gray-700">{users.length}</span>
            <span className="text-xs text-gray-400 font-medium">users</span>
          </div>
        </div>

        <AdminNav />

        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const isSelf = isCurrentUser(user._id);
                  return (
                    <tr key={user._id || user.email} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100 flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-semibold text-sm text-gray-800">{user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-violet-50 text-violet-700 border border-violet-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={isSelf}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-40 transition-all"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={isSelf}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                            title="Delete user"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;