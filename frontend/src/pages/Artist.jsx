import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import TrackList from '../components/TrackList'
import { getArtist } from '../services/api'
import { useAsync } from '../hooks'
import { usePlayer } from '../context/PlayerContext'

export default function Artist() {
  const { id } = useParams()
  const res = useAsync(() => getArtist(id), [id])
  const { playQueue } = usePlayer()
  const a = res.data
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden bg-ocean-800 shrink-0">{a?.avatar && <img src={a.avatar} alt="" className="w-full h-full object-cover" />}</div>
        <div className="text-center sm:text-left">
          <p className="text-sm uppercase tracking-widest text-sand/60">Artist</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{a?.name || '…'}</h1>
          {a && <p className="text-sand/70 mt-1">{a.followers.toLocaleString()} followers · {a.track_count} tracks</p>}
          <button disabled={!a?.tracks?.length} onClick={() => playQueue(a.tracks)} className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full sun-gradient text-ocean-950 font-semibold disabled:opacity-50">
            <Play size={18} fill="currentColor" /> Play
          </button>
        </div>
      </div>
      <TrackList tracks={a?.tracks} loading={res.loading} error={res.error} onRetry={res.retry} />
    </div>
  )
}
