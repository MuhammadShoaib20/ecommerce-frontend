import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaTruck, FaCreditCard, FaLock, FaChevronRight,
  FaShoppingBag, FaExclamationTriangle
} from 'react-icons/fa';
import { createOrderAPI, createPaymentIntentAPI } from '../services/api';
import { clearCart } from '../redux/slices/cartSlice';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// ---------- Stripe key check ----------
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

// ---------- Card element style ----------
const stripeStyle = {
  style: {
    base: {
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ---------- Steps ----------
const steps = ['Shipping', 'Payment', 'Review'];

// ---------- Main checkout form ----------
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems = [] } = useSelector((s) => s.cart) ?? {};

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingInfo, setShippingInfo] = useState({
    address: '', city: '', state: '', zipCode: '', country: '', phoneNo: '',
  });

  // ---------- Order totals ----------
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = subtotal >= 50 ? 0 : 9.99;
  const taxPrice = +(subtotal * 0.08).toFixed(2);
  const totalPrice = +(subtotal + shippingPrice + taxPrice).toFixed(2);

  // ---------- Shipping step ----------
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { address, city, state, zipCode, country, phoneNo } = shippingInfo;
    if (!address || !city || !state || !zipCode || !country || !phoneNo) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep(1);
  };

  // ---------- Shared order creation ----------
  const placeSimpleOrder = async (paymentInfo) => {
    const orderData = {
      orderItems: cartItems.map((i) => ({
        product: i.id,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
      })),
      shippingInfo,
      itemsPrice: subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentInfo,
    };
    const { data } = await createOrderAPI(orderData);
    dispatch(clearCart());
    navigate(`/order/success/${data.order._id}`);
  };

  // ---------- Stripe card payment ----------
  const handleStripeOrder = async () => {
    if (!STRIPE_KEY) {
      toast.error('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.');
      return;
    }
    if (!stripe || !elements) {
      toast.error('Stripe is still loading. Please try again.');
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      toast.error('Card details not found. Please go back to payment step.');
      return;
    }

    const amountInCents = Math.round(totalPrice * 100);
    if (amountInCents <= 0) {
      toast.error('Invalid order total. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      const { data: intentData } = await createPaymentIntentAPI({ amount: amountInCents });

      // Debug
      console.log('Payment intent response:', intentData);

      // Mock fallback (for development)
      if (intentData.mocked) {
        toast.info('Mock payment mode – order placed without actual payment.');
        await placeSimpleOrder({
          id: `mock_${Date.now()}`,
          status: 'succeeded',
          method: 'card',
        });
        return;
      }

      if (!intentData.clientSecret) {
        throw new Error(intentData.message || 'Payment intent creation failed.');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        { payment_method: { card: cardNumber } }
      );

      if (error) {
        console.error('Stripe error details:', error);
        toast.error(error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      await placeSimpleOrder({
        id: paymentIntent.id,
        status: paymentIntent.status,
        method: 'card',
      });
    } catch (err) {
      console.error('Payment error:', err);
      const msg = err.response?.data?.message || err.message || 'Payment processing failed';
      toast.error(msg);
      setLoading(false);
    }
  };

  // ---------- Cash on Delivery ----------
  const handleCODOrder = async () => {
    setLoading(true);
    try {
      await placeSimpleOrder({
        id: 'cod_' + Date.now(),
        status: 'pending',
        method: 'cash_on_delivery',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'card') handleStripeOrder();
    else handleCODOrder();
  };

  // ---------- Shared UI classes ----------
  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
  const stripeInputClass = "px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your purchase securely</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                i === step ? 'bg-blue-600 text-white' :
                i < step   ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                             'bg-white text-gray-400 border border-gray-200'
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  i < step   ? 'bg-emerald-500 text-white' :
                  i === step ? 'bg-white text-blue-600' :
                               'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </div>
              {i < steps.length - 1 && <FaChevronRight className="text-gray-300 text-xs" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">

            {/* STEP 0 — Shipping */}
            {step === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                    <FaTruck size={14} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Shipping Information</h2>
                    <p className="text-xs text-gray-500">Where should we deliver?</p>
                  </div>
                </div>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input className={inputClass} placeholder="123 Main Street"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input className={inputClass} placeholder="Karachi"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <input className={inputClass} placeholder="Sindh"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>ZIP / Postal Code</label>
                      <input className={inputClass} placeholder="75500"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input className={inputClass} placeholder="Pakistan"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input className={inputClass} placeholder="+92 300 0000000"
                      value={shippingInfo.phoneNo}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNo: e.target.value })} />
                  </div>
                  <button type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-2">
                    Continue to Payment <FaChevronRight size={11} />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 1 & 2 — Shared container for payment method selection and card fields */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              {/* Payment method selection (visible in steps 1 and 2) */}
              {step >= 1 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                      <FaCreditCard size={14} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Payment Method</h2>
                      <p className="text-xs text-gray-500">Choose how you'd like to pay</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'card',             label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex — powered by Stripe', icon: '💳' },
                      { id: 'cash_on_delivery', label: 'Cash on Delivery',    sub: 'Pay when you receive your order',             icon: '💵' },
                    ].map((m) => (
                      <label key={m.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                        }`}>
                        <input type="radio" name="payment" value={m.id}
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)}
                          className="accent-blue-600" />
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{m.label}</p>
                          <p className="text-xs text-gray-500">{m.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Card fields (always mounted, visibility controlled by paymentMethod and step) */}
              <div className={`${paymentMethod === 'card' ? 'block' : 'hidden'}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-blue-500" size={11} />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secure Card Details</span>
                  </div>

                  {!STRIPE_KEY && step >= 1 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium flex items-start gap-2">
                      <FaExclamationTriangle className="text-amber-500 mt-0.5" size={12} />
                      <span>Stripe key missing. Add <code className="bg-amber-100 px-1 rounded font-mono">VITE_STRIPE_PUBLISHABLE_KEY</code> to your <code className="bg-amber-100 px-1 rounded font-mono">.env</code> file.</span>
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Card Number</label>
                    <div className={stripeInputClass}>
                      <CardNumberElement options={stripeStyle} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Expiry Date</label>
                      <div className={stripeInputClass}>
                        <CardExpiryElement options={stripeStyle} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>CVC</label>
                      <div className={stripeInputClass}>
                        <CardCvcElement options={stripeStyle} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
                      <FaLock size={9} /> Encrypted by Stripe
                    </span>
                  </div>
                </div>
              </div>

              {/* COD info (always mounted) */}
              <div className={`${paymentMethod === 'cash_on_delivery' ? 'block' : 'hidden'}`}>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <span className="text-xl mt-0.5">💵</span>
                  <div>
                    <p className="text-sm font-bold text-amber-700">Cash on Delivery Selected</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Please keep the exact amount ready. Our delivery agent will collect payment on arrival.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation buttons (only in payment and review steps) */}
              {step >= 1 && (
                <div className="flex gap-3">
                  <button onClick={() => setStep(step - 1)}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all">
                    Back
                  </button>
                  {step === 1 ? (
                    <button onClick={() => setStep(2)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                      Review Order <FaChevronRight size={11} />
                    </button>
                  ) : (
                    <button onClick={handlePlaceOrder} disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                        : <><FaLock size={11} /> Place Order</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-blue-500" size={13} /> Order Summary
              </h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shippingPrice === 0 ? 'text-emerald-600' : ''}`}>
                    {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${taxPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaLock size={10} />
                <span>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ---------- Wrap with Stripe Elements provider ----------
const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;