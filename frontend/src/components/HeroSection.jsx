import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080?text=No+Backdrop';

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-start overflow-hidden">
      {/* Background Image with Gradients */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradients for text readability and blending */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6 text-sm md:text-base font-medium text-gray-300">
            {movie.vote_average && (
              <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
            )}
            <span>{movie.release_date?.split('-')[0]}</span>
          </div>

          <p className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-md">
            {movie.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/movie/${movie.id}`} className="block w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Play Now</span>
              </motion.button>
            </Link>
            <Link to={`/movie/${movie.id}`} className="block w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 glass text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Info className="w-6 h-6" />
                <span>More Info</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
