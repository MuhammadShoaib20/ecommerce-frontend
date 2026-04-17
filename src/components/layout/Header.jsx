import { useState, useEffect } from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaShoppingCart, FaUser, FaSignOutAlt, FaStore,
  FaBars, FaTimes, FaHeart, FaChevronDown, FaSun, FaMoon
} from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isDark, toggle: toggleDark } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...(isAuthenticated ? [{ label: 'Orders', to: '/orders' }] : []),
    ...(isAuthenticated && user?.role === 'admin' ? [{ label: 'Admin', to: '/admin/products' }] : []),
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200
      ${isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Shop<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">

            {/* ── Dark / Light Mode Toggle ── */}
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 overflow-hidden"
            >
              {/* Sun — visible in dark mode */}
              <FaSun
                size={16}
                className={`absolute transition-all duration-300 ease-in-out text-amber-400 ${
                  isDark ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
                }`}
              />
              {/* Moon — visible in light mode */}
              <FaMoon
                size={15}
                className={`absolute transition-all duration-300 ease-in-out ${
                  isDark ? 'opacity-0 -translate-y-3 scale-75' : 'opacity-100 translate-y-0 scale-100'
                }`}
              />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist"
              className={`relative p-2.5 rounded-lg transition-colors ${
                isActive('/wishlist')
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
              <FaHeart size={17} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart"
              className={`relative p-2.5 rounded-lg transition-colors ${
                isActive('/cart')
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
              <FaShoppingCart size={17} />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth — Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:block relative ml-1">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[11px]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <FaChevronDown size={9} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
                      <FaUser size={12} className="text-gray-400" /> Profile
                    </Link>
                    <Link to="/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
                      <FaShoppingCart size={12} className="text-gray-400" /> My Orders
                    </Link>
                    {/* Dark mode option inside dropdown */}
                    <button onClick={toggleDark}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors border-t border-gray-50 dark:border-gray-800">
                      {isDark
                        ? <FaSun size={12} className="text-amber-400" />
                        : <FaMoon size={12} className="text-gray-400" />
                      }
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <div className="border-t border-gray-50 dark:border-gray-800">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors">
                        <FaSignOutAlt size={12} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[.98] shadow-sm shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ml-1">
              {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                {link.label}
              </Link>
            ))}

            {/* Dark mode toggle in mobile menu */}
            <button onClick={toggleDark}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {isDark
                ? <><FaSun size={15} className="text-amber-400" /><span>Switch to Light Mode</span></>
                : <><FaMoon size={14} className="text-gray-500" /><span>Switch to Dark Mode</span></>
              }
            </button>

            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {user?.name}
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <FaSignOutAlt size={13} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Sign In</Link>
                  <Link to="/register" className="block px-4 py-3 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Click-away backdrop for user dropdown */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;