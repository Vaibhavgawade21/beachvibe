from fastapi import APIRouter, Query

from app.services import audius_service as audius

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def search(q: str = Query(..., min_length=1, max_length=100), limit: int = Query(20, ge=1, le=50)):
    return {"query": q, "tracks": await audius.search_tracks(q, limit)}
