import { NextRequest, NextResponse } from 'next/server'

import {
  JQuantsNotConfiguredError,
  getListedInfo,
  isJQuantsConfigured,
  searchListedInfo,
  toFourDigitCode,
} from '@/lib/jquants'

export interface CompanySearchResult {
  code: string
  name: string
  market: string
  sector: string
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''

  if (!isJQuantsConfigured()) {
    return NextResponse.json({ configured: false, results: [] satisfies CompanySearchResult[] })
  }

  try {
    const all = await getListedInfo()
    const matches = searchListedInfo(all, q, 8)
    const results: CompanySearchResult[] = matches.map((c) => ({
      code: toFourDigitCode(c.Code),
      name: c.CompanyName,
      market: c.MarketCodeName ?? '',
      sector: c.Sector33CodeName ?? '',
    }))
    return NextResponse.json({ configured: true, results })
  } catch (error) {
    if (error instanceof JQuantsNotConfiguredError) {
      return NextResponse.json({ configured: false, results: [] satisfies CompanySearchResult[] })
    }
    console.error('company search failed', error)
    return NextResponse.json(
      { configured: true, results: [] satisfies CompanySearchResult[], error: '検索に失敗しました' },
      { status: 502 },
    )
  }
}
