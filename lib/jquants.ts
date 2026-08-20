/**
 * J-Quants API v2 (JPX公式・株価データ) のクライアント。
 *
 * V2はV1のトークン方式(メール/パスワード → refreshToken → idToken)から
 * 「APIキー方式」に変更されている。ダッシュボードで発行したAPIキーを
 * `x-api-key` ヘッダーで送るだけでよく、有効期限も無い。
 * 環境変数 JQUANTS_API_KEY が未設定の場合は JQuantsNotConfiguredError を
 * 投げるので、呼び出し側でハンドリングして「実データ未設定」の表示に切り替えること。
 *
 * レスポンスは原則として `{ "data": [...], "pagination_key"?: "..." }` の形。
 * pagination_key が返る間は自動でページングして全件取得する(`jquantsGetAll`)。
 *
 * 参考: J-Quants Docs「V1 API から V2 API への変更点」
 * (このプロジェクトのサンドボックス環境からは外部ドキュメントを直接参照できないため、
 *  株価四本値(equities/bars/daily)以外のフィールド名は現時点で未確認です。
 *  上場銘柄一覧(equities/master)・財務情報(fins/summary)のフィールド名は
 *  V1と同じ想定で実装していますが、実クレデンシャルでの動作確認後に
 *  差異があれば調整してください。)
 */

import type { OHLC } from './price-series'

const BASE_URL = 'https://api.jquants.com/v2'

export class JQuantsNotConfiguredError extends Error {
  constructor() {
    super('JQUANTS_API_KEY is not configured')
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

export function isJQuantsConfigured(): boolean {
  return Boolean(process.env.JQUANTS_API_KEY)
}

interface JQuantsPage<T> {
  data: T[]
  pagination_key?: string
}

/** 1ページ分を取得する。 */
async function jquantsGetPage<T>(
  path: string,
  params: Record<string, string | undefined>,
): Promise<JQuantsPage<T>> {
  const apiKey = process.env.JQUANTS_API_KEY
  if (!apiKey) throw new JQuantsNotConfiguredError()

  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }
  const res = await fetch(url, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new JQuantsApiError(path, res.status)
  }
  return (await res.json()) as JQuantsPage<T>
}

/** pagination_key がある限りページングし、全件を配列で返す。 */
async function jquantsGetAll<T>(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T[]> {
  const results: T[] = []
  let paginationKey: string | undefined
  do {
    const page = await jquantsGetPage<T>(path, {
      ...params,
      pagination_key: paginationKey,
    })
    results.push(...page.data)
    paginationKey = page.pagination_key
  } while (paginationKey)
  return results
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
  const data = await jquantsGetAll<ListedInfo>('/equities/master')
  listedInfoCache = { data, fetchedAt: Date.now() }
  return data
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

/** V2の株価四本値(equities/bars/daily)は短縮カラム名で返る。 */
export interface DailyQuote {
  Date: string
  Code: string
  O: number | null
  H: number | null
  L: number | null
  C: number | null
  Vo: number | null
  AdjO: number | null
  AdjH: number | null
  AdjL: number | null
  AdjC: number | null
  AdjVo: number | null
}

/** 指定銘柄の日足株価を取得する(無料プランは直近12週間程度遅延)。 */
export async function getDailyQuotes(code: string, from?: string, to?: string): Promise<DailyQuote[]> {
  return jquantsGetAll<DailyQuote>('/equities/bars/daily', { code, from, to })
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
  return jquantsGetAll<FinancialStatement>('/fins/summary', { code })
}

/** 配当・株式分割調整後の値(Adj*)を優先してOHLC系列に変換する。 */
export function toOhlcSeries(quotes: DailyQuote[]): OHLC[] {
  return quotes
    .filter((q) => q.AdjC != null || q.C != null)
    .map((q) => ({
      date: q.Date,
      open: (q.AdjO ?? q.O ?? q.AdjC ?? q.C) as number,
      high: (q.AdjH ?? q.H ?? q.AdjC ?? q.C) as number,
      low: (q.AdjL ?? q.L ?? q.AdjC ?? q.C) as number,
      close: (q.AdjC ?? q.C) as number,
      volume: q.AdjVo ?? q.Vo ?? 0,
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
