from fastapi import APIRouter, HTTPException

from app.services import audius_service as audius

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("")
async def popular():
    return await audius.popular_artists()


@router.get("/{artist_id}")
async def artist(artist_id: str):
    a = await audius.get_artist(artist_id)
    if not a:
        raise HTTPException(404, "Artist not found")
    a["tracks"] = await audius.artist_tracks(artist_id)
    return a
