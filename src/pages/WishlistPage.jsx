import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info('Removed from wishlist');
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, stock: item.stock || 10, quantity: 1 }));
    toast.success(`${item.name} added to cart!`);
  };

  if (wishlistItems.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <FaHeart className="text-red-300 text-2xl" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Wishlist is empty</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">Save items you love and come back to them later.</p>
        <Link to="/shop"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[.98] text-sm text-center shadow-lg shadow-blue-500/20">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group">
              <Link to={`/product/${item.id}`}>
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 hover:text-blue-600 transition-colors truncate">{item.name}</h3>
                </Link>
                <p className="text-blue-600 font-black text-lg mb-3">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-[.98] shadow-lg shadow-blue-500/20">
                    <FaShoppingCart size={11} /> Add to Cart
                  </button>
                  <button onClick={() => handleRemove(item.id)}
                    className="p-2.5 bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;