'use client'

import { useCallback, useEffect, useState } from 'react'

import { getWatchlist, subscribeWatchlist, toggleWatchlist } from '@/lib/watchlist'

export function useWatchlist() {
  const [codes, setCodes] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCodes(getWatchlist())
    setReady(true)
    return subscribeWatchlist(() => setCodes(getWatchlist()))
  }, [])

  const toggle = useCallback((code: string) => {
    toggleWatchlist(code)
  }, [])

  return { codes, ready, toggle, isWatched: (code: string) => codes.includes(code) }
}
