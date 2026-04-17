import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaStar, FaStarHalf, FaArrowLeft, FaTruck, FaShieldAlt, FaUndo, FaMinus, FaPlus } from 'react-icons/fa';
import { getProductDetailsAPI, createReviewAPI } from '../services/api';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i.id === id);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProductDetailsAPI(id);
      setProduct(data.product);
    } catch {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return toast.error('Out of stock');
    dispatch(addToCart({ id: product._id, name: product.name, price: product.discountPrice || product.price, image: product.images?.[0]?.url, stock: product.stock, quantity }));
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist({ id: product._id, name: product.name, price: product.discountPrice || product.price, image: product.images?.[0]?.url }));
      toast.success('Added to wishlist!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await createReviewAPI({ productId: id, rating: reviewData.rating, comment: reviewData.comment });
      toast.success('Review submitted!');
      setReviewData({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-lg font-bold text-gray-700 mb-4">Product not found</p>
          <button onClick={() => navigate('/shop')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Back to Shop</button>
        </div>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'} size={13} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Product Main */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Images */}
            <div className="p-6 md:p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 mb-4">
                <img src={product.images?.[activeImage]?.url} alt={product.name}
                  className="w-full h-full object-contain p-4" />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-blue-500' : 'border-gray-100 hover:border-gray-300'
                      }`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100 mb-3">Out of Stock</span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 mb-3">In Stock · {product.stock} left</span>
              )}

              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(product.ratings)}</div>
                <span className="text-sm text-gray-500 font-medium">({product.numOfReviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-black text-gray-900">${price.toFixed(2)}</span>
                {hasDiscount && <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>}
                {hasDiscount && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors">
                    <FaMinus size={11} />
                  </button>
                  <span className="px-4 py-3 font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors">
                    <FaPlus size={11} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FaShoppingCart size={14} /> Add to Cart
                </button>
                <button onClick={handleWishlist}
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-200 hover:text-rose-400'
                  }`}>
                  <FaHeart size={16} />
                </button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FaTruck size={12} />, text: 'Free Shipping $50+' },
                  { icon: <FaShieldAlt size={12} />, text: 'Secure Checkout' },
                  { icon: <FaUndo size={12} />, text: '30-Day Returns' },
                ].map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <span className="text-blue-500">{p.icon}</span>
                    <span className="text-[10px] font-semibold text-gray-500 leading-tight">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-black text-gray-900 mb-5 text-lg">Customer Reviews</h2>
            {product.reviews?.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <p className="text-sm font-medium">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews?.map((review, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-gray-900">{review.name}</span>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="font-black text-gray-900 mb-5 text-lg">Write a Review</h2>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
                  <select value={reviewData.rating} onChange={(e) => setReviewData({ ...reviewData, rating: +e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Review</label>
                  <textarea value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    rows={4} required placeholder="Share your experience..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <button type="submit" disabled={submittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;