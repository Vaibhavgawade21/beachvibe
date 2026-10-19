import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import CORS_ORIGINS
from app.routes import artists, playlists, search, tracks

app = FastAPI(title="BeachVibe API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

for r in (tracks.router, search.router, playlists.router, artists.router):
    app.include_router(r, prefix="/api")


@app.exception_handler(httpx.HTTPError)
async def upstream_error(_: Request, exc: httpx.HTTPError):
    status = getattr(getattr(exc, "response", None), "status_code", None)
    code = 404 if status == 404 else 502
    return JSONResponse({"detail": "Music provider unavailable"}, status_code=code)


@app.get("/")
@app.get("/health")
async def health():
    return {"status": "ok", "app": "BeachVibe"}
