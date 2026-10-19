import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import { usePlayer } from './context/PlayerContext'
import { getTrending } from './services/api'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Search from './pages/Search'
import Trending from './pages/Trending'
import Favorites from './pages/Favorites'
import Playlist from './pages/Playlist'
import Artist from './pages/Artist'
import Terms from './pages/Terms'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const { startAutoplay, currentTrack } = usePlayer()

  // No login, no gate: load trending and start playing right away
  // (browsers may hold playback until the first click/tap).
  useEffect(() => {
    getTrending(30).then(startAutoplay).catch(() => {})
  }, [startAutoplay])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className={`flex-1 ${currentTrack ? 'pb-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/:slug" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<div className="text-center py-24"><p className="text-5xl">🏝️</p><p className="mt-3">Lost at sea. <Link to="/" className="text-sun underline">Back to shore</Link></p></div>} />
        </Routes>
        <Footer />
      </main>
      <MusicPlayer />
    </div>
  )
}
