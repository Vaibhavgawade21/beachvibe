import { Play } from 'lucide-react'
import MusicGrid from '../components/MusicGrid'
import { getTrending } from '../services/api'
import { useAsync } from '../hooks'
import { usePlayer } from '../context/PlayerContext'

export default function Trending() {
  const res = useAsync(() => getTrending(40), [])
  const { playQueue } = usePlayer()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-display font-bold text-3xl">🔥 Trending</h1>
        <button disabled={!res.data?.length} onClick={() => playQueue(res.data)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sun-gradient text-ocean-950 font-semibold disabled:opacity-50">
          <Play size={18} fill="currentColor" /> Play all
        </button>
      </div>
      <MusicGrid tracks={res.data} loading={res.loading} error={res.error} onRetry={res.retry} />
    </div>
  )
}
