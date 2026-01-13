import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/product/${product._id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group">
      <div className="relative overflow-hidden h-64 bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        )}
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        {product.discountPrice > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center text-yellow-400">
            <FaStar />
            <span className="text-gray-600 text-sm ml-1">{(product.ratings || 0).toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-sm">({product.numOfReviews || 0} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            ${product.discountPrice > 0 ? product.discountPrice : product.price}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-gray-500 line-through text-sm">${product.price}</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-semibold">✓ In Stock</span>
          ) : (
            <span className="text-red-600 text-sm font-semibold">✗ Out of Stock</span>
          )}
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
