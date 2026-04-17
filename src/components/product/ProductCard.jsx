import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <Link to={`/product/${product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full">

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" />
        )}
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => { setImageError(true); setImageLoaded(true); }}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={11}
                className={i < Math.floor(product.ratings || 0) ? 'text-amber-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">({product.numOfReviews || 0})</span>
        </div>

        {/* Price & Stock */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-medium block">${product.price.toFixed(2)}</span>
            )}
            <span className="text-xl font-black text-gray-900 leading-none">${price.toFixed(2)}</span>
          </div>
          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-1 rounded-lg">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;