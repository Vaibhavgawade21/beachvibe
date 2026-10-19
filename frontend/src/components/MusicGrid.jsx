import MusicCard from './MusicCard'

export function GridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="aspect-square rounded-2xl skeleton" />
          <div className="h-4 mt-3 w-3/4 rounded skeleton" />
          <div className="h-3 mt-2 w-1/2 rounded skeleton" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-5xl mb-3">🌧️</p>
      <p className="font-semibold">The tide went out.</p>
      <p className="text-sand/70 text-sm mt-1 mb-4">
        {error?.code === 'ECONNABORTED' ? 'The server is waking up — this can take a minute.' : "We couldn't load music right now."}
      </p>
      {onRetry && <button onClick={onRetry} className="px-5 py-2 rounded-full bg-sand text-ocean-950 font-semibold">Try again</button>}
    </div>
  )
}

export function EmptyState({ emoji = '🐚', title, text }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-5xl mb-3">{emoji}</p>
      <p className="font-semibold">{title}</p>
      {text && <p className="text-sand/70 text-sm mt-1">{text}</p>}
    </div>
  )
}

export default function MusicGrid({ tracks, loading, error, onRetry, empty }) {
  if (loading) return <GridSkeleton />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (!tracks?.length) return empty || <EmptyState title="Nothing here yet" />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {tracks.map((t) => <MusicCard key={t.id} track={t} list={tracks} />)}
    </div>
  )
}
