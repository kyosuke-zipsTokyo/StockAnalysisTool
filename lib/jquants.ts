/**
 * J-Quants API (JPX公式・株価データ) のクライアント。
 *
 * 認証は2通りに対応している(どちらか一方が設定されていればよい):
 *   1. JQUANTS_REFRESH_TOKEN を直接設定(J-Quantsのマイページにログイン後、
 *      表示されているリフレッシュトークンをコピーする方法。SSOログインで
 *      パスワードを発行していない場合はこちらを使う)。
 *      ただしリフレッシュトークンは発行から約1週間で失効するため、
 *      失効したら再度マイページから取得し、環境変数を更新する必要がある。
 *   2. JQUANTS_MAIL_ADDRESS / JQUANTS_PASSWORD を設定(メールアドレス/パスワードで
 *      ログインする方式。毎回自動でrefreshTokenを取得し直すため更新の手間がない)。
 *
 * どちらも未設定の場合は JQuantsNotConfiguredError を投げるので、呼び出し側で
 * ハンドリングして「実データ未設定」の表示に切り替えること。
 *
 * 参考: https://jpx.gitbook.io/j-quants-ja/api-reference
 * (このプロジェクトのサンドボックス環境からは外部ドキュメントを直接参照できないため、
 *  フィールド名は既知の仕様に基づく実装です。実クレデンシャルでの動作確認後に
 *  差異があれば調整してください。)
 */

import type { OHLC } from './price-series'

const BASE_URL = 'https://api.jquants.com/v1'

export class JQuantsNotConfiguredError extends Error {
  constructor() {
    super(
      'Neither JQUANTS_REFRESH_TOKEN nor JQUANTS_MAIL_ADDRESS/JQUANTS_PASSWORD is configured',
    )
    this.name = 'JQuantsNotConfiguredError'
  }
}

export class JQuantsApiError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number,
    message?: string,
  ) {
    super(message ?? `J-Quants API error on ${path}: HTTP ${status}`)
    this.name = 'JQuantsApiError'
  }
}

interface IdTokenCache {
  idToken: string
  expiresAt: number
}

// Module-scoped cache: survives across requests within the same warm
// serverless function instance, avoiding a re-auth round-trip per request.
let tokenCache: IdTokenCache | null = null
let inFlightAuth: Promise<string> | null = null

async function fetchIdToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.idToken
  }
  if (inFlightAuth) return inFlightAuth

  const staticRefreshToken = process.env.JQUANTS_REFRESH_TOKEN
  const mailaddress = process.env.JQUANTS_MAIL_ADDRESS
  const password = process.env.JQUANTS_PASSWORD
  if (!staticRefreshToken && (!mailaddress || !password)) {
    throw new JQuantsNotConfiguredError()
  }

  inFlightAuth = (async () => {
    let refreshToken: string
    if (staticRefreshToken) {
      refreshToken = staticRefreshToken
    } else {
      const authRes = await fetch(`${BASE_URL}/token/auth_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailaddress, password }),
      })
      if (!authRes.ok) {
        throw new JQuantsApiError('/token/auth_user', authRes.status)
      }
      ;({ refreshToken } = (await authRes.json()) as { refreshToken: string })
    }

    const refreshRes = await fetch(
      `${BASE_URL}/token/auth_refresh?refreshtoken=${encodeURIComponent(refreshToken)}`,
      { method: 'POST' },
    )
    if (!refreshRes.ok) {
      throw new JQuantsApiError('/token/auth_refresh', refreshRes.status)
    }
    const { idToken } = (await refreshRes.json()) as { idToken: string }

    // idToken is valid ~24h; refresh a little early to be safe.
    tokenCache = { idToken, expiresAt: Date.now() + 20 * 60 * 60 * 1000 }
    return idToken
  })()

  try {
    return await inFlightAuth
  } finally {
    inFlightAuth = null
  }
}

async function jquantsGet<T>(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T> {
  const idToken = await fetchIdToken()
  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` },
    // Company master data changes rarely; price/statement data changes daily.
    // Callers layer their own caching on top (see getListedInfo below).
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new JQuantsApiError(path, res.status)
  }
  return res.json() as Promise<T>
}

/** 4桁の証券コードをJ-Quantsが内部で使う5桁表記に正規化する(通常は末尾に "0" を付与)。 */
export function toFiveDigitCode(code: string): string {
  return code.length === 4 ? `${code}0` : code
}

/** J-Quantsの5桁コードを画面表示用の4桁コードに戻す。 */
export function toFourDigitCode(code: string): string {
  return code.length === 5 && code.endsWith('0') ? code.slice(0, 4) : code
}

export interface ListedInfo {
  Code: string
  CompanyName: string
  CompanyNameEnglish?: string
  MarketCode?: string
  MarketCodeName?: string
  Sector17CodeName?: string
  Sector33CodeName?: string
}

interface ListedInfoCacheEntry {
  data: ListedInfo[]
  fetchedAt: number
}

let listedInfoCache: ListedInfoCacheEntry | null = null
const LISTED_INFO_TTL_MS = 12 * 60 * 60 * 1000 // 上場企業マスタは頻繁には変わらないため12時間キャッシュ

/** 上場銘柄マスタ(全銘柄)を取得する。結果はプロセス内に一定時間キャッシュする。 */
export async function getListedInfo(): Promise<ListedInfo[]> {
  if (listedInfoCache && Date.now() - listedInfoCache.fetchedAt < LISTED_INFO_TTL_MS) {
    return listedInfoCache.data
  }
  const data = await jquantsGet<{ info: ListedInfo[] }>('/listed/info')
  listedInfoCache = { data: data.info, fetchedAt: Date.now() }
  return data.info
}

export async function findListedInfo(code: string): Promise<ListedInfo | undefined> {
  const all = await getListedInfo()
  const five = toFiveDigitCode(code)
  return all.find((c) => c.Code === code || c.Code === five)
}

export function searchListedInfo(all: ListedInfo[], query: string, limit = 8): ListedInfo[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return all
    .filter(
      (c) =>
        toFourDigitCode(c.Code).includes(q) ||
        c.CompanyName.toLowerCase().includes(q) ||
        (c.Sector33CodeName ?? '').toLowerCase().includes(q),
    )
    .slice(0, limit)
}

export interface DailyQuote {
  Date: string
  Code: string
  Open: number | null
  High: number | null
  Low: number | null
  Close: number | null
  Volume: number | null
  AdjustmentOpen: number | null
  AdjustmentHigh: number | null
  AdjustmentLow: number | null
  AdjustmentClose: number | null
  AdjustmentVolume: number | null
}

/** 指定銘柄の日足株価を取得する(無料プランは直近12週間程度遅延)。 */
export async function getDailyQuotes(code: string, from?: string, to?: string): Promise<DailyQuote[]> {
  const data = await jquantsGet<{ daily_quotes: DailyQuote[] }>('/prices/daily_quotes', {
    code,
    from,
    to,
  })
  return data.daily_quotes
}

export interface FinancialStatement {
  DisclosedDate: string
  TypeOfDocument: string
  NetSales?: string
  OperatingProfit?: string
  Profit?: string
  EarningsPerShare?: string
  BookValuePerShare?: string
  Equity?: string
  TotalAssets?: string
}

/** 指定銘柄の決算短信サマリ(直近分含む)を取得する。 */
export async function getFinancialStatements(code: string): Promise<FinancialStatement[]> {
  const data = await jquantsGet<{ statements: FinancialStatement[] }>('/fins/statements', { code })
  return data.statements
}

/** 配当・株式分割調整後の値(Adjustment*)を優先してOHLC系列に変換する。 */
export function toOhlcSeries(quotes: DailyQuote[]): OHLC[] {
  return quotes
    .filter((q) => q.AdjustmentClose != null || q.Close != null)
    .map((q) => ({
      date: q.Date,
      open: (q.AdjustmentOpen ?? q.Open ?? q.AdjustmentClose ?? q.Close) as number,
      high: (q.AdjustmentHigh ?? q.High ?? q.AdjustmentClose ?? q.Close) as number,
      low: (q.AdjustmentLow ?? q.Low ?? q.AdjustmentClose ?? q.Close) as number,
      close: (q.AdjustmentClose ?? q.Close) as number,
      volume: q.AdjustmentVolume ?? q.Volume ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** 統計計算に十分な期間を確保するため、デフォルトで直近2年分の日付範囲を返す。 */
export function defaultQuoteRange(years = 2): { from: string; to: string } {
  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - years)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { from: fmt(from), to: fmt(to) }
}

export function isJQuantsConfigured(): boolean {
  return Boolean(
    process.env.JQUANTS_REFRESH_TOKEN ||
      (process.env.JQUANTS_MAIL_ADDRESS && process.env.JQUANTS_PASSWORD),
  )
}
