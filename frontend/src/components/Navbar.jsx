import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, Search, Waves, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/trending', label: 'Trending' },
  { to: '/favorites', label: 'Favorites', icon: Heart },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cls = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-white/15 text-white' : 'text-sand/80 hover:text-white hover:bg-white/10'}`
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ocean-950/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="w-9 h-9 rounded-xl sun-gradient grid place-items-center"><Waves size={20} className="text-ocean-950" /></span>
          <span>Beach<span className="text-sun">Vibe</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-6" aria-label="Main">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>)}
        </nav>
        <div className="flex-1" />
        <Link to="/search" aria-label="Search" className="p-2.5 rounded-full hover:bg-white/10"><Search size={20} /></Link>
        <button className="md:hidden p-2.5 rounded-full hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-1" onClick={() => setOpen(false)}>
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>)}
        </nav>
      )}
    </header>
  )
}
