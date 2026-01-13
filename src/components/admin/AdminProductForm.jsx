import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProductAPI, updateProductAPI } from '../../services/api';

const categories = [
  'Electronics','Cameras','Laptops','Accessories','Headphones','Food','Books','Clothes/Shoes','Beauty/Health','Sports','Outdoor','Home'
];

export default function AdminProductForm({ initial = null, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: 0,
    category: categories[0],
    stock: 1,
    images: []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Reset form when initial changes
  useEffect(() => {
    if (initial && initial._id) {
      setForm({
        name: initial.name || '',
        description: initial.description || '',
        price: initial.price || '',
        discountPrice: initial.discountPrice || 0,
        category: initial.category || categories[0],
        stock: initial.stock || 1,
        images: initial.images || []
      });
      setImagePreviews(initial.images?.map(img => img.url) || []);
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        discountPrice: 0,
        category: categories[0],
        stock: 1,
        images: []
      });
      setImagePreviews([]);
    }
    setFiles([]);
  }, [initial]);

  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (e) => rej(e);
  });

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    
    // Create previews
    const previews = await Promise.all(selected.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImagePreview = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    if (index < form.images.length) {
      const newImages = form.images.filter((_, i) => i !== index);
      setForm({ ...form, images: newImages });
    } else {
      const fileIndex = index - form.images.length;
      const newFiles = files.filter((_, i) => i !== fileIndex);
      setFiles(newFiles);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      discountPrice: 0,
      category: categories[0],
      stock: 1,
      images: []
    });
    setFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = [...form.images];
      if (files.length > 0) {
        const b64 = await Promise.all(files.map(f => toBase64(f)));
        images = [...images, ...b64];
      }

      if (images.length === 0) {
        toast.error('Please add at least one product image');
        setLoading(false);
        return;
      }

      const payload = { 
        ...form, 
        images,
        price: parseFloat(form.price),
        discountPrice: parseFloat(form.discountPrice) || 0,
        stock: parseInt(form.stock) || 1
      };

      let res;
      if (initial && initial._id) {
        res = await updateProductAPI(initial._id, payload);
        toast.success('Product updated successfully!');
      } else {
        res = await createProductAPI(payload);
        toast.success('Product created successfully!');
        resetForm();
      }

      setLoading(false);
      if (onSuccess) {
        onSuccess(res.data?.product || null);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {initial && initial._id ? 'Edit Product' : 'Create New Product'}
        </h3>
        {initial && initial._id && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (onSuccess) onSuccess(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Form
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
        <input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Enter product name" 
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Enter product description" 
          required 
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
          <input 
            name="price" 
            type="number" 
            step="0.01"
            value={form.price} 
            onChange={handleChange} 
            placeholder="0.00" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price ($)</label>
          <input 
            name="discountPrice" 
            type="number" 
            step="0.01"
            value={form.discountPrice} 
            onChange={handleChange} 
            placeholder="0.00" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
          <input 
            name="stock" 
            type="number" 
            value={form.stock} 
            onChange={handleChange} 
            placeholder="1" 
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFiles}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">You can select multiple images</p>
        
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => removeImagePreview(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))} 
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (initial && initial._id ? 'Update Product' : 'Create Product')}
        </button>
        {initial && initial._id && (
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
