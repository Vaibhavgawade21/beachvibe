import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

const Wave = ({ className, fill }) => (
  <svg className={`absolute bottom-0 left-0 w-[200%] h-24 ${className}`} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
    <path fill={fill} d="M0 50 Q90 0 180 50 T360 50 T540 50 T720 50 T900 50 T1080 50 T1260 50 T1440 50 V100 H0Z" />
  </svg>
)

export default function Hero({ onPlay, playing }) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-36 sm:pt-24 sm:pb-44 text-center relative z-10">
        <div className="mx-auto w-24 h-24 rounded-full sun-gradient shadow-[0_0_80px_20px_rgba(255,180,76,.5)] mb-8" aria-hidden="true" />
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight drop-shadow">Your Music Escape</h1>
        <p className="mt-4 text-lg sm:text-xl text-sand/90">Relax • Listen • Feel</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onPlay} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand text-ocean-950 font-semibold hover:scale-105 transition">
            <Play size={18} fill="currentColor" /> {playing ? 'Playing now' : 'Play now'}
          </button>
          <Link to="/discover" className="px-6 py-3 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition">Explore Music</Link>
        </div>
        <p className="mt-6 text-2xl tracking-widest" aria-hidden="true">🌊 🌴 🌅</p>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-24 overflow-hidden" aria-hidden="true">
        <Wave className="wave-move-slow opacity-60" fill="#27c4c9" />
        <Wave className="wave-move" fill="#062a36" />
      </div>
    </section>
  )
}
