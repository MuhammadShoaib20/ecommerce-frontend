import { useDispatch } from 'react-redux';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateCartQuantity } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast.info('Item removed from cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    dispatch(updateCartQuantity({ id: item.id, quantity: newQuantity }));
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-primary font-bold text-lg">${item.price}</p>
        <p className="text-sm text-gray-500">Stock: {item.stock}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <FaMinus />
        </button>
        <span className="w-12 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <FaPlus />
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg text-gray-800">
          ${item.totalPrice.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="mt-2 text-red-500 hover:text-red-700 transition"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
