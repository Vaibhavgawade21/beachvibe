from fastapi import APIRouter, HTTPException, Query

from app.services import audius_service as audius

router = APIRouter(prefix="/tracks", tags=["tracks"])


@router.get("/trending")
async def trending(limit: int = Query(20, ge=1, le=50), genre: str | None = None):
    return await audius.trending_tracks(limit, genre)


@router.get("/{track_id}")
async def track(track_id: str):
    t = await audius.get_track(track_id)
    if not t:
        raise HTTPException(404, "Track not found")
    return t
