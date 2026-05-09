import { motion } from 'framer-motion';
import { useWatchlist } from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-gray-400">Movies you want to watch ({watchlist.length})</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <span className="text-4xl">🍿</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 max-w-sm">
            Add movies to your watchlist to keep track of what you want to watch next.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist;
