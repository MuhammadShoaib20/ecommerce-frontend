import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaShoppingBag, FaArrowRight, FaTruck,
  FaShieldAlt, FaHeadset, FaStar, FaQuoteRight, FaFire
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productStart, productsSuccess, productFailure } from '../redux/slices/productSlice';
import { getAllProductsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';

const testimonials = [
  { id: 1, name: 'Sarah Johnson', role: 'Verified Buyer', content: 'ShopHub has the best prices and fastest shipping! I received my order in just 2 days.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Michael Chen', role: 'Tech Enthusiast', content: 'Amazing selection of electronics. The product quality exceeded my expectations.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Emily Rodriguez', role: 'Fashion Lover', content: 'Love the variety of clothing brands. Easy returns and excellent customer service.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
];

const categories = [
  { name: 'Electronics', icon: '💻', slug: 'Electronics' },
  { name: 'Laptops', icon: '🖥️', slug: 'Laptops' },
  { name: 'Audio', icon: '🎧', slug: 'Audio' },
  { name: 'Cameras', icon: '📷', slug: 'Cameras' },
  { name: 'Wearables', icon: '⌚', slug: 'Wearables' },
  { name: 'Gadgets', icon: '🚀', slug: 'Gadgets' },
];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
  if (!products || products.length === 0) fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    dispatch(productStart());
    try {
      const { data } = await getAllProductsAPI({ limit: 8, page: 1 });
      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productFailure(error.response?.data?.message || 'Failed to fetch products'));
      toast.error('Failed to fetch products');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 antialiased transition-colors duration-200">

      {/* HERO */}
      <section className="relative bg-[#0a0f1e] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] bg-blue-600 rounded-full opacity-[0.08] blur-[120px]" />
        <div className="absolute bottom-[-80px] right-[-40px] w-[400px] h-[400px] bg-indigo-500 rounded-full opacity-[0.07] blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaFire className="text-orange-400 text-xs" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">New Collection 2026</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Shop The<br /><span className="text-blue-500">Future.</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                A curated marketplace where quality meets affordability. Get up to <span className="text-white font-semibold">40% off</span> on your first purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/shop" className="group inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[.98]">
                  <FaShoppingBag size={15} /> Start Shopping <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop" className="inline-flex items-center justify-center text-white/70 hover:text-white border border-white/10 hover:border-white/20 font-semibold px-8 py-4 rounded-xl transition-all backdrop-blur-sm active:scale-[.98]">
                  View Catalog
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Categories', val: '20+', sub: 'departments', color: 'text-blue-400' },
                { label: 'Happy Users', val: '50k+', sub: 'customers', color: 'text-emerald-400' },
                { label: 'Support', val: '24/7', sub: 'always on', color: 'text-violet-400' },
                { label: 'Shipping', val: 'Free', sub: 'on orders $50+', color: 'text-amber-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[.04] border border-white/[.07] rounded-2xl p-6 hover:bg-white/[.07] hover:-translate-y-1 transition-all duration-300">
                  <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.val}</div>
                  <div className="text-white/80 font-semibold text-sm">{stat.label}</div>
                  <div className="text-white/30 text-xs mt-0.5 uppercase tracking-wider">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FaTruck />, title: 'Express Delivery', desc: 'Global shipping in under 3 days, tracked end-to-end.', light: 'bg-blue-50 text-blue-600 border-blue-100', dark: 'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
              { icon: <FaShieldAlt />, title: 'Secure Checkout', desc: 'Bank-grade encryption on every transaction.', light: 'bg-emerald-50 text-emerald-600 border-emerald-100', dark: 'dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
              { icon: <FaHeadset />, title: 'Expert Support', desc: 'Talk to real humans, 24 hours a day.', light: 'bg-amber-50 text-amber-600 border-amber-100', dark: 'dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
            ].map((f, i) => (
              <div key={i} className="group flex gap-5 items-start p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-lg ${f.light} ${f.dark}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">Our Store</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Featured Products</h2>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
              Explore All <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ✅ FIX: safe slice using fallback empty array */}
              {(products || []).slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Browse</p>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shop By Category</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-blue-600 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors tracking-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Social Proof</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Trusted by thousands</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="group relative bg-white/[.04] border border-white/[.07] rounded-2xl p-7 hover:bg-white/[.07] transition-all duration-300">
                <FaQuoteRight className="absolute top-6 right-6 text-2xl text-white/[.06] group-hover:text-blue-500/20 transition-colors" />
                <div className="flex items-center gap-3 mb-5">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20" />
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">"{t.content}"</p>
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="text-amber-400 text-xs" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;