export default function Terms() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4 text-sand/90 leading-relaxed">
      <h1 className="font-display font-bold text-3xl text-sand">Terms &amp; Copyright</h1>
      <p>BeachVibe is a music discovery and player interface. It does not host, store, download or redistribute any audio files.</p>
      <p>All music is streamed on demand through the official <a className="text-sun underline" href="https://docs.audius.co" target="_blank" rel="noreferrer">Audius API</a>. Artist names and artwork are always shown with each track, and every track remains the property of its creator.</p>
      <p>BeachVibe does not scrape other platforms and does not bypass any API restriction. Use of the service is also subject to Audius's own terms.</p>
      <p>Favorites and recently played lists are stored only in your browser (localStorage). BeachVibe has no accounts and collects no personal data.</p>
      <p>If you are a rights holder and believe content should not be available, please contact Audius, the source of the catalog.</p>
    </article>
  )
}
