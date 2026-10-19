import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import MusicGrid, { EmptyState } from '../components/MusicGrid'
import { usePlayer } from '../context/PlayerContext'

export default function Favorites() {
  const { favorites, recent, playQueue } = usePlayer()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-display font-bold text-3xl">❤️ Favorites</h1>
        {favorites.length > 0 && (
          <button onClick={() => playQueue(favorites)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sun-gradient text-ocean-950 font-semibold">
            <Play size={18} fill="currentColor" /> Play all
          </button>
        )}
      </div>
      <MusicGrid tracks={favorites} empty={
        <EmptyState emoji="🐚" title="No favorites yet" text="Tap the heart on any song to save it here. Saved in this browser." />
      } />
      {recent.length > 0 && (
        <>
          <h2 className="font-display font-bold text-2xl mt-14 mb-6">Recently played</h2>
          <MusicGrid tracks={recent.slice(0, 10)} />
        </>
      )}
      {!favorites.length && !recent.length && <p className="text-center mt-4"><Link to="/trending" className="text-sun underline">Browse trending</Link></p>}
    </div>
  )
}
