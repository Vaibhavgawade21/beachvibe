import axios from 'axios'

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`,
  timeout: 45000, // free Render backends can take ~1 min to wake up
})

const get = (url, params) => http.get(url, { params }).then((r) => r.data)

export const getTrending = (limit = 20, genre) => get('/tracks/trending', { limit, genre })
export const getTrack = (id) => get(`/tracks/${id}`)
export const searchTracks = (q, limit = 30) => get('/search', { q, limit }).then((d) => d.tracks)
export const getPlaylists = (q, limit = 12) => get('/playlists', { q, limit })
export const getPlaylist = (id) => get(`/playlists/${id}`)
export const getArtists = () => get('/artists')
export const getArtist = (id) => get(`/artists/${id}`)
