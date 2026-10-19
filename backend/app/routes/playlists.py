from fastapi import APIRouter, HTTPException, Query

from app.services import audius_service as audius

router = APIRouter(prefix="/playlists", tags=["playlists"])


@router.get("")
async def playlists(q: str | None = None, limit: int = Query(12, ge=1, le=50)):
    if q:
        return await audius.search_playlists(q, limit)
    return await audius.trending_playlists(limit)


@router.get("/{playlist_id}")
async def playlist(playlist_id: str):
    p = await audius.get_playlist(playlist_id)
    if not p:
        raise HTTPException(404, "Playlist not found")
    return p
