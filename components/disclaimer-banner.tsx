import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'

export function DisclaimerBanner({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'compact'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex gap-2.5 rounded-xl border border-accent bg-accent/40 p-3.5 text-accent-foreground',
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      {variant === 'full' ? (
        <p className="text-xs leading-relaxed sm:text-sm">
          本ツールはデモ版です。掲出されている企業名・ニュース・IR要約・経営陣コメントは
          <strong className="font-semibold">すべて架空のサンプルデータ</strong>
          であり、実在の企業・人物とは一切関係ありません。チャートは実データではなく、統計計算の仕組みを示すための
          <strong className="font-semibold">合成(擬似)データ</strong>
          です。表示される「傾向確率」「参考レンジ」は過去データに基づく統計的な参考情報であり、将来の値動きを保証するものではなく、
          <strong className="font-semibold">投資助言・売買の推奨ではありません</strong>
          。投資判断はご自身の責任で行ってください。
        </p>
      ) : (
        <p className="text-xs leading-relaxed">
          サンプルデータによるデモ表示です。投資助言ではありません。
        </p>
      )}
    </div>
  )
}
