import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { discoverMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const MOODS = [
  { id: 'happy', label: 'Happy', fallbacks: ['35,10751', '35', '10751'], color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30' },
  { id: 'sad', label: 'Sad', fallbacks: ['18,10749,10402', '18', '10749', '10402'], color: 'bg-blue-500/20 text-blue-500 border-blue-500/30 hover:bg-blue-500/30' },
  { id: 'action', label: 'Action', fallbacks: ['28,12', '28', '12'], color: 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30' },
  { id: 'thriller', label: 'Thriller', fallbacks: ['53,80', '53', '80'], color: 'bg-purple-500/20 text-purple-500 border-purple-500/30 hover:bg-purple-500/30' },
  { id: 'chill', label: 'Chill', fallbacks: ['16,14,10751', '16', '14', '10751'], color: 'bg-teal-500/20 text-teal-500 border-teal-500/30 hover:bg-teal-500/30' },
];

const Recommendations = () => {
  const [activeMood, setActiveMood] = useState(MOODS[0]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoodMovies = async () => {
      setLoading(true);
      setMovies([]);
      console.log(`Selected mood: ${activeMood.label}`);
      
      let finalMovies = [];
      
      try {
        for (const genreSet of activeMood.fallbacks) {
          console.log(`Trying genre IDs: ${genreSet}`);
          const results = await discoverMovies(genreSet);
          
          if (results.error) {
            throw new Error(results.error);
          }
          
          let fetchedMovies = results.results || [];
          fetchedMovies = fetchedMovies.filter(m => m.poster_path); // Filter out missing posters
          
          if (fetchedMovies.length >= 10) {
            finalMovies = fetchedMovies;
            console.log(`Fetched movie count (with poster): ${finalMovies.length}. Success!`);
            break;
          } else if (fetchedMovies.length > finalMovies.length) {
            finalMovies = fetchedMovies; // Keep best so far
          }
        }
        
        setMovies(finalMovies);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoodMovies();
  }, [activeMood]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">What's your mood today?</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Select a mood below and our AI will recommend the perfect movies for your current vibe.</p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood)}
              className={`px-6 py-3 rounded-full border backdrop-blur-sm transition-all font-medium ${
                activeMood.id === mood.id 
                  ? `${mood.color.split(' ')[0].replace('/20', '/40')} ${mood.color.split(' ')[1]} border-${mood.color.split(' ')[1].split('-')[1]}-500 shadow-lg shadow-${mood.color.split(' ')[1].split('-')[1]}-500/20 scale-105` 
                  : mood.color
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : movies.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {movies.map((movie) => (
            <motion.div 
              key={movie.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-400 text-lg text-center mt-8">No movies found matching your current mood.</p>
      )}
    </motion.div>
  );
};

export default Recommendations;
