import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

import { SearchBox } from '@/components/search-box'
import { DisclaimerBanner } from '@/components/disclaimer-banner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { companies } from '@/lib/companies'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            銘柄コードを入力して、リサーチを始めましょう
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ニュース・IR要約・企業価値・成長余地・リスク・経営陣コメントを1画面に集約し、
            過去データに基づく統計的な値動き傾向を確認できるリサーチ支援ツールです。
          </p>
        </div>
        <SearchBox autoFocus />
        <DisclaimerBanner />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">サンプル銘柄</h2>
          <Link
            href="/watchlist"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Star className="size-3.5" />
            注目銘柄を見る
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companies.map((c) => (
            <Link key={c.code} href={`/stocks/${c.code}`}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/40">
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.code}
                      </span>
                      <Badge variant="outline">{c.market}</Badge>
                    </div>
                    <span className="font-medium leading-snug">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.sector}</span>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
