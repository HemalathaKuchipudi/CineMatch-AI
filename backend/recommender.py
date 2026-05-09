import httpx
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import logging
import asyncio
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class MovieRecommender:
    def __init__(self):
        self.movies_df = None
        self.cosine_sim = None
        self.tmdb_api_key = os.getenv("TMDB_API_KEY")
        self.base_url = "https://api.themoviedb.org/3"
        self.is_ready = False

    async def fetch_popular_movies(self, num_pages=1):
        """Fetch popular movies from TMDB to build the dataset."""
        if not self.tmdb_api_key or self.tmdb_api_key == "YOUR_TMDB_API_KEY_HERE":
            logger.warning("WARNING: TMDB_API_KEY is not set. Recommender dataset will be empty.")
            self.is_ready = False
            return []

        movies = []
        logger.info("TMDB request started")
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                for page in range(1, num_pages + 1):
                    url = f"{self.base_url}/movie/popular?api_key={self.tmdb_api_key}&language=en-US&page={page}"
                    retries = 3
                    for attempt in range(retries):
                        try:
                            response = await client.get(url)
                            response.raise_for_status()
                            data = response.json()
                            results = data.get("results", [])
                            for movie in results:
                                movies.append({
                                    "id": movie.get("id"),
                                    "title": movie.get("title"),
                                    "overview": movie.get("overview", ""),
                                    "genre_ids": movie.get("genre_ids", []),
                                    "poster_path": movie.get("poster_path")
                                })
                            logger.info("TMDB request success")
                            break # Break retry loop if successful
                        except httpx.RequestError as e:
                            logger.error(f"Error fetching page {page} on attempt {attempt + 1}: {e}")
                            if attempt == retries - 1:
                                logger.error(f"TMDB request failed: Failed to fetch page {page} after {retries} attempts.")
                            await asyncio.sleep(2 ** attempt)
        except Exception as e:
            logger.error(f"TMDB request failed: {e}")
            return []
        return movies

    async def initialize_dataset(self):
        """Temporarily disabled."""
        self.is_ready = False
        return
        
        # We need to map genre ids to words, but to keep it simple and robust,
        # we can just use the overview for content-based filtering,
        # or treat genre_ids as string features.
        self.movies_df["genre_str"] = self.movies_df["genre_ids"].apply(lambda x: " ".join([str(i) for i in x]))
        
        # Combine overview and genres
        self.movies_df["combined_features"] = self.movies_df["overview"] + " " + self.movies_df["genre_str"]
        
        # Fill missing values
        self.movies_df["combined_features"] = self.movies_df["combined_features"].fillna("")

        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf.fit_transform(self.movies_df["combined_features"])

        # Compute cosine similarity
        self.cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        self.is_ready = True
        logger.info(f"Successfully initialized dataset with {len(self.movies_df)} movies.")

    def get_recommendations(self, movie_title=None, movie_id=None, top_n=10):
        if not self.is_ready or self.movies_df is None:
            return []

        idx = None
        if movie_id:
            try:
                idx = self.movies_df.index[self.movies_df['id'] == movie_id][0]
            except IndexError:
                pass
        elif movie_title:
            try:
                idx = self.movies_df.index[self.movies_df['title'].str.lower() == movie_title.lower()][0]
            except IndexError:
                pass

        if idx is None:
            return [] # Movie not found in our local dataset

        # Get similarity scores for all movies
        sim_scores = list(enumerate(self.cosine_sim[idx]))

        # Sort the movies based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get scores of the top n most similar movies
        # Ignore the first one since it is the movie itself
        sim_scores = sim_scores[1:top_n+1]

        # Get the movie indices
        movie_indices = [i[0] for i in sim_scores]

        # Return the top n most similar movies
        return self.movies_df.iloc[movie_indices].to_dict('records')

engine = MovieRecommender()
