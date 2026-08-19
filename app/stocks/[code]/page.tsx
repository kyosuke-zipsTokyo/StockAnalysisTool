import { notFound } from 'next/navigation'
import {
  Newspaper,
  Users,
  ShieldAlert,
  TrendingUp,
  FileText,
  Quote,
  Gauge,
  Building2,
  ExternalLink,
} from 'lucide-react'

import { companies, findCompany } from '@/lib/companies'
import { generatePriceSeries } from '@/lib/price-series'
import { computeTrendTendency, referenceRange } from '@/lib/stats'
import { newsSourceUrl, managementCommentSourceUrl } from '@/lib/source-link'
import { formatJpy, formatOku, formatPct, cn } from '@/lib/utils'

import { PriceChart } from '@/components/price-chart'
import { TrendIndicator } from '@/components/trend-indicator'
import { WatchlistButton } from '@/components/watchlist-button'
import { DisclaimerBanner } from '@/components/disclaimer-banner'
import { SectionHeading } from '@/components/ui/section-heading'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export function generateStaticParams() {
  return companies.map((c) => ({ code: c.code }))
}

const toneVariant = {
  ポジティブ: 'positive',
  中立: 'outline',
  ネガティブ: 'destructive',
} as const

const ratingVariant = {
  強気: 'positive',
  中立: 'outline',
  弱気: 'destructive',
} as const

const severityVariant = {
  高: 'destructive',
  中: 'accent',
  低: 'outline',
} as const

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const company = findCompany(code)
  if (!company) notFound()

  const series = generatePriceSeries(
    company.code,
    company.basePrice,
    company.driftPctAnnual,
    company.volPctAnnual,
  )
  const closes = series.map((d) => d.close)
  const trend = computeTrendTendency(closes)
  const range = referenceRange(closes)
  const latest = series[series.length - 1]
  const prev = series[series.length - 2]
  const dayChangePct = prev ? ((latest.close - prev.close) / prev.close) * 100 : 0

  const ratingCounts = { 強気: 0, 中立: 0, 弱気: 0 }
  company.analystViews.forEach((v) => ratingCounts[v.rating]++)
  const avgTarget =
    company.analystViews.reduce((a, v) => a + v.targetPrice, 0) /
    company.analystViews.length

  return (
    <div className="flex flex-col gap-6 py-4">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{company.code}</span>
              <Badge variant="outline">{company.market}</Badge>
              <Badge variant="secondary">{company.sector}</Badge>
            </div>
            <h1 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
              {company.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {company.description}
            </p>
          </div>
          <WatchlistButton code={company.code} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              dayChangePct >= 0 ? 'bg-positive/15 text-positive' : 'bg-destructive/10 text-destructive',
            )}
          >
            前日比 {formatPct(dayChangePct)}
          </span>
          <span className="text-xs text-muted-foreground">
            擬似データによるデモ表示です
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
          title="企業価値・成長余地"
          description="財務指標と成長ドライバーの整理"
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <Metric label="時価総額" value={formatOku(company.fundamentals.marketCapOku)} />
          <Metric
            label="PER"
            value={company.fundamentals.per > 0 ? `${company.fundamentals.per.toFixed(1)}倍` : '—(赤字)'}
          />
          <Metric label="PBR" value={`${company.fundamentals.pbr.toFixed(1)}倍`} />
          <Metric label="ROE" value={`${company.fundamentals.roe.toFixed(1)}%`} />
          <Metric label="配当利回り" value={`${company.fundamentals.dividendYieldPct.toFixed(1)}%`} />
          <Metric
            label="増収率(YoY)"
            value={formatPct(company.fundamentals.revenueGrowthYoYPct)}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>成長ポイント</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {company.growthPoints.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <TrendUpDot />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={ShieldAlert} title="リスク要因" />
        <div className="flex flex-col gap-2.5">
          {company.riskFactors.map((risk) => (
            <Card key={risk.title}>
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant={severityVariant[risk.severity]}>
                    重要度: {risk.severity}
                  </Badge>
                  <span className="text-sm font-medium">{risk.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={FileText} title="IR要約" description={company.irSummary.period} />
        <Card>
          <CardHeader>
            <CardTitle>{company.irSummary.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5 text-sm">
              {company.irSummary.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {company.irSummary.summary}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={Quote} title="経営陣のコメント" description="決算説明会・株主総会等での発言(要約)" />
        <div className="flex flex-col gap-2.5">
          {company.managementComments.map((c, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-1.5">
                <p className="text-sm leading-relaxed">「{c.quote}」</p>
                <p className="text-xs text-muted-foreground">
                  {c.role} ・ {c.context}
                </p>
                <a
                  href={managementCommentSourceUrl(company.code, c.quote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                  情報源を見る(デモ用リンク)
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={Users} title="アナリスト見解" description="サンプルの見解分布(強気/中立/弱気)" />
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Gauge className="size-4 text-muted-foreground" />
              <span className="text-sm">
                平均目標株価(サンプル): <strong>{formatJpy(avgTarget)}</strong>
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted">
              {(['強気', '中立', '弱気'] as const).map((r) => (
                <div
                  key={r}
                  className={cn(
                    r === '強気' && 'bg-positive',
                    r === '中立' && 'bg-muted-foreground/50',
                    r === '弱気' && 'bg-destructive',
                  )}
                  style={{
                    width: `${(ratingCounts[r] / company.analystViews.length) * 100}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              {company.analystViews.map((v, i) => (
                <div key={i} className="flex items-start gap-2.5 border-t border-border pt-2.5 first:border-t-0 first:pt-0">
                  <Badge variant={ratingVariant[v.rating]}>{v.rating}</Badge>
                  <div className="text-sm">
                    <p>
                      目標株価(サンプル): <strong>{formatJpy(v.targetPrice)}</strong>
                    </p>
                    <p className="text-muted-foreground">{v.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading icon={Newspaper} title="関連ニュース" description="出典は情報源の種類を示す一般表記です" />
        <div className="flex flex-col gap-2.5">
          {company.news.map((n, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant={toneVariant[n.tone]}>{n.tone}</Badge>
                  <span>{n.sourceType}</span>
                  <span>・</span>
                  <span>{n.publishedAgoLabel}</span>
                </div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.summary}</p>
                <a
                  href={newsSourceUrl(company.code, n.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                  元記事を見る(デモ用リンク)
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <DisclaimerBanner />
    </div>
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

function TrendUpDot() {
  return (
    <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-positive/15 text-positive">
      <TrendingUp className="size-2.5" />
    </span>
  )
}
