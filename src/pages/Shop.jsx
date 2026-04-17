import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import { productStart, productsSuccess, productFailure } from '../redux/slices/productSlice';
import { getAllProductsAPI } from '../services/api';

const categories = [
  'All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
  'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const dispatch = useDispatch();
  const { products, loading, totalPages } = useSelector((state) => state.product);
  const debounceTimeout = useRef(null);

  // Debounce search term
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  // Sync selectedCategory with URL parameter
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
      setCurrentPage(1);
    }
  }, [searchParams, selectedCategory]);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, debouncedSearchTerm, priceRange.min, priceRange.max]);

  const fetchProducts = async () => {
    dispatch(productStart());
    try {
      const params = { page: currentPage, limit: 12 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();
      if (normalizedSearch) params.keyword = normalizedSearch;
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
    setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    category === 'All' ? setSearchParams({}) : setSearchParams({ category });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shop</h1>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCategory !== 'All' ? selectedCategory : 'All Products'} · {products?.length ?? 0} items
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-24 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 text-sm shadow-sm mb-6"
        >
          <FaFilter className="text-blue-600" size={12} /> Filters
          {selectedCategory !== 'All' && <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />}
        </button>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className={`fixed inset-0 z-50 bg-white lg:relative lg:z-auto lg:block lg:w-64 lg:bg-transparent
            ${showFilters ? 'block' : 'hidden'} transition-all`}>
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 lg:hidden">
              <h2 className="font-black text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-lg">
                <FaTimes size={13} />
              </button>
            </div>

            <div className="p-5 lg:p-0 space-y-4 lg:sticky lg:top-6">

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="font-bold text-gray-900 text-sm">Categories</h3>
                </div>
                <div className="space-y-0.5 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <FaChevronRight size={9} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="font-bold text-gray-900 text-sm">Price Range</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-blue-500/20 mb-2"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full text-sm font-medium text-gray-400 hover:text-red-500 py-1.5 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile overlay */}
          {showFilters && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setShowFilters(false)} />}

          {/* Products */}
          <main className="flex-1">
            {loading && (products?.length === 0 || !products) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : (products?.length ?? 0) > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    <span className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <FaSearch className="text-gray-300 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 mb-5">Try adjusting your filters or search term.</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;