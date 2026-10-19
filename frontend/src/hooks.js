import { useEffect, useState } from 'react'

/** Fetch data with loading/error state. `fn` re-runs when `deps` change. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn().then(
      (data) => alive && setState({ data, loading: false, error: null }),
      (error) => alive && setState({ data: null, loading: false, error }),
    )
    return () => { alive = false }
  }, [...deps, tick]) // eslint-disable-line react-hooks/exhaustive-deps
  return { ...state, retry: () => setTick((t) => t + 1) }
}

export const fmtTime = (s) => {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
