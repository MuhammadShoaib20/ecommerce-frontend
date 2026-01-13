import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import { productStart, productsSuccess, productFailure } from '../redux/slices/productSlice';
import { getAllProductsAPI } from '../services/api';

const categories = [
  'All',
  'Electronics',
  'Cameras',
  'Laptops',
  'Accessories',
  'Headphones',
  'Food',
  'Books',
  'Clothes/Shoes',
  'Beauty/Health',
  'Sports',
  'Outdoor',
  'Home'
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { products, loading, totalPages } = useSelector((state) => state.product);

  // Update category when URL changes
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage]);

  const fetchProducts = async () => {
    dispatch(productStart());
    try {
      const params = { page: currentPage, limit: 12 };

      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.keyword = searchTerm;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      const { data } = await getAllProductsAPI(params);
      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productFailure(error.response?.data?.message || 'Failed to fetch products'));
      toast.error('Failed to fetch products');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Update URL without page reload
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shop Products</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition">Search</button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h3 className="text-xl font-bold mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button key={category} onClick={() => handleCategoryChange(category)} className={`block w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === category ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>{category}</button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input type="number" placeholder="Min Price" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <input type="number" placeholder="Max Price" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <button onClick={fetchProducts} className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">Apply</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (<ProductCard key={product._id} product={product} />))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">Previous</button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">Next</button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20"><p className="text-xl text-gray-600">No products found</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
