import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStore, FaArrowRight, FaInstagram, FaFacebookF, FaWhatsapp,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaShieldAlt, FaTruck,
  FaUndo, FaLock, FaCcVisa, FaCcMastercard
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { subscribeEmailAPI } from '../../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribing(true);
    try {
      await subscribeEmailAPI({ email });
      toast.success('You have successfully subscribed! 🎉');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const trustBadges = [
    { icon: <FaTruck size={16} />,    title: 'Free Delivery',      sub: 'On orders above $50'     },
    { icon: <FaUndo size={15} />,     title: 'Easy Returns',       sub: '30-day hassle-free'       },
    { icon: <FaShieldAlt size={15} />, title: 'Secure Payments',   sub: '256-bit SSL encrypted'   },
    { icon: <FaLock size={14} />,     title: 'Privacy Protected',  sub: 'Your data is safe'       },
  ];

  const quickShopLinks = [
    { label: 'All Products',   to: '/shop' },
    { label: 'New Arrivals',   to: '/shop?sort=new' },
    { label: 'Best Sellers',   to: '/shop?sort=popular' },
    { label: 'Electronics',    to: '/shop?category=Electronics' },
    { label: 'Fashion',        to: '/shop?category=Clothes/Shoes' },
    { label: 'Offers & Deals', to: '/shop?filter=sale' },
  ];

  const helpLinks = [
    { label: 'Track Your Order',    to: '/orders'  },
    { label: 'Returns & Exchanges', to: '/'        },
    { label: 'Shipping Info',       to: '/'        },
    { label: 'FAQs',                to: '/'        },
    { label: 'Contact Us',          to: '/contact' },
  ];

  const policyLinks = [
    { label: 'Shipping Policy',   to: '/' },
    { label: 'Return & Refund',   to: '/' },
    { label: 'Privacy Policy',    to: '/' },
    { label: 'Terms & Conditions', to: '/' },
  ];

  const NavLink = ({ to, label }) => (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-1.5 text-sm
          text-gray-500 hover:text-blue-600
          dark:text-white/50 dark:hover:text-white
          font-medium transition-colors duration-150"
      >
        <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 text-blue-500 flex-shrink-0">
          <FaArrowRight size={8} />
        </span>
        {label}
      </Link>
    </li>
  );

  return (
    <footer className="bg-white dark:bg-[#0a0f1e] text-gray-800 dark:text-white mt-16 border-t border-gray-100 dark:border-transparent transition-colors duration-300">

      {/* ── TRUST STRIP ─────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-white/[.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-100 dark:md:divide-white/[.06]">
            {trustBadges.map((t, i) => (
              <div key={i} className="flex items-center gap-3 md:px-6 first:pl-0 last:pr-0">
                <div className="w-9 h-9 bg-blue-50 dark:bg-blue-600/15 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  {t.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-800 dark:text-white">{t.title}</p>
                  <p className="text-[10px] text-gray-400 dark:text-white/35 font-medium mt-0.5">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* COL 1 — Brand + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4">

            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FaStore className="text-white text-sm" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Shop<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed mb-6 max-w-xs">
              ShopHub — Where quality meets trust. We bring you the world's best brands in one place. No compromise on quality, ever.
            </p>

            {/* Newsletter */}
            <div className="bg-gray-50 dark:bg-white/[.04] border border-gray-200 dark:border-white/[.07] rounded-2xl p-4 mb-6">
              <p className="text-xs font-black text-gray-700 dark:text-white/80 uppercase tracking-widest mb-1">
                Newsletter
              </p>
              <p className="text-[11px] text-gray-400 dark:text-white/35 mb-3">
                Be the first to hear about new arrivals and exclusive deals.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-xs font-medium transition-all focus:outline-none
                    bg-white border border-gray-200 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    dark:bg-white/[.06] dark:border-white/[.08] dark:text-white dark:placeholder-white/25
                    dark:focus:border-blue-500/50 dark:focus:bg-white/[.08]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[.97] disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {subscribing ? '...' : 'Join'}
                </button>
              </form>
            </div>

            {/* Social */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/25 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: <FaInstagram size={14} />, href: '#', label: 'Instagram', hover: 'hover:bg-pink-600'    },
                  { icon: <FaFacebookF size={13} />, href: '#', label: 'Facebook',  hover: 'hover:bg-blue-700'   },
                  { icon: <FaWhatsapp  size={14} />, href: '#', label: 'WhatsApp',  hover: 'hover:bg-emerald-600' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:text-white hover:border-transparent
                      bg-gray-100 border border-gray-200 text-gray-500
                      dark:bg-white/[.05] dark:border-white/[.07] dark:text-white/40
                      ${s.hover}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* COL 2 — Quick Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-white/25 mb-5">
              Quick Shop
            </h4>
            <ul className="space-y-3">
              {quickShopLinks.map((l) => <NavLink key={l.label} {...l} />)}
            </ul>
          </div>

          {/* COL 3 — Help Center */}
          <div className="lg:col-span-2">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-white/25 mb-5">
              Help Center
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((l) => <NavLink key={l.label} {...l} />)}
            </ul>
          </div>

          {/* COL 4 — Policies + Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-white/25 mb-5">
              Policies
            </h4>
            <ul className="space-y-3 mb-7">
              {policyLinks.map((l) => <NavLink key={l.label} {...l} />)}
            </ul>

            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-white/25 mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              {[
                { icon: <FaMapMarkerAlt size={11} />, text: '123 ShopHub Street, Karachi, Pakistan' },
                { icon: <FaPhoneAlt    size={10} />, text: '+92 (300) 123-4567'                     },
                { icon: <FaEnvelope   size={10} />, text: 'support@shophub.com'                     },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">{c.icon}</span>
                  <span className="text-xs text-gray-500 dark:text-white/45 font-medium leading-relaxed">
                    {c.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────── */}
      <div className="border-t border-gray-100 dark:border-white/[.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-xs text-gray-400 dark:text-white/25 font-medium order-3 sm:order-1 text-center sm:text-left">
              © {new Date().getFullYear()} ShopHub. All Rights Reserved. Made with ❤️ for Shoppers.
            </p>

            {/* Payment Methods (JazzCash removed) */}
            <div className="flex items-center gap-3 order-1 sm:order-2">
              <span className="text-[9px] text-gray-400 dark:text-white/20 font-bold uppercase tracking-widest hidden sm:inline">
                We Accept
              </span>
              <div className="flex items-center gap-2">
                <div
                  title="Visa"
                  className="h-7 px-2.5 rounded-lg flex items-center justify-center
                    bg-gray-100 border border-gray-200 text-gray-500
                    dark:bg-white/[.06] dark:border-white/[.07] dark:text-white/60"
                >
                  <FaCcVisa size={22} />
                </div>
                <div
                  title="Mastercard"
                  className="h-7 px-2.5 rounded-lg flex items-center justify-center
                    bg-gray-100 border border-gray-200 text-gray-500
                    dark:bg-white/[.06] dark:border-white/[.07] dark:text-white/60"
                >
                  <FaCcMastercard size={22} />
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="flex items-center gap-4 order-2 sm:order-3">
              <Link to="/" className="text-xs text-gray-400 dark:text-white/20 hover:text-blue-600 dark:hover:text-white/50 font-medium transition-colors">
                Privacy
              </Link>
              <Link to="/" className="text-xs text-gray-400 dark:text-white/20 hover:text-blue-600 dark:hover:text-white/50 font-medium transition-colors">
                Terms
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;