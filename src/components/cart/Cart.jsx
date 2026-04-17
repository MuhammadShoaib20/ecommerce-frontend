import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaTrashAlt, FaShieldAlt, FaTruck, FaLock } from 'react-icons/fa';
import CartItem from './CartItem';
import { clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClearCart = () => {
    if (window.confirm('Clear the entire cart?')) {
      dispatch(clearCart());
      toast.info('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!items || items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <FaShoppingCart className="text-gray-300 text-2xl" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">Add some items to get started on your order.</p>
        <Link to="/shop"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] text-sm shadow-lg shadow-blue-500/20">
          Browse Products
        </Link>
      </div>
    </div>
  );

  const subtotal = totalPrice;
  const tax = +(subtotal * 0.1).toFixed(2);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = +(subtotal + tax + shipping).toFixed(2);
  const progressPct = Math.min((subtotal / 50) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-end">
              <button onClick={handleClearCart}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all">
                <FaTrashAlt size={11} /> Clear Cart
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Free shipping progress */}
              {subtotal < 50 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-blue-600">Free shipping goal</span>
                    <span className="text-gray-500">${(50 - subtotal).toFixed(2)} away</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>

              <button onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm mb-4">
                <FaLock size={11} /> Proceed to Checkout
              </button>

              {/* Trust badges */}
              <div className="space-y-2">
                {[
                  { icon: <FaTruck size={12} />, text: shipping === 0 ? 'Free shipping unlocked!' : 'Free shipping on orders $50+', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { icon: <FaShieldAlt size={12} />, text: '256-bit SSL encrypted checkout', color: 'text-blue-500 bg-blue-50 border-blue-100' },
                ].map((b, i) => (
                  <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${b.color}`}>
                    <span>{b.icon}</span>
                    <span className="text-xs font-medium text-gray-600">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;