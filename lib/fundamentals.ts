import type { FinancialStatement } from './jquants'

export interface RealFundamentals {
  per: number | null
  pbr: number | null
  roe: number | null
  marketCapOku: number | null
  revenueGrowthYoYPct: number | null
  latestStatementDate: string | null
}

function parseNum(value: string | undefined): number | null {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const EMPTY: RealFundamentals = {
  per: null,
  pbr: null,
  roe: null,
  marketCapOku: null,
  revenueGrowthYoYPct: null,
  latestStatementDate: null,
}

/**
 * J-Quants /fins/statements の決算短信サマリと直近株価から、可能な範囲で
 * PER/PBR/ROE/時価総額/増収率を概算する。値が算出できない項目は null にする
 * (実在しない数値を埋めない)。
 */
export function computeFundamentals(
  statements: FinancialStatement[],
  currentPrice: number,
): RealFundamentals {
  if (statements.length === 0) return EMPTY

  const sorted = [...statements].sort((a, b) => b.DisclosedDate.localeCompare(a.DisclosedDate))
  const latest = sorted[0]

  const eps = parseNum(latest.EarningsPerShare)
  const bps = parseNum(latest.BookValuePerShare)
  const profit = parseNum(latest.Profit)
  const equity = parseNum(latest.Equity)
  const netSales = parseNum(latest.NetSales)

  const per = eps && eps > 0 ? currentPrice / eps : null
  const pbr = bps && bps > 0 ? currentPrice / bps : null
  const roe = profit != null && equity ? (profit / equity) * 100 : null
  const shares = bps && bps > 0 && equity != null ? equity / bps : null
  const marketCapOku = shares ? (shares * currentPrice) / 1e8 : null

  let revenueGrowthYoYPct: number | null = null
  if (netSales != null) {
    const latestDate = new Date(latest.DisclosedDate)
    const prior = sorted.find((s) => {
      if (s === latest || s.TypeOfDocument !== latest.TypeOfDocument) return false
      const days = (latestDate.getTime() - new Date(s.DisclosedDate).getTime()) / 86_400_000
      return days > 300 && days < 430
    })
    const priorNetSales = prior ? parseNum(prior.NetSales) : null
    if (priorNetSales) {
      revenueGrowthYoYPct = ((netSales - priorNetSales) / priorNetSales) * 100
    }
  }

  return {
    per,
    pbr,
    roe,
    marketCapOku,
    revenueGrowthYoYPct,
    latestStatementDate: latest.DisclosedDate,
  }
}
