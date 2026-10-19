import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import TrackList from '../components/TrackList'
import { getPlaylist } from '../services/api'
import { useAsync } from '../hooks'
import { usePlayer } from '../context/PlayerContext'

export default function Playlist() {
  const { id } = useParams()
  const res = useAsync(() => getPlaylist(id), [id])
  const { playQueue } = usePlayer()
  const p = res.data
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center sm:items-end">
        <div className="w-48 h-48 rounded-2xl overflow-hidden bg-ocean-800 shrink-0">{p?.artwork && <img src={p.artwork} alt="" className="w-full h-full object-cover" />}</div>
        <div className="text-center sm:text-left">
          <p className="text-sm uppercase tracking-widest text-sand/60">Playlist</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{p?.name || '…'}</h1>
          <p className="text-sand/70 mt-1">{p?.owner}</p>
          <button disabled={!p?.tracks?.length} onClick={() => playQueue(p.tracks)} className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full sun-gradient text-ocean-950 font-semibold disabled:opacity-50">
            <Play size={18} fill="currentColor" /> Play
          </button>
        </div>
      </div>
      <TrackList tracks={p?.tracks} loading={res.loading} error={res.error} onRetry={res.retry} />
    </div>
  )
}
