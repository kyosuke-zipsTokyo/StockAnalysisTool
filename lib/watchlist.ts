const STORAGE_KEY = 'stock-research-nav:watchlist'
const EVENT_NAME = 'watchlist:change'

export type WatchlistKind = 'real' | 'demo'

export interface WatchlistEntry {
  kind: WatchlistKind
  code: string
}

function encode(entry: WatchlistEntry): string {
  return `${entry.kind}:${entry.code}`
}

export function decode(raw: string): WatchlistEntry {
  const [kind, ...rest] = raw.split(':')
  if (kind === 'demo' || kind === 'real') {
    return { kind, code: rest.join(':') }
  }
  // Legacy entries saved before demo/real were separated were always demo codes.
  return { kind: 'demo', code: raw }
}

export function getWatchlist(): WatchlistEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string').map(decode)
      : []
  } catch {
    return []
  }
}

function persist(entries: WatchlistEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.map(encode)))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function isWatched(kind: WatchlistKind, code: string): boolean {
  return getWatchlist().some((e) => e.kind === kind && e.code === code)
}

export function addToWatchlist(kind: WatchlistKind, code: string) {
  const current = getWatchlist()
  if (!current.some((e) => e.kind === kind && e.code === code)) {
    persist([...current, { kind, code }])
  }
}

export function removeFromWatchlist(kind: WatchlistKind, code: string) {
  persist(getWatchlist().filter((e) => !(e.kind === kind && e.code === code)))
}

export function toggleWatchlist(kind: WatchlistKind, code: string): boolean {
  const watched = isWatched(kind, code)
  if (watched) removeFromWatchlist(kind, code)
  else addToWatchlist(kind, code)
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
