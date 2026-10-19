import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ initial = '', onSubmit, autoFocus }) {
  const [value, setValue] = useState(initial)
  return (
    <form onSubmit={(e) => { e.preventDefault(); value.trim() && onSubmit(value.trim()) }} role="search"
      className="flex items-center gap-3 bg-white/10 focus-within:bg-white/15 focus-within:ring-2 ring-sun/70 rounded-full px-5 py-3 max-w-2xl w-full">
      <Search size={20} className="text-sand/70 shrink-0" />
      <input value={value} onChange={(e) => setValue(e.target.value)} autoFocus={autoFocus} maxLength={100}
        placeholder="Search songs, artists, moods…" aria-label="Search music"
        className="bg-transparent outline-none flex-1 placeholder:text-sand/50 min-w-0" />
    </form>
  )
}
