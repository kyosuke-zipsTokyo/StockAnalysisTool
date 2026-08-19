'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'

import type { CompanySearchResult } from '@/app/api/companies/search/route'
import { cn } from '@/lib/utils'

export function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [results, setResults] = useState<CompanySearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const requestId = ++requestIdRef.current
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(q)}`)
        const data = (await res.json()) as { configured: boolean; results: CompanySearchResult[] }
        if (requestId !== requestIdRef.current) return
        setConfigured(data.configured)
        setResults(data.results)
      } catch {
        if (requestId !== requestIdRef.current) return
        setResults([])
      } finally {
        if (requestId === requestIdRef.current) setLoading(false)
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  function go(code: string) {
    setOpen(false)
    setQuery('')
    router.push(`/stocks/${code}`)
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-sm focus-within:ring-3 focus-within:ring-ring/40">
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <Search className="size-4 shrink-0 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          placeholder="銘柄コードまたは企業名で検索(例: 7203、トヨタ)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (!open || results.length === 0) return
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActiveIndex((i) => (i + 1) % results.length)
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActiveIndex((i) => (i - 1 + results.length) % results.length)
            } else if (e.key === 'Enter') {
              e.preventDefault()
              go(results[activeIndex].code)
            }
          }}
        />
      </div>
      {showDropdown ? (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {!configured ? (
            <p className="px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
              実銘柄検索はまだ準備中です(J-Quants APIキー未設定)。下の「デモ銘柄」から画面イメージをご確認いただけます。
            </p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((c, i) => (
                <li key={c.code}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm hover:bg-muted',
                      i === activeIndex && 'bg-muted',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(c.code)}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.code} ・ {c.sector} ・ {c.market}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : !loading ? (
            <p className="px-3.5 py-3 text-xs text-muted-foreground">該当する銘柄が見つかりませんでした。</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
