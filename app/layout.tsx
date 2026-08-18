import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: '株式リサーチナビ(デモ) | 銘柄統計トレンドリサーチツール',
  description:
    '日本株の銘柄情報・IR要約・統計的な値動き傾向を一覧できるリサーチ支援ツールのデモ版です。表示データはすべてサンプルであり、投資助言ではありません。',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`light ${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} bg-background`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  )
}
