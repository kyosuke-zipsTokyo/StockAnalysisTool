'use client'

import { useMemo, useState } from 'react'

import type { OHLC } from '@/lib/price-series'
import { sma } from '@/lib/stats'
import { cn, formatJpy } from '@/lib/utils'

const WIDTH = 640
const HEIGHT = 260
const PAD_TOP = 12
const PAD_BOTTOM = 24
const PAD_LEFT = 4
const PAD_RIGHT = 4
const VOL_HEIGHT = 48
const VOL_GAP = 10

export function PriceChart({
  series,
  dateSuffix,
}: {
  series: OHLC[]
  /** 日付ラベルの補足(例: デモページでは「(擬似データ)」)。省略時は付与しない。 */
  dateSuffix?: string
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const closes = useMemo(() => series.map((d) => d.close), [series])
  const sma5 = useMemo(() => sma(closes, 5), [closes])
  const sma25 = useMemo(() => sma(closes, 25), [closes])

  const priceMin = Math.min(...series.map((d) => d.low))
  const priceMax = Math.max(...series.map((d) => d.high))
  const priceRange = priceMax - priceMin || 1
  const volMax = Math.max(...series.map((d) => d.volume)) || 1

  const chartHeight = HEIGHT - PAD_TOP - PAD_BOTTOM - VOL_HEIGHT - VOL_GAP
  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT

  const xFor = (i: number) => PAD_LEFT + (i / (series.length - 1)) * innerWidth
  const yFor = (price: number) =>
    PAD_TOP + chartHeight - ((price - priceMin) / priceRange) * chartHeight

  const linePath = (values: (number | null)[]) => {
    let d = ''
    let started = false
    values.forEach((v, i) => {
      if (v == null) return
      const x = xFor(i)
      const y = yFor(v)
      d += `${started ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)} `
      started = true
    })
    return d.trim()
  }

  const closePath = linePath(closes)
  const sma5Path = linePath(sma5)
  const sma25Path = linePath(sma25)

  const volTop = PAD_TOP + chartHeight + VOL_GAP
  const barWidth = Math.max(innerWidth / series.length - 1, 1)

  const active = hoverIndex != null ? series[hoverIndex] : series[series.length - 1]

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH
    const i = Math.round(((relX - PAD_LEFT) / innerWidth) * (series.length - 1))
    setHoverIndex(Math.min(Math.max(i, 0), series.length - 1))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl font-bold tabular-nums">
            {formatJpy(active.close)}
          </span>
          <span className="text-xs text-muted-foreground">
            {active.date}
            {dateSuffix ? `(${dateSuffix})` : ''}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded bg-[oklch(0.4_0.13_264)]" />
            終値
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded bg-[oklch(0.65_0.15_60)]" />
            5日平均
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded bg-[oklch(0.55_0.14_155)]" />
            25日平均
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <line
          x1={PAD_LEFT}
          x2={WIDTH - PAD_RIGHT}
          y1={PAD_TOP + chartHeight}
          y2={PAD_TOP + chartHeight}
          className="stroke-border"
          strokeWidth={1}
        />
        <path d={closePath} fill="none" className="stroke-[oklch(0.4_0.13_264)]" strokeWidth={1.75} />
        <path d={sma5Path} fill="none" className="stroke-[oklch(0.65_0.15_60)]" strokeWidth={1.25} />
        <path d={sma25Path} fill="none" className="stroke-[oklch(0.55_0.14_155)]" strokeWidth={1.25} />

        {series.map((d, i) => (
          <rect
            key={d.date}
            x={xFor(i) - barWidth / 2}
            y={volTop + VOL_HEIGHT - (d.volume / volMax) * VOL_HEIGHT}
            width={barWidth}
            height={(d.volume / volMax) * VOL_HEIGHT}
            className={cn(
              'fill-muted-foreground/25',
              hoverIndex === i && 'fill-primary/50',
            )}
          />
        ))}

        {hoverIndex != null ? (
          <line
            x1={xFor(hoverIndex)}
            x2={xFor(hoverIndex)}
            y1={PAD_TOP}
            y2={volTop + VOL_HEIGHT}
            className="stroke-foreground/30"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        ) : null}
      </svg>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{series[0]?.date}</span>
        <span>出来高</span>
        <span>{series[series.length - 1]?.date}</span>
      </div>
    </div>
  )
}
