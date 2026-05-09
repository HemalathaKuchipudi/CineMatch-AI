<img width="1273" height="660" alt="Screenshot 2026-05-09 at 6 31 56 PM" src="https://github.com/user-attachments/assets/2d13ebe3-6cb1-4bd3-884b-5d397e199de2" /><img width="1273" height="660" alt="Screenshot 2026-05-09 at 6 31 56 PM" src="https://github.com/user-attachments/assets/5b627e8c-d6c0-4f6a-9f32-06c026852e81" /># CineMatch AI 🎬

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

- # CineMatch AI 🎬

A modern movie recommendation web application built using React, FastAPI, Tailwind CSS, and TMDB API.

## Home Page
<img width="1280" height="681" alt="Screenshot 2026-05-09 at 6 23 40 PM" src="https://github.com/user-attachments/assets/6a0d38a2-9301-48d1-87bc-db5407cc66fc" />


## Search Feature
<img width="1273" height="660" alt="Screenshot 2026-05-09 at 6 31 56 PM" src="https://github.com/user-attachments/assets/c94df363-9e6f-4b2e-9f7e-bb09c8d3cf77" />



## Recommendations Page


<img width="1280" height="676" alt="Screenshot 2026-05-09 at 6 19 21 PM" src="https://github.com/user-attachments/assets/630e1748-48e5-4bfd-8d27-94b85b11171b" />


##watchlist
<img width="1269" height="670" alt="Screenshot 2026-05-09 at 6 19 51 PM" src="https://github.com/user-attachments/assets/3cac8cfb-9101-473d-9757-0157eb3165f5" />

