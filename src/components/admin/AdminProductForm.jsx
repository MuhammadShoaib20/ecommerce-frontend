import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProductAPI, updateProductAPI } from '../../services/api';
import { FaCloudUploadAlt, FaTimes, FaSave } from 'react-icons/fa';

const categories = [
  'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
  'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
];

export default function AdminProductForm({ initial = null, onSuccess }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: 0,
    category: categories[0], stock: 1, images: []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initial?._id) {
      setForm({
        name: initial.name || '', description: initial.description || '',
        price: initial.price || '', discountPrice: initial.discountPrice || 0,
        category: initial.category || categories[0], stock: initial.stock || 1,
        images: initial.images || []
      });
      setImagePreviews(initial.images?.map(img => img.url) || []);
    } else {
      resetForm();
    }
    setFiles([]);
  }, [initial]);

  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
  });

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    const previews = await Promise.all(selected.map(file => new Promise(resolve => {
      const r = new FileReader();
      r.onload = (ev) => resolve(ev.target.result);
      r.readAsDataURL(file);
    })));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImagePreview = (index) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (index < form.images.length) {
      setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    } else {
      setFiles(files.filter((_, i) => i !== index - form.images.length));
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', discountPrice: 0, category: categories[0], stock: 1, images: [] });
    setFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = [...form.images];
      if (files.length > 0) {
        const b64 = await Promise.all(files.map(toBase64));
        images = [...images, ...b64];
      }
      if (images.length === 0) { toast.error('Add at least one product image'); setLoading(false); return; }

      const payload = { ...form, images, price: parseFloat(form.price), discountPrice: parseFloat(form.discountPrice) || 0, stock: parseInt(form.stock) || 1 };
      let res;
      if (initial?._id) {
        res = await updateProductAPI(initial._id, payload);
        toast.success('Product updated!');
      } else {
        res = await createProductAPI(payload);
        toast.success('Product created!');
        resetForm();
      }
      setLoading(false);
      if (onSuccess) onSuccess(res.data?.product || null);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className={labelClass}>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} required
          placeholder="e.g. Wireless Headphones" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required
          rows={3} placeholder="Product features and details..."
          className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange}
            required placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Sale ($)</label>
          <input name="discountPrice" type="number" step="0.01" value={form.discountPrice}
            onChange={handleChange} placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange}
            required min="1" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Images</label>
        <label className="flex items-center justify-center gap-2 w-full h-11 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
          <FaCloudUploadAlt className="text-gray-400" size={15} />
          <span className="text-sm text-gray-500 font-medium">Upload images</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </label>
      </div>

      {/* Previews */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImagePreview(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors">
                <FaTimes size={9} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60 text-sm mt-2">
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          : <><FaSave size={13} /> {initial?._id ? 'Update Product' : 'Create Product'}</>
        }
      </button>
    </form>
  );
}