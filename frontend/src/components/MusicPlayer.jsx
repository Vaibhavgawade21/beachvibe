import { useState } from 'react'
import { Heart, ListMusic, Loader2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { fmtTime } from '../hooks'

export default function MusicPlayer() {
  const p = usePlayer()
  const [showQueue, setShowQueue] = useState(false)
  const t = p.currentTrack
  if (!t) return null
  const fav = p.isFavorite(t.id)
  const btn = 'p-2 rounded-full hover:bg-white/10 transition'
  return (
    <>
      {showQueue && (
        <div className="fixed bottom-24 right-2 sm:right-6 z-50 w-[calc(100%-1rem)] sm:w-96 max-h-[60vh] overflow-y-auto rounded-2xl bg-ocean-900 border border-white/15 shadow-2xl p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="font-display font-semibold">Up next ({p.queue.length})</p>
            <button onClick={() => setShowQueue(false)} aria-label="Close queue" className={btn}><X size={18} /></button>
          </div>
          {p.queue.map((q, i) => (
            <button key={q.id + i} onClick={() => p.playFromQueue(i)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/10 ${i === p.index ? 'bg-white/10' : ''}`}>
              <img src={q.artwork_small} alt="" className="w-10 h-10 rounded-md object-cover bg-ocean-800" />
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-medium ${i === p.index ? 'text-sun' : ''}`}>{q.title}</span>
                <span className="block truncate text-xs text-sand/60">{q.artist}</span>
              </span>
              {i === p.index && p.isPlaying && (
                <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
                  {[0, 0.2, 0.4].map((d) => <span key={d} className="eq-bar w-1 bg-sun rounded" style={{ animationDelay: `${d}s` }} />)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-ocean-900/95 backdrop-blur-md border-t border-white/15">
        {/* thin progress bar for mobile */}
        <input type="range" min={0} max={p.duration || 0} step={0.1} value={p.currentTime}
          onChange={(e) => p.seek(Number(e.target.value))} aria-label="Seek"
          className="w-full h-1 block sm:hidden" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 w-[45%] sm:w-1/4 min-w-0">
            <img src={t.artwork_small} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-ocean-800" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-sm sm:text-base">{t.title}</p>
              <p className="truncate text-xs sm:text-sm text-sand/60">{p.error || t.artist}</p>
            </div>
            <button onClick={() => p.toggleFavorite(t)} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={fav} className={`${btn} hidden sm:block`}>
              <Heart size={18} className={fav ? 'text-coral' : ''} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 sm:gap-3">
              <button onClick={() => p.setShuffle(!p.shuffle)} aria-label="Shuffle" aria-pressed={p.shuffle} className={`${btn} hidden sm:block ${p.shuffle ? 'text-sun' : ''}`}><Shuffle size={18} /></button>
              <button onClick={p.prev} aria-label="Previous" className={btn}><SkipBack size={20} fill="currentColor" /></button>
              <button onClick={p.toggle} aria-label={p.isPlaying ? 'Pause' : 'Play'}
                className="w-11 h-11 rounded-full sun-gradient text-ocean-950 grid place-items-center hover:scale-105 transition">
                {p.isLoading && p.isPlaying ? <Loader2 size={20} className="animate-spin" /> : p.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={p.next} aria-label="Next" className={btn}><SkipForward size={20} fill="currentColor" /></button>
              <button onClick={() => p.setRepeat(!p.repeat)} aria-label="Repeat" aria-pressed={p.repeat} className={`${btn} hidden sm:block ${p.repeat ? 'text-sun' : ''}`}><Repeat size={18} /></button>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-full max-w-xl text-xs text-sand/60 tabular-nums">
              <span className="w-10 text-right">{fmtTime(p.currentTime)}</span>
              <input type="range" min={0} max={p.duration || 0} step={0.1} value={p.currentTime}
                onChange={(e) => p.seek(Number(e.target.value))} aria-label="Seek" className="flex-1" />
              <span className="w-10">{fmtTime(p.duration || t.duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:w-1/4 justify-end">
            <button onClick={() => p.setVolume(p.volume > 0 ? 0 : 0.8)} aria-label="Mute" className={`${btn} hidden sm:block`}>
              {p.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input type="range" min={0} max={1} step={0.01} value={p.volume} onChange={(e) => p.setVolume(Number(e.target.value))}
              aria-label="Volume" className="w-24 hidden md:block" />
            <button onClick={() => setShowQueue(!showQueue)} aria-label="Queue" aria-pressed={showQueue} className={`${btn} ${showQueue ? 'text-sun' : ''}`}><ListMusic size={20} /></button>
          </div>
        </div>
      </div>
    </>
  )
}
