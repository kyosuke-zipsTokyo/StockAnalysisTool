'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import { searchCompanies } from '@/lib/companies'
import { cn } from '@/lib/utils'

export function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchCompanies(query), [query])

  function go(code: string) {
    setOpen(false)
    setQuery('')
    router.push(`/stocks/${code}`)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-sm focus-within:ring-3 focus-within:ring-ring/40">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          placeholder="銘柄コードまたは企業名で検索(例: 1201、サンプルテクノロジーズ)"
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
      {open && results.length > 0 ? (
        <ul className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
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
      ) : null}
    </div>
  )
}
