from fastapi import APIRouter, HTTPException, Query
import httpx
import os
import logging
import asyncio
from typing import List, Optional
from recommender import engine
from models.movie import MovieRecommendation

router = APIRouter()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

logger = logging.getLogger(__name__)

class MockResponse:
    def __init__(self, error=""):
        self.error = error
    def json(self):
        return {"results": [], "error": self.error}

async def fetch_with_retry(url: str, retries: int = 3):
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        logger.error("EXPLICIT ERROR: TMDB_API_KEY is missing or invalid. Please check backend/.env file.")
        return MockResponse("Missing API Key")

    # Log masked API key (assuming API key is in the URL as api_key=...)
    api_key_masked = TMDB_API_KEY[:5] + "..." if TMDB_API_KEY else "None"
    logger.info(f"TMDB_API_KEY loaded: {api_key_masked}")
    logger.info(f"TMDB request started. Full URL: {url.replace(TMDB_API_KEY, api_key_masked) if TMDB_API_KEY else url}")
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            for attempt in range(retries):
                try:
                    response = await client.get(url)
                    logger.info(f"TMDB response status code: {response.status_code}")
                    response.raise_for_status()
                    
                    # Log response body snippet
                    body = response.text
                    snippet = body[:200] + ("..." if len(body) > 200 else "")
                    logger.info(f"TMDB response success. Snippet: {snippet}")
                    
                    return response
                except httpx.HTTPStatusError as e:
                    logger.error(f"HTTP error on attempt {attempt + 1} for {url}: {e}")
                    if attempt == retries - 1:
                        logger.error("TMDB response failed due to HTTP status error")
                        return MockResponse(f"HTTP Status Error: {e}")
                except httpx.RequestError as e:
                    logger.error(f"Request error (timeout/network) on attempt {attempt + 1} for {url}: {e}")
                    if attempt == retries - 1:
                        logger.error("TMDB response failed due to Request Error (Check internet or proxy)")
                        return MockResponse("Request Error: Network timeout or unavailable")
                await asyncio.sleep(2 ** attempt)
    except Exception as e:
        logger.error(f"TMDB response failed with exception: {e}")
        return MockResponse(f"Internal Error: {e}")
    return MockResponse("Unknown Error")

@router.get("/trending")
async def get_trending_movies(page: int = 1):
    logger.info("Trending endpoint called")
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="TMDB API key not configured")
    
    url = f"{BASE_URL}/trending/movie/week?api_key={TMDB_API_KEY}&page={page}"
    response = await fetch_with_retry(url)
    return response.json()

@router.get("/search")
async def search_movies(q: str = Query(..., min_length=1), page: int = 1):
    logger.info(f"Search endpoint called with query: '{q}'")
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="TMDB API key not configured")

    api_key_masked = TMDB_API_KEY[:5] + "..." if TMDB_API_KEY else "None"
    url = f"{BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={q}&page={page}"
    safe_url = f"{BASE_URL}/search/movie?api_key={api_key_masked}&query={q}&page={page}"
    logger.info(f"TMDB search request URL: {safe_url}")

    response = await fetch_with_retry(url)
    
    status_code = getattr(response, "status_code", "Mock/Error")
    logger.info(f"TMDB search response status: {status_code}")
    
    data = response.json()
    results = data.get("results", [])
    logger.info(f"TMDB search response data length: {len(results)}")
    
    return data

@router.get("/discover")
async def discover_movies(with_genres: str = Query(...), page: int = 1):
    logger.info(f"Discover endpoint called with genres: '{with_genres}'")
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="TMDB API key not configured")

    api_key_masked = TMDB_API_KEY[:5] + "..." if TMDB_API_KEY else "None"
    url = f"{BASE_URL}/discover/movie?api_key={TMDB_API_KEY}&with_genres={with_genres}&page={page}&sort_by=popularity.desc"
    safe_url = f"{BASE_URL}/discover/movie?api_key={api_key_masked}&with_genres={with_genres}&page={page}&sort_by=popularity.desc"
    logger.info(f"TMDB discover request URL: {safe_url}")

    response = await fetch_with_retry(url)
    
    status_code = getattr(response, "status_code", "Mock/Error")
    logger.info(f"TMDB discover response status: {status_code}")
    
    data = response.json()
    results = data.get("results", [])
    logger.info(f"TMDB discover response data length: {len(results)}")
    
    return data

@router.get("/movie/{movie_id}")
async def get_movie_details(movie_id: int):
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        raise HTTPException(status_code=500, detail="TMDB API key not configured")

    url = f"{BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=videos,credits,similar"
    response = await fetch_with_retry(url)
    return response.json()

@router.get("/recommend/{movie_id}")
async def get_recommendations(movie_id: int, top_n: int = 10):
    """Get content-based recommendations from the local TF-IDF engine."""
    if not engine.is_ready:
        # Fallback to TMDB recommendations if engine is not ready or failed
        if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
            raise HTTPException(status_code=500, detail="Engine not ready and API key missing")
        url = f"{BASE_URL}/movie/{movie_id}/recommendations?api_key={TMDB_API_KEY}"
        response = await fetch_with_retry(url)
        return {"source": "tmdb", "results": response.json().get("results", [])[:top_n]}
    
    recs = engine.get_recommendations(movie_id=movie_id, top_n=top_n)
    return {"source": "local_tfidf", "results": recs}
