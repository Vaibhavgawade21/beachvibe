import TrackRow from './TrackRow'
import { EmptyState, ErrorState } from './MusicGrid'

export default function TrackList({ tracks, loading, error, onRetry, empty }) {
  if (loading) return <div className="space-y-2">{Array.from({ length: 8 }, (_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}</div>
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (!tracks?.length) return empty || <EmptyState title="Nothing found" />
  return <div>{tracks.map((t, i) => <TrackRow key={t.id} track={t} list={tracks} index={i} />)}</div>
}
