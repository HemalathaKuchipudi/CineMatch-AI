import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Clock, Bookmark } from 'lucide-react';
import { getMovieDetails, getRecommendations } from '../services/api';
import Carousel from '../components/Carousel';
import { useWatchlist } from '../hooks/useWatchlist';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
        
        // Fetch recommendations from our backend TF-IDF engine
        const recs = await getRecommendations(id);
        setRecommendations(recs.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 animate-pulse bg-brand-dark" />;
  if (!movie) return <div className="min-h-screen pt-24 text-center text-white">Movie not found</div>;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const inWatchlist = isInWatchlist(movie.id);

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-12"
    >
      {/* Banner */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <img 
          src={backdropUrl || posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-20vh] md:mt-[-30vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-72 flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1 mt-4 md:mt-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="font-bold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{movie.release_date?.split('-')[0]}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/5">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex gap-4">
              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-brand-light text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-light/80 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Trailer
                </a>
              )}
              <button 
                onClick={toggleWatchlist}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${inWatchlist ? 'bg-white/20 text-white' : 'glass text-white hover:bg-white/10'}`}
              >
                <Bookmark className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Movies / Recommendations */}
        <div className="mt-16">
          <Carousel title="Because you selected this..." movies={recommendations} />
        </div>
        
        {/* Fallback to TMDB similar if engine is weak */}
        {movie.similar?.results?.length > 0 && (
          <div className="mt-8">
            <Carousel title="Similar Movies" movies={movie.similar.results} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieDetails;
