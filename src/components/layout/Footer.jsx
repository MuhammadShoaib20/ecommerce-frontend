import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { subscribeEmailAPI } from '../../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    try {
      await subscribeEmailAPI({ email });
      toast.success('Successfully subscribed! Check your email for updates.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3 text-white">ShopHub</h3>
          <p className="text-sm text-gray-400">
            Fast, reliable shopping for electronics, fashion, sports and more. Free shipping on orders over $50.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop?category=Electronics" className="text-gray-300 hover:text-primary transition">
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Laptops" className="text-gray-300 hover:text-primary transition">
                Laptops
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Headphones" className="text-gray-300 hover:text-primary transition">
                Headphones
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Sports" className="text-gray-300 hover:text-primary transition">
                Sports
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-gray-300 hover:text-primary transition">
                View All Products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/orders" className="text-gray-300 hover:text-primary transition">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-primary transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-gray-300 hover:text-primary transition">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="text-gray-300 hover:text-primary transition">
                Payments
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-3">Get offers and updates in your inbox.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button 
              type="submit"
              disabled={subscribing}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribing ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShopHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
