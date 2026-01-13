import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import AdminProductForm from '../components/admin/AdminProductForm';
import { getAdminProductsAPI, deleteProductAPI } from '../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminProductsAPI();
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductAPI(id);
      toast.success('Product deleted successfully');
      fetchProducts();
      if (editing && editing._id === id) {
        setEditing(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFormSuccess = (product) => {
    setEditing(null);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your products and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editing ? 'Edit Product' : 'New Product'}
                </h2>
                {editing && (
                  <button
                    onClick={() => setEditing(null)}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <FaPlus /> New
                  </button>
                )}
              </div>
              <AdminProductForm initial={editing} onSuccess={handleFormSuccess} />
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Products ({filteredProducts.length})
                </h2>
                <div className="relative w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map(p => (
                    <div 
                      key={p._id} 
                      className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition ${
                        editing && editing._id === p._id ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={p.name} 
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800 mb-1">{p.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{p.category}</span>
                            <span className="font-semibold text-primary">${p.discountPrice > 0 ? p.discountPrice : p.price}</span>
                            {p.discountPrice > 0 && (
                              <span className="text-gray-400 line-through">${p.price}</span>
                            )}
                            <span className={`px-2 py-1 rounded ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              Stock: {p.stock}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditing(p)} 
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(p._id)} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
