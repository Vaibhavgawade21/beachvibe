"""All communication with Audius lives here. The rest of the app only sees
normalized dicts, so the music provider can be swapped without touching React."""
import time

import httpx

from app.config import APP_NAME, AUDIUS_API_KEY, AUDIUS_API_URL

_client: httpx.AsyncClient | None = None
_cache: dict[str, tuple[float, object]] = {}
CACHE_TTL = 300  # seconds


def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        headers = {"Authorization": f"Bearer {AUDIUS_API_KEY}"} if AUDIUS_API_KEY else {}
        _client = httpx.AsyncClient(
            base_url=AUDIUS_API_URL, timeout=15, headers=headers, follow_redirects=False
        )
    return _client


async def _get(path: str, **params):
    params = {k: v for k, v in params.items() if v is not None}
    params["app_name"] = APP_NAME
    key = path + "?" + "&".join(f"{k}={params[k]}" for k in sorted(params))
    hit = _cache.get(key)
    if hit and hit[0] > time.time():
        return hit[1]
    resp = await _get_client().get(path, params=params)
    resp.raise_for_status()
    data = resp.json().get("data")
    _cache[key] = (time.time() + CACHE_TTL, data)
    if len(_cache) > 500:
        for k in [k for k, v in _cache.items() if v[0] < time.time()]:
            _cache.pop(k, None)
    return data


def stream_url(track_id: str) -> str:
    # Audius redirects this to a content node; the browser streams straight from Audius.
    return f"{AUDIUS_API_URL}/v1/tracks/{track_id}/stream?app_name={APP_NAME}"


def normalize_track(t: dict) -> dict:
    art = t.get("artwork") or {}
    user = t.get("user") or {}
    return {
        "id": t["id"],
        "title": t.get("title", "Untitled"),
        "artist": user.get("name") or user.get("handle") or "Unknown artist",
        "artist_id": user.get("id"),
        "artist_handle": user.get("handle"),
        "artwork": art.get("480x480") or art.get("150x150") or art.get("1000x1000"),
        "artwork_small": art.get("150x150") or art.get("480x480"),
        "duration": t.get("duration", 0),
        "genre": t.get("genre"),
        "play_count": t.get("play_count", 0),
        "stream_url": stream_url(t["id"]),
        "permalink": f"https://audius.co{t['permalink']}" if t.get("permalink") else None,
    }


def _playable(tracks: list[dict]) -> list[dict]:
    return [
        normalize_track(t)
        for t in tracks or []
        if t.get("id") and not t.get("is_delete") and not t.get("is_stream_gated")
        and t.get("is_streamable", True)
    ]


def normalize_playlist(p: dict) -> dict:
    art = p.get("artwork") or {}
    user = p.get("user") or {}
    return {
        "id": p["id"],
        "name": p.get("playlist_name", "Untitled"),
        "description": p.get("description"),
        "artwork": art.get("480x480") or art.get("150x150"),
        "owner": user.get("name") or user.get("handle"),
        "track_count": p.get("track_count", 0),
    }


async def trending_tracks(limit: int = 20, genre: str | None = None):
    return _playable(await _get("/v1/tracks/trending", limit=limit, genre=genre))


async def search_tracks(query: str, limit: int = 20):
    return _playable(await _get("/v1/tracks/search", query=query, limit=limit))


async def get_track(track_id: str):
    data = await _get(f"/v1/tracks/{track_id}")
    return normalize_track(data) if data else None


async def trending_playlists(limit: int = 12):
    data = await _get("/v1/playlists/trending", limit=limit)
    return [normalize_playlist(p) for p in data or [] if not p.get("is_private")]


async def search_playlists(query: str, limit: int = 12):
    data = await _get("/v1/playlists/search", query=query, limit=limit)
    return [normalize_playlist(p) for p in data or [] if not p.get("is_private")]


async def get_playlist(playlist_id: str):
    data = await _get(f"/v1/playlists/{playlist_id}")
    if not data:
        return None
    p = data[0] if isinstance(data, list) else data
    out = normalize_playlist(p)
    tracks = await _get(f"/v1/playlists/{playlist_id}/tracks")
    out["tracks"] = _playable(tracks)
    return out


async def popular_artists(limit: int = 12):
    # Audius has no "trending artists" endpoint; derive from trending tracks.
    tracks = await _get("/v1/tracks/trending", limit=50)
    seen, artists = set(), []
    for t in tracks or []:
        u = t.get("user") or {}
        if u.get("id") and u["id"] not in seen:
            seen.add(u["id"])
            artists.append(normalize_artist(u))
        if len(artists) >= limit:
            break
    return artists


def normalize_artist(u: dict) -> dict:
    pic = u.get("profile_picture") or {}
    return {
        "id": u["id"],
        "name": u.get("name") or u.get("handle"),
        "handle": u.get("handle"),
        "avatar": pic.get("480x480") or pic.get("150x150"),
        "followers": u.get("follower_count", 0),
        "track_count": u.get("track_count", 0),
        "bio": u.get("bio"),
    }


async def get_artist(artist_id: str):
    data = await _get(f"/v1/users/{artist_id}")
    return normalize_artist(data) if data else None


async def artist_tracks(artist_id: str, limit: int = 30):
    return _playable(await _get(f"/v1/users/{artist_id}/tracks", limit=limit))
