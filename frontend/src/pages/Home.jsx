import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import MusicGrid from '../components/MusicGrid'
import CategoryCard from '../components/CategoryCard'
import { CATEGORIES } from '../services/categories'
import { getArtists, getPlaylists, getTrending } from '../services/api'
import { useAsync } from '../hooks'
import { usePlayer } from '../context/PlayerContext'

export const Section = ({ title, to, children, id }) => (
  <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
    <div className="flex items-end justify-between mb-5">
      <h2 className="font-display font-bold text-2xl">{title}</h2>
      {to && <Link to={to} className="text-sm text-sun hover:underline">See all</Link>}
    </div>
    {children}
  </section>
)

export default function Home() {
  const { playQueue, isPlaying } = usePlayer()
  const trending = useAsync(() => getTrending(10), [])
  const artists = useAsync(getArtists, [])
  const playlists = useAsync(() => getPlaylists(), [])
  return (
    <>
      <Hero playing={isPlaying} onPlay={() => trending.data && playQueue(trending.data)} />
      <Section title="🔥 Trending Beach Vibes" to="/trending" id="trending">
        <MusicGrid tracks={trending.data} loading={trending.loading} error={trending.error} onRetry={trending.retry} />
      </Section>
      <Section title="Pick your vibe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{CATEGORIES.map((c) => <CategoryCard key={c.slug} cat={c} />)}</div>
      </Section>
      <Section title="Popular Playlists">
        <div className="flex gap-4 overflow-x-auto scroll-hide pb-2 -mx-4 px-4">
          {playlists.loading && Array.from({ length: 6 }, (_, i) => <div key={i} className="w-40 h-52 shrink-0 rounded-2xl skeleton" />)}
          {playlists.data?.map((p) => (
            <Link key={p.id} to={`/playlist/${p.id}`} className="w-40 sm:w-44 shrink-0 group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-ocean-800">
                {p.artwork && <img src={p.artwork} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
              </div>
              <p className="mt-2 font-semibold truncate">{p.name}</p>
              <p className="text-sm text-sand/60 truncate">{p.owner} · {p.track_count} tracks</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section title="Popular Artists">
        <div className="flex gap-6 overflow-x-auto scroll-hide pb-2 -mx-4 px-4">
          {artists.loading && Array.from({ length: 8 }, (_, i) => <div key={i} className="w-28 h-28 shrink-0 rounded-full skeleton" />)}
          {artists.data?.map((a) => (
            <Link key={a.id} to={`/artist/${a.id}`} className="w-28 shrink-0 text-center group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-ocean-800 ring-2 ring-transparent group-hover:ring-sun transition">
                {a.avatar && <img src={a.avatar} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <p className="mt-2 text-sm font-medium truncate">{a.name}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
