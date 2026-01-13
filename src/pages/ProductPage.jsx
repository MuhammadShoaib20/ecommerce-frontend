import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { productStart, productSuccess, productFailure } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { getProductDetailsAPI, createReviewAPI } from '../services/api';

const ProductPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.product);

  useEffect(() => { fetchProductDetails(); }, [id]);

  const fetchProductDetails = async () => {
    dispatch(productStart());
    try {
      const { data } = await getProductDetailsAPI(id);
      dispatch(productSuccess(data.product));
    } catch (error) {
      dispatch(productFailure(error.response?.data?.message || 'Failed to fetch product'));
      toast.error('Failed to fetch product details');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0]?.url,
      stock: product.stock,
      quantity: quantity
    };

    dispatch(addToCart(cartItem));
    toast.success(`${product.name} added to cart!`);
  };

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to submit a review');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    try {
      await createReviewAPI({ rating, comment, productId: product._id });
      toast.success('Review submitted');
      setRating(5); setComment('');
      await fetchProductDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div></div>);
  if (!product) return (<div className="min-h-screen flex items-center justify-center"><p className="text-xl text-gray-600">Product not found</p></div>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <img src={product.images[selectedImage]?.url} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
              </div>
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-20 h-20 rounded overflow-hidden border ${selectedImage===idx? 'border-primary':''}`}>
                    <img src={img.url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-yellow-400"><FaStar /><span className="ml-2">{(product.ratings||0).toFixed(1)}</span></div>
                <span className="text-gray-500">({product.numOfReviews || 0} reviews)</span>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">${product.discountPrice > 0 ? product.discountPrice : product.price}</span>
                {product.discountPrice > 0 && <span className="ml-3 text-gray-500 line-through">${product.price}</span>}
              </div>

              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                </div>
                <button onClick={handleAddToCart} className="bg-primary text-white px-6 py-2 rounded flex items-center gap-2"><FaShoppingCart /> Add to Cart</button>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Stock</h4>
                <p>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Write a Review</h3>
              {isAuthenticated ? (
                <form onSubmit={submitReview} className="space-y-2">
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="px-3 py-2 border rounded">
                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Star{v>1?'s':''}</option>)}
                  </select>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment" className="w-full px-3 py-2 border rounded" />
                  {submitError && <p className="text-red-500">{submitError}</p>}
                  <button disabled={submitLoading} type="submit" className="bg-primary text-white px-4 py-2 rounded disabled:opacity-60">
                    {submitLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>Please <Link to="/login" className="text-primary">login</Link> to write a review.</p>
                </div>
              )}
            </div>

            {product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? '' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="font-semibold">{review.name}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
