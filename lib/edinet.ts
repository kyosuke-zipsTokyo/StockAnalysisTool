/**
 * EDINET API v2 (金融庁公式・適時開示/有価証券報告書等の提出書類検索) のクライアント。
 *
 * EDINETは「銘柄コードで書類を検索する」APIを提供しておらず、"ある日に提出された
 * 書類の一覧"(/documents.json?date=...)を返すAPIのみが存在する。そのため、
 * 特定銘柄の開示一覧を作るには直近N日分の一覧を取得し、証券コード(secCode)で
 * 絞り込む必要がある。1日ごとの結果はプロセス内キャッシュに保持し、日をまたいで
 * 呼び出しても重複リクエストしないようにしている。
 *
 * APIキーはEDINET APIの利用者登録ページ(無料・即時発行)で取得する。
 * 参考: https://api.edinet-fsa.go.jp/api/auth/index.aspx
 * (このサンドボックス環境からは外部ドキュメントを直接参照できないため、
 *  フィールド名は既知の仕様に基づく実装です。)
 */

const BASE_URL = 'https://api.edinet-fsa.go.jp/api/v2'

export class EdinetNotConfiguredError extends Error {
  constructor() {
    super('EDINET_API_KEY is not configured')
    this.name = 'EdinetNotConfiguredError'
  }
}

export function isEdinetConfigured(): boolean {
  return Boolean(process.env.EDINET_API_KEY)
}

export interface EdinetDocument {
  docID: string
  edinetCode: string | null
  secCode: string | null
  filerName: string | null
  docDescription: string | null
  submitDateTime: string | null
  pdfFlag: string | null
  withdrawalStatus: string | null
}

interface DayCacheEntry {
  documents: EdinetDocument[]
  fetchedAt: number
}

const dayCache = new Map<string, DayCacheEntry>()
const DAY_CACHE_TTL_MS = 6 * 60 * 60 * 1000

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

async function getDocumentsForDate(date: string): Promise<EdinetDocument[]> {
  const cached = dayCache.get(date)
  if (cached && Date.now() - cached.fetchedAt < DAY_CACHE_TTL_MS) {
    return cached.documents
  }

  const apiKey = process.env.EDINET_API_KEY
  if (!apiKey) throw new EdinetNotConfiguredError()

  const url = new URL(`${BASE_URL}/documents.json`)
  url.searchParams.set('date', date)
  url.searchParams.set('type', '2')
  url.searchParams.set('Subscription-Key', apiKey)

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    // A single bad day shouldn't fail the whole lookback window.
    dayCache.set(date, { documents: [], fetchedAt: Date.now() })
    return []
  }
  const data = (await res.json()) as { results?: EdinetDocument[] }
  const documents = data.results ?? []
  dayCache.set(date, { documents, fetchedAt: Date.now() })
  return documents
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await fn(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

/**
 * 指定した4桁/5桁の証券コードについて、直近 lookbackDays 日分のEDINET提出書類から
 * 一致する開示を新しい順に返す。
 */
export async function findRecentDisclosures(
  code: string,
  lookbackDays = 30,
): Promise<EdinetDocument[]> {
  const code4 = code.length >= 4 ? code.slice(0, 4) : code

  const dates: string[] = []
  const cursor = new Date()
  for (let i = 0; i < lookbackDays; i++) {
    dates.push(formatDate(cursor))
    cursor.setDate(cursor.getDate() - 1)
  }

  const perDay = await mapWithConcurrency(dates, 6, (date) =>
    getDocumentsForDate(date).catch(() => []),
  )

  return perDay
    .flat()
    .filter((doc) => doc.secCode && doc.secCode.slice(0, 4) === code4)
    .filter((doc) => doc.withdrawalStatus !== '1')
    .sort((a, b) => (b.submitDateTime ?? '').localeCompare(a.submitDateTime ?? ''))
}
