import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingBag, FaStar, FaArrowRight, FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { productStart, productsSuccess, productFailure } from '../redux/slices/productSlice';
import { getAllProductsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    // Only fetch if products are not already loaded
    if (products.length === 0) {
      fetchFeaturedProducts();
    }
  }, []);

  const fetchFeaturedProducts = async () => {
    dispatch(productStart());
    try {
      const { data } = await getAllProductsAPI({ limit: 8, page: 1 });
      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productFailure(error.response?.data?.message || 'Failed to fetch products'));
    }
  };

  const features = [
    {
      icon: <FaTruck className="text-3xl" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Secure Payment',
      description: '100% secure payment gateway'
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: '24/7 Support',
      description: 'Dedicated customer support'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to <span className="text-yellow-300">ShopHub</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Discover amazing products at unbeatable prices. Shop the latest trends in electronics, fashion, and more!
              </p>
              <div className="flex gap-4">
                <Link
                  to="/shop"
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 text-lg"
                >
                  <FaShoppingBag /> Shop Now
                </Link>
                <Link
                  to="/shop"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
                >
                  Browse Products
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <div className="text-4xl font-bold">19+</div>
                    <div className="text-sm">Products</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <div className="text-4xl font-bold">100%</div>
                    <div className="text-sm">Satisfaction</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <div className="text-4xl font-bold">24/7</div>
                    <div className="text-sm">Support</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                    <div className="text-4xl font-bold">Free</div>
                    <div className="text-sm">Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked products just for you</p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-primary font-semibold hover:text-secondary transition"
            >
              View All <FaArrowRight />
            </Link>
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No products available</p>
              <Link
                to="/shop"
                className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
              >
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Electronics', 'Laptops', 'Headphones', 'Cameras', 'Accessories', 'Sports'].map((category) => (
              <Link
                key={category}
                to={`/shop?category=${category}`}
                className="bg-gray-50 hover:bg-primary hover:text-white p-6 rounded-lg text-center transition group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">📦</div>
                <div className="font-semibold">{category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of satisfied customers. Get the best deals on your favorite products!
          </p>
          <Link
            to="/shop"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2 text-lg"
          >
            <FaShoppingBag /> Start Shopping Now
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
