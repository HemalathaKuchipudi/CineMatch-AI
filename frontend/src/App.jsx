import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Recommendations from './pages/Recommendations';
import Watchlist from './pages/Watchlist';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-light/30">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
