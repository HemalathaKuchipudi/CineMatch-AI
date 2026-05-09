from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from routes import movies
import os
from dotenv import load_dotenv
from recommender import engine

load_dotenv()
print(f"TMDB_API_KEY loaded: {bool(os.getenv('TMDB_API_KEY')) and os.getenv('TMDB_API_KEY') != 'YOUR_TMDB_API_KEY_HERE'}")

app = FastAPI(title="CineMatch AI API", description="Backend for Movie Recommendation System")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)

@app.on_event("startup")
async def startup_event():
    # Recommendation engine initialization temporarily disabled
    pass

@app.get("/")
def read_root():
    return {"message": "Welcome to CineMatch AI API"}

@app.get("/ping")
def ping():
    return {"status": "backend working"}
