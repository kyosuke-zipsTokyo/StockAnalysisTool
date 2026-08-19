'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { CompanySearchResult } from '@/app/api/companies/search/route'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function RealWatchlistItem({ code }: { code: string }) {
  const [info, setInfo] = useState<CompanySearchResult | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/companies/search?q=${encodeURIComponent(code)}`)
      .then((res) => res.json())
      .then((data: { results: CompanySearchResult[] }) => {
        if (cancelled) return
        setInfo(data.results.find((r) => r.code === code) ?? null)
      })
      .catch(() => {
        if (!cancelled) setInfo(null)
      })
    return () => {
      cancelled = true
    }
  }, [code])

  return (
    <Link href={`/stocks/${code}`}>
      <Card className="transition-colors hover:border-primary/50 hover:bg-muted/40">
        <CardContent className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{code}</span>
              {info?.market ? <Badge variant="outline">{info.market}</Badge> : null}
            </div>
            <span className="font-medium">
              {info === undefined ? '読み込み中…' : (info?.name ?? '銘柄情報を取得できませんでした')}
            </span>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
