import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaArrowLeft } from 'react-icons/fa';

import { orderStart, orderSuccess, orderFailure } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { createOrderAPI, processPaymentAPI, getStripeKeyAPI } from '../services/api';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

/* =========================
   Checkout Form - Inner Component
========================= */
const CheckoutForm = ({
  shippingInfo,
  handleChange,
  paymentMethod,
  setPaymentMethod,
  loading,
  finalTotal,
  processOrder,
  stripePromiseLoaded // New prop to indicate if Stripe is loaded
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const submitHandler = (e) => {
    e.preventDefault();
    processOrder(finalTotal, stripe, elements);
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      {/* Shipping Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={shippingInfo.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={shippingInfo.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              id="state"
              value={shippingInfo.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={shippingInfo.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Zip Code"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phoneNo">Phone Number</label>
            <input
              type="tel"
              name="phoneNo"
              id="phoneNo"
              value={shippingInfo.phoneNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Phone Number"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              id="cardPayment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <label htmlFor="cardPayment" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FaCreditCard className="text-2xl text-primary" />
              <div>
                <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Pay securely with your card</p>
              </div>
            </label>
          </div>

          {paymentMethod === 'card' && stripePromiseLoaded && (
            <div className="p-4 border border-gray-300 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
              <div className="p-3 border border-gray-300 rounded-lg">
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Use test card: 4242 4242 4242 4242</p>
            </div>
          )}

          {paymentMethod === 'card' && !stripePromiseLoaded && (
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Card payment will be processed securely. No card details required for demo.</p>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              id="codPayment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-green-600 focus:ring-green-600"
            />
            <label htmlFor="codPayment" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FaLock className="text-2xl text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when you receive</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            Processing Order...
          </>
        ) : (
          `Place Order - $${finalTotal.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

/* =========================
   Main Checkout Page
========================= */
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth); // Access user from auth state
  const { loading } = useSelector((state) => state.order);

  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe('pk_test_dummy') // 👈 fallback so Elements always exists
  );
  const [stripePromiseLoaded, setStripePromiseLoaded] = useState(false); // Track if Stripe is actually loaded

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phoneNo: ''
  });

  useEffect(() => {
    let mounted = true;
    const initStripe = async () => {
      try {
        const { data } = await getStripeKeyAPI();
        const key = data.stripeApiKey;
        if (key && mounted) {
          setStripePromise(loadStripe(key));
          setStripePromiseLoaded(true); // Set to true when loaded
        }
      } catch (err) {
        console.log('Stripe key not available, using mock payment', err);
        setStripePromiseLoaded(false); // Set to false if not loaded
      }
    };
    initStripe();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Calculate prices
  const itemsPrice = totalPrice;
  const taxPrice = totalPrice * 0.1;
  const shippingPrice = totalPrice > 50 ? 0 : 10; // Free shipping over $50
  const finalTotal = itemsPrice + taxPrice + shippingPrice;

  // Payment processing function
  const processOrder = async (finalTotal, stripe = null, elements = null) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate shipping info
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.country || !shippingInfo.zipCode || !shippingInfo.phoneNo) {
      toast.error('Please fill all shipping details');
      return;
    }

    // Validate phone number (basic check)
    if (shippingInfo.phoneNo.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    dispatch(orderStart());

    try {
      let paymentInfo = { id: `pay_${Date.now()}`, status: 'succeeded' }; // Default to mock success

      if (paymentMethod === 'card') {
        try {
          const { data: pay } = await processPaymentAPI(finalTotal);
          const clientSecret = pay.client_secret;

          if (stripe && elements && stripePromiseLoaded && !pay.mocked) {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error('Card element not found');

            const confirmResult = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: user?.name || 'Guest',
                  address: {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    country: shippingInfo.country,
                    postal_code: shippingInfo.zipCode
                  },
                  phone: shippingInfo.phoneNo
                }
              }
            });

            if (confirmResult.error) throw new Error(confirmResult.error.message);
            if (!confirmResult.paymentIntent || confirmResult.paymentIntent.status !== 'succeeded') {
              throw new Error('Payment not completed');
            }

            paymentInfo = {
              id: confirmResult.paymentIntent.id,
              status: confirmResult.paymentIntent.status
            };
          } else {
            // Mocked flow: if Stripe not fully configured or backend mocked it
            paymentInfo = { id: clientSecret, status: 'succeeded', mocked: true };
          }
        } catch (paymentError) {
          throw new Error(paymentError.message || 'Payment processing failed');
        }
      } else {
        // Cash on Delivery
        paymentInfo = {
          id: `cod_${Date.now()}`,
          status: 'pending',
          method: 'cash_on_delivery'
        };
      }

      const orderData = {
        orderItems: items.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: finalTotal
      };

      const { data } = await createOrderAPI(orderData);

      if (!data.success) {
        throw new Error(data.message || 'Order creation failed');
      }

      dispatch(orderSuccess(data.order));
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate(`/order/success/${data.order._id}`);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Order failed. Please try again.';
      dispatch(orderFailure(message));
      toast.error(message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link to="/shop" className="text-primary hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                shippingInfo={shippingInfo}
                handleChange={handleChange}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                loading={loading}
                finalTotal={finalTotal}
                processOrder={processOrder}
                stripePromiseLoaded={stripePromiseLoaded} // Pass this prop
              />
            </Elements>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-primary font-bold">${item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
                {totalPrice < 50 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
