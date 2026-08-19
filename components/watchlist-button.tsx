'use client'

import { Star } from 'lucide-react'

import { useWatchlist } from '@/hooks/use-watchlist'
import type { WatchlistKind } from '@/lib/watchlist'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WatchlistButton({ kind, code }: { kind: WatchlistKind; code: string }) {
  const { ready, isWatched, toggle } = useWatchlist()
  const watched = ready && isWatched(kind, code)

  return (
    <Button
      variant={watched ? 'default' : 'outline'}
      size="sm"
      onClick={() => toggle(kind, code)}
      disabled={!ready}
    >
      <Star className={cn('size-4', watched && 'fill-current')} />
      {watched ? '注目銘柄に登録済み' : '注目銘柄に登録'}
    </Button>
  )
}
