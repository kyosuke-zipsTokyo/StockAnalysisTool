const STORAGE_KEY = 'stock-research-nav:watchlist'
const EVENT_NAME = 'watchlist:change'

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

function persist(codes: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function isWatched(code: string): boolean {
  return getWatchlist().includes(code)
}

export function addToWatchlist(code: string) {
  const current = getWatchlist()
  if (!current.includes(code)) persist([...current, code])
}

export function removeFromWatchlist(code: string) {
  persist(getWatchlist().filter((c) => c !== code))
}

export function toggleWatchlist(code: string): boolean {
  const watched = isWatched(code)
  if (watched) removeFromWatchlist(code)
  else addToWatchlist(code)
  return !watched
}

export function subscribeWatchlist(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}
