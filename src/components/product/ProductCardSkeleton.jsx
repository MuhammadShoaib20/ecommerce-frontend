const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
    {/* Image */}
    <div className="aspect-[4/5] bg-gray-100 relative">
      <div className="absolute top-3 left-3 w-12 h-5 bg-gray-200 rounded-full" />
    </div>
    {/* Content */}
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2" />
      <div className="h-4 bg-gray-200 rounded-lg w-full mb-1" />
      <div className="h-4 bg-gray-100 rounded-lg w-3/4 mb-3" />
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded w-10" />
          <div className="h-6 bg-gray-200 rounded-lg w-16" />
        </div>
        <div className="h-6 bg-gray-100 rounded-lg w-16" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;