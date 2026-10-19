import { Heart, Pause, Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { fmtTime } from '../hooks'

export default function TrackRow({ track, list, index }) {
  const { currentTrack, isPlaying, playTrack, toggle, toggleFavorite, isFavorite } = usePlayer()
  const active = currentTrack?.id === track.id
  const fav = isFavorite(track.id)
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 ${active ? 'bg-white/10' : ''}`}>
      <span className="w-6 text-center text-sm text-sand/50 hidden sm:block">{index + 1}</span>
      <button onClick={() => (active ? toggle() : playTrack(track, list))} aria-label={`Play ${track.title}`}
        className="relative w-12 h-12 rounded-lg overflow-hidden bg-ocean-800 shrink-0 group">
        {track.artwork_small && <img src={track.artwork_small} alt="" loading="lazy" className="w-full h-full object-cover" />}
        <span className="absolute inset-0 bg-black/40 grid place-items-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
          {active && isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${active ? 'text-sun' : ''}`}>{track.title}</p>
        <p className="truncate text-sm text-sand/60">{track.artist}</p>
      </div>
      <span className="text-sm text-sand/50 tabular-nums hidden sm:block">{fmtTime(track.duration)}</span>
      <button onClick={() => toggleFavorite(track)} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={fav} className="p-2 rounded-full hover:bg-white/10">
        <Heart size={18} className={fav ? 'text-coral' : 'text-sand/70'} fill={fav ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
