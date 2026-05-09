import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTrendingMovies = async (page = 1) => {
  const response = await api.get(`/trending?page=${page}`);
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await api.get(`/search?q=${query}&page=${page}`);
  return response.data;
};

export const discoverMovies = async (genres, page = 1) => {
  const response = await api.get(`/discover?with_genres=${genres}&page=${page}`);
  return response.data;
};

export const getMovieDetails = async (movieId) => {
  const response = await api.get(`/movie/${movieId}`);
  return response.data;
};

export const getRecommendations = async (movieId, topN = 10) => {
  const response = await api.get(`/recommend/${movieId}?top_n=${topN}`);
  return response.data;
};

export default api;
