# 🌴 BeachVibe

Free beach-vibe music streaming. No login — open the site and music starts.
React + Vite + Tailwind frontend → FastAPI backend → Audius API.

## Run locally
```bash
# backend  (http://localhost:8000, docs at /docs)
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# frontend (http://localhost:5173)
cd frontend && npm install && cp .env.example .env && npm run dev
```

## API
`GET /api/tracks/trending` · `/api/tracks/{id}` · `/api/search?q=` · `/api/playlists` · `/api/playlists/{id}` · `/api/artists` · `/api/artists/{id}`

## Deploy (Render, free)
`render.yaml` defines both services. Set `CORS_ORIGINS` (backend) to the frontend URL and `VITE_API_URL` (frontend) to the backend URL.
Free backends sleep after 15 min idle; the first request may take ~1 min.

## Notes
Audio is streamed from Audius, never downloaded or stored. Favorites/recents live in browser localStorage.
