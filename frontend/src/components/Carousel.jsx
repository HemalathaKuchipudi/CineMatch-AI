import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const Carousel = ({ title, movies }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 ml-2">{title}</h2>
      
      <div className="relative group">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black border border-white/10 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-4 px-2"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[150px] md:min-w-[200px] snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black border border-white/10 hidden md:block"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
