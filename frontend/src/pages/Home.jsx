import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Carousel from '../components/Carousel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getTrendingMovies, searchMovies } from '../services/api';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (query) {
          const results = await searchMovies(query);
          if (results.error) {
            throw new Error(results.error);
          }
          setSearchResults(results.results || []);
        } else {
          const trending = await getTrendingMovies(1);
          if (trending.error) {
            throw new Error(trending.error);
          }
          setTrendingMovies(trending.results || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load movies. Please check your connection and API keys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [query]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-brand-light mb-4">Oops!</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (query) {
    return (
      <div className="min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8">Search Results for "{query}"</h2>
        {searchResults.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-400 text-lg">No movies found matching your search.</p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-12 min-h-screen"
    >
      <HeroSection movie={trendingMovies[0]} />
      
      <div className="mt-[-100px] md:mt-[-150px] relative z-20">
        <Carousel title="Trending Now" movies={trendingMovies.slice(1)} />
        {/* Mock more rows for aesthetics */}
        <Carousel title="Popular Releases" movies={trendingMovies.slice(5).concat(trendingMovies.slice(0, 5))} />
        <Carousel title="Action & Adventure" movies={trendingMovies.slice(10).concat(trendingMovies.slice(0, 10))} />
      </div>
    </motion.div>
  );
};

export default Home;
