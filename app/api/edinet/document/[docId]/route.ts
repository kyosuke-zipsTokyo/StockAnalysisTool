import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.edinet-fsa.go.jp/api/v2'

/**
 * EDINETの書類取得APIをサーバー側でプロキシする。
 * ブラウザに直接EDINETのAPIキーを渡さずに、PDFへのリンクをクライアントに提供するため。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> },
) {
  const { docId } = await params
  const apiKey = process.env.EDINET_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'EDINET_API_KEY is not configured' }, { status: 503 })
  }
  if (!/^[A-Za-z0-9]+$/.test(docId)) {
    return NextResponse.json({ error: 'invalid docId' }, { status: 400 })
  }

  const url = new URL(`${BASE_URL}/documents/${docId}`)
  url.searchParams.set('type', '2') // PDF
  url.searchParams.set('Subscription-Key', apiKey)

  const res = await fetch(url)
  if (!res.ok || !res.body) {
    return NextResponse.json({ error: 'document fetch failed' }, { status: 502 })
  }

  return new NextResponse(res.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${docId}.pdf"`,
    },
  })
}
