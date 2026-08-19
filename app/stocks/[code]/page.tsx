import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Building2, FileText, Info, TrendingUp } from 'lucide-react'

import {
  JQuantsNotConfiguredError,
  defaultQuoteRange,
  findListedInfo,
  getDailyQuotes,
  getFinancialStatements,
  isJQuantsConfigured,
  toOhlcSeries,
} from '@/lib/jquants'
import { computeFundamentals } from '@/lib/fundamentals'
import { computeTrendTendency, referenceRange } from '@/lib/stats'
import { formatJpy, formatOku, formatPct } from '@/lib/utils'

import { PriceChart } from '@/components/price-chart'
import { TrendIndicator } from '@/components/trend-indicator'
import { WatchlistButton } from '@/components/watchlist-button'
import { DisclosuresSection } from '@/components/disclosures-section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function RealStockDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  if (!isJQuantsConfigured()) {
    return <NotConfiguredNotice code={code} />
  }

  let listedInfo
  let quotes
  let statements
  try {
    ;[listedInfo, quotes, statements] = await Promise.all([
      findListedInfo(code),
      getDailyQuotes(code, defaultQuoteRange().from, defaultQuoteRange().to),
      getFinancialStatements(code).catch(() => []),
    ])
  } catch (error) {
    if (error instanceof JQuantsNotConfiguredError) {
      return <NotConfiguredNotice code={code} />
    }
    return <FetchErrorNotice code={code} />
  }

  if (!listedInfo) notFound()

  const series = toOhlcSeries(quotes)
  if (series.length < 40) {
    return <InsufficientDataNotice code={code} name={listedInfo.CompanyName} />
  }

  const closes = series.map((d) => d.close)
  const trend = computeTrendTendency(closes)
  const range = referenceRange(closes)
  const latest = series[series.length - 1]
  const prev = series[series.length - 2]
  const dayChangePct = prev ? ((latest.close - prev.close) / prev.close) * 100 : 0
  const fundamentals = computeFundamentals(statements, latest.close)

  return (
    <div className="flex flex-col gap-6 py-4">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{code}</span>
              {listedInfo.MarketCodeName ? (
                <Badge variant="outline">{listedInfo.MarketCodeName}</Badge>
              ) : null}
              {listedInfo.Sector33CodeName ? (
                <Badge variant="secondary">{listedInfo.Sector33CodeName}</Badge>
              ) : null}
            </div>
            <h1 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
              {listedInfo.CompanyName}
            </h1>
          </div>
          <WatchlistButton kind="real" code={code} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              dayChangePct >= 0
                ? 'rounded-full bg-positive/15 px-2 py-0.5 text-xs font-medium text-positive'
                : 'rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive'
            }
          >
            前日比 {formatPct(dayChangePct)}
          </span>
          <span className="text-xs text-muted-foreground">
            データ提供: J-Quants(無料プランのため最大12週間程度の遅延あり) ・ 直近営業日: {latest.date}
          </span>
        </div>
      </section>

      <Card>
        <CardContent>
          <PriceChart series={series} />
        </CardContent>
      </Card>

      <TrendIndicator trend={trend} range={range} currentPrice={latest.close} />

      <section className="flex flex-col gap-3">
        <SectionHeading
          icon={Building2}
          title="企業価値"
          description={
            fundamentals.latestStatementDate
              ? `直近開示(${fundamentals.latestStatementDate})の決算短信サマリから算出`
              : '決算短信サマリが取得できませんでした'
          }
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <Metric label="時価総額(概算)" value={fundamentals.marketCapOku != null ? formatOku(fundamentals.marketCapOku) : '—'} />
          <Metric label="PER(概算)" value={fundamentals.per != null ? `${fundamentals.per.toFixed(1)}倍` : '—'} />
          <Metric label="PBR(概算)" value={fundamentals.pbr != null ? `${fundamentals.pbr.toFixed(1)}倍` : '—'} />
          <Metric label="ROE(概算)" value={fundamentals.roe != null ? `${fundamentals.roe.toFixed(1)}%` : '—'} />
          <Metric
            label="増収率(YoY・概算)"
            value={fundamentals.revenueGrowthYoYPct != null ? formatPct(fundamentals.revenueGrowthYoYPct) : '—'}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          「概算」は決算短信サマリのEPS/BPS等から本ツールが計算した値です。公式の発表数値と差異が生じる場合があります。
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={FileText} title="IR・適時開示" description="EDINET提出書類(直近30日)" />
        <Suspense fallback={<DisclosuresSkeleton />}>
          <DisclosuresSection code={code} />
        </Suspense>
      </section>

      <Card>
        <CardContent className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            株価はJ-Quants APIから取得した実データですが、無料プランのため最大12週間程度遅延しています。
            IR・適時開示はEDINET APIから取得した実データ(直近30日分)です。
            「統計的な値動き傾向」「参考レンジ」は過去データに基づく統計的な参考情報であり、将来の株価を予測・保証するものではなく、投資助言・売買の推奨ではありません。
            ニュース・アナリスト見解・経営陣コメントは現時点でデータ提供元との契約がないため未対応です。投資判断はご自身の責任で行ってください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function DisclosuresSkeleton() {
  return (
    <Card>
      <CardContent className="text-sm text-muted-foreground">EDINETから取得中…</CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-heading text-sm font-semibold tabular-nums sm:text-base">{value}</p>
    </div>
  )
}

function NotConfiguredNotice({ code }: { code: string }) {
  return (
    <NoticeCard
      title="実データはまだ設定されていません"
      description={`J-Quants APIキー(JQUANTS_MAIL_ADDRESS / JQUANTS_PASSWORD)が未設定のため、銘柄コード ${code} の実データを表示できません。`}
    />
  )
}

function FetchErrorNotice({ code }: { code: string }) {
  return (
    <NoticeCard
      title="データの取得に失敗しました"
      description={`銘柄コード ${code} のデータ取得中にエラーが発生しました。時間をおいて再度お試しください。`}
    />
  )
}

function InsufficientDataNotice({ code, name }: { code: string; name: string }) {
  return (
    <NoticeCard
      title="統計計算に十分な履歴データがありません"
      description={`${name}(${code})は取得できた株価データが少なく、統計的な傾向分析を行うには期間が不足しています。`}
    />
  )
}

function NoticeCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
        <TrendingUp className="size-8 text-muted-foreground" />
        <p className="font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        <Link href="/" className="mt-2 text-sm text-primary hover:underline">
          トップに戻る
        </Link>
      </CardContent>
    </Card>
  )
}
