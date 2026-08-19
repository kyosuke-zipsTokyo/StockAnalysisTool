export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= period) sum -= values[i - period]
    if (i >= period - 1) out[i] = sum / period
  }
  return out
}

export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1]
    const gain = Math.max(change, 0)
    const loss = Math.max(-change, 0)
    if (i <= period) {
      avgGain += gain / period
      avgLoss += loss / period
      if (i === period) {
        out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
      out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
    }
  }
  return out
}

export function bollinger(values: number[], period = 20, mult = 2) {
  const mid = sma(values, period)
  const upper: (number | null)[] = new Array(values.length).fill(null)
  const lower: (number | null)[] = new Array(values.length).fill(null)
  for (let i = period - 1; i < values.length; i++) {
    const m = mid[i]
    if (m == null) continue
    let variance = 0
    for (let j = i - period + 1; j <= i; j++) variance += (values[j] - m) ** 2
    const stdev = Math.sqrt(variance / period)
    upper[i] = m + mult * stdev
    lower[i] = m - mult * stdev
  }
  return { mid, upper, lower }
}

export interface TrendTendency {
  direction: 'up' | 'down' | 'flat'
  probabilityUpPct: number
  sampleSize: number
  upCount: number
  downCount: number
  avgForwardReturnPct: number
  horizonDays: number
  matchedState: string
  currentRsi: number
  maRelation: 'golden' | 'dead' | 'flat'
}

/**
 * Pattern-matches the current RSI/moving-average "state" against every prior
 * occurrence of that same state in the series, and reports how often price
 * was higher `horizon` trading days later. This is a plain historical
 * frequency count over the (synthetic) series — a statistical description of
 * the past, not a prediction, forecast, or trade recommendation.
 */
export function computeTrendTendency(
  closes: number[],
  horizon = 5,
): TrendTendency | null {
  const rsiArr = rsi(closes, 14)
  const sma5 = sma(closes, 5)
  const sma25 = sma(closes, 25)

  function maRelationOf(s5: number, s25: number): 'golden' | 'dead' | 'flat' {
    return s5 > s25 * 1.005 ? 'golden' : s5 < s25 * 0.995 ? 'dead' : 'flat'
  }

  function bucket(i: number): string | null {
    const r = rsiArr[i]
    const s5 = sma5[i]
    const s25 = sma25[i]
    if (r == null || s5 == null || s25 == null) return null
    const rsiBucket = r < 35 ? 'low' : r > 65 ? 'high' : 'mid'
    return `${rsiBucket}_${maRelationOf(s5, s25)}`
  }

  const n = closes.length
  const currentBucket = bucket(n - 1)
  if (!currentBucket) return null
  const currentRsi = rsiArr[n - 1] as number
  const maRelation = maRelationOf(sma5[n - 1] as number, sma25[n - 1] as number)

  const matches: number[] = []
  for (let i = 30; i < n - horizon; i++) {
    if (bucket(i) === currentBucket) {
      matches.push(((closes[i + horizon] - closes[i]) / closes[i]) * 100)
    }
  }
  if (matches.length < 5) return null

  const upCount = matches.filter((m) => m > 0).length
  const probabilityUpPct = Math.round((upCount / matches.length) * 100)
  const avgForwardReturnPct =
    matches.reduce((a, b) => a + b, 0) / matches.length
  const direction =
    probabilityUpPct >= 60 ? 'up' : probabilityUpPct <= 40 ? 'down' : 'flat'

  const stateLabels: Record<string, string> = {
    low_golden: 'RSI低水準 × 短期MAが中期MAを上抜け',
    low_mid: 'RSI低水準 × 移動平均は横ばい',
    low_dead: 'RSI低水準 × 短期MAが中期MAを下抜け',
    mid_golden: 'RSI中立 × 短期MAが中期MAを上抜け',
    mid_mid: 'RSI中立 × 移動平均は横ばい',
    mid_dead: 'RSI中立 × 短期MAが中期MAを下抜け',
    high_golden: 'RSI高水準 × 短期MAが中期MAを上抜け',
    high_mid: 'RSI高水準 × 移動平均は横ばい',
    high_dead: 'RSI高水準 × 短期MAが中期MAを下抜け',
  }

  return {
    direction,
    probabilityUpPct,
    sampleSize: matches.length,
    upCount,
    downCount: matches.length - upCount,
    avgForwardReturnPct,
    horizonDays: horizon,
    matchedState: stateLabels[currentBucket] ?? currentBucket,
    currentRsi,
    maRelation,
  }
}

export interface ReferenceRange {
  low1s: number
  high1s: number
  low2s: number
  high2s: number
  horizonDays: number
}

/**
 * Builds a statistical reference price band `horizon` days out, from the
 * historical distribution of `horizon`-day returns in the series (mean +/- 1
 * and 2 standard deviations). This is a volatility-based reference range,
 * not a price target.
 */
export function referenceRange(closes: number[], horizon = 5): ReferenceRange | null {
  const rets: number[] = []
  for (let i = 0; i < closes.length - horizon; i++) {
    rets.push((closes[i + horizon] - closes[i]) / closes[i])
  }
  if (rets.length < 20) return null
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length
  const stdev = Math.sqrt(variance)
  const last = closes[closes.length - 1]
  return {
    low1s: last * (1 + mean - stdev),
    high1s: last * (1 + mean + stdev),
    low2s: last * (1 + mean - 2 * stdev),
    high2s: last * (1 + mean + 2 * stdev),
    horizonDays: horizon,
  }
}
