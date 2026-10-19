import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'
import { EmptyState } from '../components/MusicGrid'
import { searchTracks } from '../services/api'
import { useAsync } from '../hooks'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const res = useAsync(() => (q ? searchTracks(q) : Promise.resolve([])), [q])
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <SearchBar key={q} initial={q} autoFocus={!q} onSubmit={(v) => setParams({ q: v })} />
      <div className="mt-8">
        {q && <h1 className="font-display font-bold text-xl mb-4">Search results for “{q}”</h1>}
        {q
          ? <TrackList tracks={res.data} loading={res.loading} error={res.error} onRetry={res.retry} empty={<EmptyState emoji="🔎" title={`No tracks found for “${q}”`} text="Try another word or a mood like “chill”." />} />
          : <EmptyState emoji="🏖️" title="Search the shoreline" text="Find songs, artists, and moods." />}
      </div>
    </div>
  )
}
