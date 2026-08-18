'use client'

import { Star } from 'lucide-react'

import { useWatchlist } from '@/hooks/use-watchlist'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WatchlistButton({ code }: { code: string }) {
  const { ready, isWatched, toggle } = useWatchlist()
  const watched = ready && isWatched(code)

  return (
    <Button
      variant={watched ? 'default' : 'outline'}
      size="sm"
      onClick={() => toggle(code)}
      disabled={!ready}
    >
      <Star className={cn('size-4', watched && 'fill-current')} />
      {watched ? '注目銘柄に登録済み' : '注目銘柄に登録'}
    </Button>
  )
}
