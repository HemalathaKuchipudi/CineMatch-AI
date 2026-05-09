const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[70vh] md:h-[85vh] bg-gray-800" />
      
      {/* Row Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="h-8 bg-gray-800 rounded w-48 mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="min-w-[150px] md:min-w-[200px] aspect-[2/3] bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
