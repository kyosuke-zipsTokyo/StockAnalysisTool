'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  getWatchlist,
  subscribeWatchlist,
  toggleWatchlist,
  type WatchlistEntry,
  type WatchlistKind,
} from '@/lib/watchlist'

export function useWatchlist() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setEntries(getWatchlist())
    setReady(true)
    return subscribeWatchlist(() => setEntries(getWatchlist()))
  }, [])

  const toggle = useCallback((kind: WatchlistKind, code: string) => {
    toggleWatchlist(kind, code)
  }, [])

  return {
    entries,
    ready,
    toggle,
    isWatched: (kind: WatchlistKind, code: string) =>
      entries.some((e) => e.kind === kind && e.code === code),
  }
}
