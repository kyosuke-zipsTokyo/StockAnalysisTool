import { Info, TrendingDown, TrendingUp, Minus } from 'lucide-react'

import type { ReferenceRange, TrendTendency } from '@/lib/stats'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatJpy, formatPct, cn } from '@/lib/utils'

const directionMeta = {
  up: {
    label: '上昇していたケースが多い',
    icon: TrendingUp,
    className: 'text-positive bg-positive/10',
  },
  down: {
    label: '下落していたケースが多い',
    icon: TrendingDown,
    className: 'text-destructive bg-destructive/10',
  },
  flat: {
    label: '方向感に偏りが少ない',
    icon: Minus,
    className: 'text-muted-foreground bg-muted',
  },
} as const

export function TrendIndicator({
  trend,
  range,
  currentPrice,
}: {
  trend: TrendTendency | null
  range: ReferenceRange | null
  currentPrice: number
}) {
  if (!trend || !range) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            統計計算に十分な期間のデータがありません。
          </p>
        </CardContent>
      </Card>
    )
  }

  const meta = directionMeta[trend.direction]
  const Icon = meta.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle>統計的な値動き傾向(過去データの頻度分析)</CardTitle>
        <CardDescription>
          現在と類似したテクニカル状態({trend.matchedState})が過去に出現した
          {trend.sampleSize}回のうち、{trend.horizonDays}営業日後の値動きを集計した結果です。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-full', meta.className)}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{meta.label}</p>
            <p className="text-xs text-muted-foreground">
              類似パターン発生後、{trend.horizonDays}営業日後に上昇していた割合
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-heading text-2xl font-bold tabular-nums">
              {trend.probabilityUpPct}%
            </p>
            <p className="text-[11px] text-muted-foreground">n={trend.sampleSize}</p>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full',
              trend.direction === 'up' && 'bg-positive',
              trend.direction === 'down' && 'bg-destructive',
              trend.direction === 'flat' && 'bg-muted-foreground',
            )}
            style={{ width: `${trend.probabilityUpPct}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          同条件下での{trend.horizonDays}営業日後の平均騰落率: {formatPct(trend.avgForwardReturnPct)}
        </p>

        <div className="rounded-lg border border-border p-3">
          <p className="text-sm font-medium">
            {trend.horizonDays}営業日後の統計的な参考レンジ(ボラティリティベース)
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="tabular-nums text-muted-foreground">{formatJpy(range.low2s)}</span>
            <div className="relative h-1.5 flex-1 rounded-full bg-muted">
              <div
                className="absolute inset-y-0 rounded-full bg-primary/25"
                style={{ left: '0%', right: '0%' }}
              />
              <div
                className="absolute inset-y-0 rounded-full bg-primary/60"
                style={{
                  left: `${((range.low1s - range.low2s) / (range.high2s - range.low2s)) * 100}%`,
                  right: `${100 - ((range.high1s - range.low2s) / (range.high2s - range.low2s)) * 100}%`,
                }}
              />
              <div
                className="absolute top-1/2 size-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-foreground"
                style={{
                  left: `${((currentPrice - range.low2s) / (range.high2s - range.low2s)) * 100}%`,
                }}
              />
            </div>
            <span className="tabular-nums text-muted-foreground">{formatJpy(range.high2s)}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            目安レンジ(約68%の頻度で収まった範囲): {formatJpy(range.low1s)} 〜 {formatJpy(range.high1s)}
          </p>
        </div>

        <div className="flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            これは過去の統計データに基づく頻度・分布の参考情報であり、将来の株価を予測・保証するものではありません。「買い時」「売り時」の助言ではなく、投資の最終判断はご自身の責任で行ってください。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
