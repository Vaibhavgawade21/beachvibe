import { Link } from 'react-router-dom'

export default function CategoryCard({ cat }) {
  return (
    <Link to={`/discover/${cat.slug}`}
      className={`relative overflow-hidden rounded-2xl p-5 h-28 sm:h-32 bg-gradient-to-br ${cat.color} font-display font-bold text-lg sm:text-xl hover:scale-[1.03] transition shadow-lg`}>
      <span className="drop-shadow">{cat.label}</span>
      <span className="absolute -bottom-2 -right-1 text-6xl sm:text-7xl rotate-12 opacity-90" aria-hidden="true">{cat.emoji}</span>
    </Link>
  )
}
