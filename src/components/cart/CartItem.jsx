import { useDispatch } from 'react-redux';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateCartQuantity } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast.info('Item removed');
  };

  const handleQty = (newQty) => {
    if (newQty < 1) return;
    if (newQty > item.stock) { toast.error(`Only ${item.stock} in stock`); return; }
    dispatch(updateCartQuantity({ id: item.id, quantity: newQty }));
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">

      {/* Image */}
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">${item.price.toFixed(2)} / ea</p>
      </div>

      {/* Qty */}
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
        <button onClick={() => handleQty(item.quantity - 1)}
          className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors">
          <FaMinus size={10} />
        </button>
        <span className="px-2 py-2 text-sm font-bold text-gray-900 min-w-[2rem] text-center tabular-nums">
          {item.quantity}
        </span>
        <button onClick={() => handleQty(item.quantity + 1)}
          className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
          <FaPlus size={10} />
        </button>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0 min-w-[4rem]">
        <p className="font-black text-gray-900 text-base">${item.totalPrice.toFixed(2)}</p>
      </div>

      {/* Remove */}
      <button onClick={handleRemove}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
        <FaTrash size={13} />
      </button>
    </div>
  );
};

export default CartItem;