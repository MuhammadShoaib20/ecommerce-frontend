import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaBoxOpen } from 'react-icons/fa';
import AdminProductForm from '../components/admin/AdminProductForm';
import { getAdminProductsAPI, deleteProductAPI } from '../services/api';
import AdminNav from '../components/admin/AdminNav';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminProductsAPI();
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProductAPI(id);
      toast.success('Product deleted');
      fetchProducts();
      if (editing?._id === id) { setEditing(null); setShowForm(false); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFormSuccess = () => { setEditing(null); setShowForm(false); fetchProducts(); };

  const filteredProducts = (products || []).filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); if (!showForm) setEditing(null); }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all lg:hidden ${
              showForm ? 'bg-gray-100 text-gray-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}>
            {showForm ? <><FaTimes size={12} /> Close</> : <><FaPlus size={12} /> Add Product</>}
          </button>
        </div>

        <AdminNav />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Form */}
          <div className={`${showForm ? 'block' : 'hidden'} lg:block lg:col-span-4 lg:sticky lg:top-6`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`h-1 ${editing ? 'bg-amber-400' : 'bg-blue-600'}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editing ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {editing ? <FaEdit size={13} /> : <FaPlus size={13} />}
                    </div>
                    <h2 className="font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
                  </div>
                  {editing && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 uppercase">Editing</span>
                  )}
                </div>
                <AdminProductForm initial={editing} onSuccess={handleFormSuccess} />
                {editing && (
                  <button onClick={() => { setEditing(null); setShowForm(false); }}
                    className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-2">
                    <FaTimes size={10} /> Cancel Editing
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{filteredProducts?.length ?? 0} Products</p>
                </div>
                <div className="relative max-w-xs">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input type="text" placeholder="Search products..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FaBoxOpen className="text-gray-200 text-4xl mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No products found</p>
                  {searchTerm && <button onClick={() => setSearchTerm('')} className="mt-2 text-xs text-blue-600 font-bold hover:underline">Clear search</button>}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map(product => (
                    <div key={product._id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        editing?._id === product._id
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}>
                      <img src={product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{product.category}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm font-bold text-gray-900">
                            ${product.discountPrice > 0 ? product.discountPrice : product.price}
                          </span>
                          {product.discountPrice > 0 && (
                            <span className="text-xs text-gray-400 line-through">${product.price}</span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>{product.stock} in stock</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditing(product); setShowForm(true); }}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <FaTrash size={13} />
                        </button>
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