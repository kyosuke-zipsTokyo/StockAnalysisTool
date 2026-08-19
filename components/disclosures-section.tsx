import { ExternalLink, FileText, Info } from 'lucide-react'

import { EdinetNotConfiguredError, findRecentDisclosures, isEdinetConfigured } from '@/lib/edinet'
import { Card, CardContent } from '@/components/ui/card'

function formatSubmitDateTime(value: string | null): string {
  if (!value) return ''
  // EDINETの submitDateTime は "YYYY-MM-DD HH:mm" 形式
  return value.replace('T', ' ').slice(0, 16)
}

export async function DisclosuresSection({ code }: { code: string }) {
  if (!isEdinetConfigured()) {
    return (
      <Card>
        <CardContent className="flex gap-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>EDINET APIキーが未設定のため、適時開示の実データを表示できません。</p>
        </CardContent>
      </Card>
    )
  }

  let documents
  try {
    documents = await findRecentDisclosures(code, 30)
  } catch (error) {
    if (error instanceof EdinetNotConfiguredError) {
      return (
        <Card>
          <CardContent className="flex gap-2.5 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>EDINET APIキーが未設定のため、適時開示の実データを表示できません。</p>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <CardContent className="flex gap-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>EDINETからの取得に失敗しました。時間をおいて再度お試しください。</p>
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex gap-2.5 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" />
          <p>直近30日以内にEDINETへ提出された書類は見つかりませんでした。</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {documents.map((doc) => (
        <Card key={doc.docID}>
          <CardContent className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">{formatSubmitDateTime(doc.submitDateTime)} 提出</p>
            <p className="text-sm font-medium">{doc.docDescription ?? doc.docID}</p>
            {doc.pdfFlag === '1' ? (
              <a
                href={`/api/edinet/document/${doc.docID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="size-3" />
                PDFを見る(EDINET)
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
