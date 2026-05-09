# CineMatch AI 🎬

A modern AI-powered Movie Recommendation System web application built with React, FastAPI, and TMDB API. It features a Netflix-inspired dark UI with smooth animations and content-based recommendation logic.

## Features ✨

- **Modern UI/UX**: Netflix-inspired dark theme, glassmorphism, gradient backgrounds.
- **Smooth Animations**: Powered by Framer Motion.
- **Content-Based Recommendations**: Backend Python TF-IDF Vectorizer and Cosine Similarity to find similar movies based on plot and genres.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Watchlist**: Save your favorite movies locally.
- **Search & Moods**: Search for any movie or find recommendations based on your current mood.

## Setup Instructions 🚀

### Prerequisites

1. Node.js (v18+)
2. Python (v3.10+)
3. TMDB API Key (Get one free at [https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api))

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (it should already be created, but if not, create one):
   ```bash
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your Environment Variables:
   Open `backend/.env` and add your TMDB API Key:
   ```env
   TMDB_API_KEY=your_actual_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```
5. Run the backend server:
   ```bash
   uvicorn app:app --reload
   ```
   *Note: On startup, the backend will fetch ~1000 popular movies from TMDB to build the recommendation dataset. This might take a few seconds.*

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Enjoy! 🎉

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technologies Used 💻

- **Frontend**: React, Vite, Tailwind CSS v3, Framer Motion, Axios, React Router, Lucide React
- **Backend**: Python, FastAPI, Scikit-learn, Pandas, HTTPX
- **API**: TMDB
