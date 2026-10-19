import { useNavigate, useParams } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import SearchBar from '../components/SearchBar'
import MusicGrid from '../components/MusicGrid'
import { CATEGORIES } from '../services/categories'
import { searchTracks } from '../services/api'
import { useAsync } from '../hooks'
import { usePlayer } from '../context/PlayerContext'
import { Play } from 'lucide-react'

export default function Discover() {
  const { slug } = useParams()
  const nav = useNavigate()
  const cat = CATEGORIES.find((c) => c.slug === slug)
  const { playQueue } = usePlayer()
  const res = useAsync(() => (cat ? searchTracks(cat.query, 30) : Promise.resolve(null)), [slug])

  if (slug && !cat) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">Unknown vibe. <button className="underline" onClick={() => nav('/discover')}>Back to Discover</button></div>

  if (!cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-6">Discover</h1>
        <SearchBar onSubmit={(q) => nav(`/search?q=${encodeURIComponent(q)}`)} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">{CATEGORIES.map((c) => <CategoryCard key={c.slug} cat={c} />)}</div>
      </div>
    )
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className={`rounded-3xl bg-gradient-to-br ${cat.color} p-8 sm:p-12 mb-8 relative overflow-hidden`}>
        <span className="absolute -right-2 -bottom-4 text-[8rem] opacity-80" aria-hidden="true">{cat.emoji}</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl relative">{cat.label}</h1>
        <button disabled={!res.data?.length} onClick={() => playQueue(res.data)}
          className="relative mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand text-ocean-950 font-semibold disabled:opacity-50">
          <Play size={18} fill="currentColor" /> Play all
        </button>
      </div>
      <MusicGrid tracks={res.data} loading={res.loading} error={res.error} onRetry={res.retry} />
    </div>
  )
}
