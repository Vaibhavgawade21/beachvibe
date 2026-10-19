import { Heart, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'

export default function MusicCard({ track, list }) {
  const { currentTrack, isPlaying, playTrack, toggle, toggleFavorite, isFavorite } = usePlayer()
  const active = currentTrack?.id === track.id
  const fav = isFavorite(track.id)
  const click = () => (active ? toggle() : playTrack(track, list))
  return (
    <div className="group fade-up">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-ocean-800 shadow-lg">
        {track.artwork
          ? <img src={track.artwork} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          : <div className="w-full h-full grid place-items-center text-5xl">🌴</div>}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent transition ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        <button onClick={click} aria-label={active && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          className={`absolute bottom-3 right-3 w-12 h-12 rounded-full sun-gradient text-ocean-950 grid place-items-center shadow-xl transition hover:scale-110 ${active ? 'opacity-100' : 'sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {active && isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
        </button>
        <button onClick={() => toggleFavorite(track)} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={fav}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur grid place-items-center hover:bg-black/60">
          <Heart size={18} className={fav ? 'text-coral' : 'text-white'} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="mt-3 px-1">
        <p className={`font-semibold truncate ${active ? 'text-sun' : ''}`} title={track.title}>{track.title}</p>
        {track.artist_id
          ? <Link to={`/artist/${track.artist_id}`} className="text-sm text-sand/70 hover:text-sand truncate block">{track.artist}</Link>
          : <p className="text-sm text-sand/70 truncate">{track.artist}</p>}
      </div>
    </div>
  )
}
