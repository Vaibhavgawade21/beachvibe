import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16 py-8 px-4 text-center text-sm text-sand/60">
      <p>🌴 BeachVibe — music streamed from the open <a className="underline hover:text-sand" href="https://audius.co" target="_blank" rel="noreferrer">Audius</a> catalog. All tracks belong to their artists.</p>
      <p className="mt-2"><Link to="/terms" className="underline hover:text-sand">Terms &amp; Copyright</Link></p>
    </footer>
  )
}
