import Link from 'next/link'
import { LineChart, Star } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LineChart className="size-4" />
          </span>
          <span>
            株式リサーチナビ
            <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground align-middle">
              DEMO
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/watchlist"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Star className="size-4" />
            <span className="hidden sm:inline">注目銘柄</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
