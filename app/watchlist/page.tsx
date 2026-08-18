'use client'

import Link from 'next/link'
import { Star, ArrowRight, RefreshCw } from 'lucide-react'

import { useWatchlist } from '@/hooks/use-watchlist'
import { findCompany } from '@/lib/companies'
import { generatePriceSeries } from '@/lib/price-series'
import { computeTrendTendency } from '@/lib/stats'
import { formatJpy, formatPct, cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DisclaimerBanner } from '@/components/disclaimer-banner'

export default function WatchlistPage() {
  const { codes, ready } = useWatchlist()
  const watched = codes.map((code) => findCompany(code)).filter((c) => !!c)

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="flex items-center gap-2 font-heading text-xl font-bold sm:text-2xl">
          <Star className="size-5 text-primary" />
          注目銘柄
        </h1>
        <p className="text-sm text-muted-foreground">
          登録した銘柄はこの端末のブラウザ内(localStorage)に保存されます。
        </p>
      </div>

      {ready && watched.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Star className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              まだ注目銘柄が登録されていません。銘柄詳細ページの「注目銘柄に登録」から追加できます。
            </p>
            <Link href="/" className="mt-2 text-sm text-primary hover:underline">
              銘柄を探す
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {watched.map((c) => {
          if (!c) return null
          const series = generatePriceSeries(c.code, c.basePrice, c.driftPctAnnual, c.volPctAnnual)
          const closes = series.map((d) => d.close)
          const trend = computeTrendTendency(closes)
          const latest = series[series.length - 1]

          return (
            <Link key={c.code} href={`/stocks/${c.code}`}>
              <Card className="transition-colors hover:border-primary/50 hover:bg-muted/40">
                <CardContent className="flex items-center gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{c.code}</span>
                      <Badge variant="outline">{c.market}</Badge>
                    </div>
                    <span className="font-medium">{c.name}</span>
                    <span className="font-heading text-sm font-semibold tabular-nums">
                      {formatJpy(latest.close)}
                    </span>
                  </div>
                  {trend ? (
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          trend.direction === 'up' && 'bg-positive/15 text-positive',
                          trend.direction === 'down' && 'bg-destructive/10 text-destructive',
                          trend.direction === 'flat' && 'bg-muted text-muted-foreground',
                        )}
                      >
                        上昇確率 {trend.probabilityUpPct}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {trend.horizonDays}営業日換算 平均{formatPct(trend.avgForwardReturnPct)}
                      </span>
                    </div>
                  ) : null}
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {watched.length > 0 ? (
        <Card>
          <CardContent className="flex gap-2.5">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">バックグラウンド分析について(将来構想)</p>
              <p className="mt-1 leading-relaxed">
                本番運用では、登録銘柄のIR資料・決算短信・株主総会想定問答などを定期ジョブ(例:
                TDnet/EDINETの適時開示フィードを監視し、更新があれば自動で要約を生成)で分析し、
                このページに反映する構成を想定しています。現在のデモ版では固定のサンプルデータを表示しています。
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <DisclaimerBanner variant="compact" />
    </div>
  )
}
