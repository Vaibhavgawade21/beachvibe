import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const PlayerContext = createContext(null)
export const usePlayer = () => useContext(PlayerContext)

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* storage unavailable */ }
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'auto'
  }

  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(() => read('bv:volume', 0.8))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(() => read('bv:favorites', []))
  const [recent, setRecent] = useState(() => read('bv:recent', []))

  const currentTrack = index >= 0 ? queue[index] : null

  // Refs so audio event handlers always see fresh values.
  const stateRef = useRef({})
  stateRef.current = { queue, index, shuffle, repeat }
  const pendingAutoplay = useRef(false)

  const tryPlay = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.play().then(
      () => { pendingAutoplay.current = false },
      (e) => {
        if (e.name === 'NotAllowedError') pendingAutoplay.current = true // wait for first user gesture
        else if (e.name !== 'AbortError') setError('Could not play this track.')
        setIsPlaying(false)
      },
    )
  }, [])

  // Load audio whenever the current track changes.
  useEffect(() => {
    const a = audioRef.current
    if (!a || !currentTrack) return
    setError(null)
    setIsLoading(true)
    setCurrentTime(0)
    a.src = currentTrack.stream_url
    tryPlay()
    setRecent((prev) => {
      const next = [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)].slice(0, 30)
      write('bv:recent', next)
      return next
    })
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: currentTrack.artwork ? [{ src: currentTrack.artwork, sizes: '480x480' }] : [],
      })
    }
  }, [currentTrack?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback((auto = false) => {
    const { queue, index, shuffle, repeat } = stateRef.current
    if (!queue.length) return
    if (auto && repeat) {
      audioRef.current.currentTime = 0
      tryPlay()
      return
    }
    if (shuffle && queue.length > 1) {
      let i
      do { i = Math.floor(Math.random() * queue.length) } while (i === index)
      setIndex(i)
    } else if (index + 1 < queue.length) {
      setIndex(index + 1)
    } else if (auto) {
      setIsPlaying(false) // end of queue
    } else {
      setIndex(0)
    }
  }, [tryPlay])

  const prev = useCallback(() => {
    const a = audioRef.current
    const { queue, index } = stateRef.current
    if (!queue.length) return
    if (a.currentTime > 3 || index <= 0) a.currentTime = 0
    else setIndex(index - 1)
  }, [])

  // Wire audio element events once.
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const on = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      playing: () => { setIsLoading(false); setIsPlaying(true) },
      waiting: () => setIsLoading(true),
      canplay: () => setIsLoading(false),
      timeupdate: () => setCurrentTime(a.currentTime),
      loadedmetadata: () => setDuration(a.duration || 0),
      durationchange: () => setDuration(isFinite(a.duration) ? a.duration : 0),
      ended: () => next(true),
      error: () => {
        setIsLoading(false)
        setIsPlaying(false)
        setError('This track is unavailable. Skipping…')
        setTimeout(() => stateRef.current.queue.length > 1 && next(true), 1200)
      },
    }
    Object.entries(on).forEach(([e, h]) => a.addEventListener(e, h))
    return () => Object.entries(on).forEach(([e, h]) => a.removeEventListener(e, h))
  }, [next])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    write('bv:volume', volume)
  }, [volume])

  // Browsers block autoplay until a gesture: start music on the first interaction.
  useEffect(() => {
    const kick = () => {
      if (pendingAutoplay.current) tryPlay()
    }
    window.addEventListener('pointerdown', kick)
    window.addEventListener('keydown', kick)
    return () => {
      window.removeEventListener('pointerdown', kick)
      window.removeEventListener('keydown', kick)
    }
  }, [tryPlay])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.setActionHandler('play', () => audioRef.current.play())
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current.pause())
    navigator.mediaSession.setActionHandler('previoustrack', prev)
    navigator.mediaSession.setActionHandler('nexttrack', () => next(false))
  }, [next, prev])

  /** Replace the queue and play from `startIndex`. */
  const playQueue = useCallback((tracks, startIndex = 0) => {
    if (!tracks?.length) return
    pendingAutoplay.current = false
    setQueue(tracks)
    setIndex(startIndex)
    // Same track clicked again → restart it.
    const same = stateRef.current.queue[stateRef.current.index]?.id === tracks[startIndex].id
    if (same) tryPlay()
  }, [tryPlay])

  /** Play a track from a list (list becomes the queue). */
  const playTrack = useCallback((track, list = [track]) => {
    const i = Math.max(0, list.findIndex((t) => t.id === track.id))
    playQueue(list, i)
  }, [playQueue])

  /** Preload a queue and try to autoplay (used on first page load). */
  const startAutoplay = useCallback((tracks) => {
    if (stateRef.current.index >= 0 || !tracks?.length) return
    setQueue(tracks)
    setIndex(0)
  }, [])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a || !a.src) return
    if (a.paused) tryPlay()
    else a.pause()
  }, [tryPlay])

  const seek = useCallback((t) => {
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }, [])

  const addToQueue = useCallback((track) => {
    setQueue((q) => (q.some((t) => t.id === track.id) ? q : [...q, track]))
  }, [])

  const playFromQueue = useCallback((i) => setIndex(i), [])

  const toggleFavorite = useCallback((track) => {
    setFavorites((prev) => {
      const next = prev.some((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [track, ...prev]
      write('bv:favorites', next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.some((t) => t.id === id), [favorites])

  const value = useMemo(() => ({
    queue, index, currentTrack, isPlaying, isLoading, currentTime, duration, volume, shuffle, repeat,
    error, favorites, recent,
    playTrack, playQueue, startAutoplay, toggle, next: () => next(false), prev, seek, setVolume: setVolumeState,
    setShuffle, setRepeat, addToQueue, playFromQueue, toggleFavorite, isFavorite,
  }), [queue, index, currentTrack, isPlaying, isLoading, currentTime, duration, volume, shuffle, repeat,
    error, favorites, recent, playTrack, playQueue, startAutoplay, toggle, next, prev, seek, addToQueue,
    playFromQueue, toggleFavorite, isFavorite])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
