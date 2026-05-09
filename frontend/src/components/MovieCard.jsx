import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Bookmark } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

const MovieCard = ({ movie }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[2/3] bg-gray-900"
      >
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between">
            {movie.vote_average ? (
              <div className="flex items-center text-yellow-400 text-xs md:text-sm">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-current mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            ) : <div/>}
            <button 
              onClick={handleWatchlist}
              className="text-white/80 hover:text-brand-light transition-colors p-1"
            >
              <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${inWatchlist ? 'fill-brand-light text-brand-light' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
