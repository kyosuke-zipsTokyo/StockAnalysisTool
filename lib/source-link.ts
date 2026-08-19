/**
 * デモ用のプレースホルダーURLを生成するヘルパー。
 *
 * 掲載しているニュース・経営陣コメントはすべて架空のサンプルコンテンツのため、
 * 実在するメディア・企業のドメインにリンクすると「実際にその記事が存在する」
 * という誤解を招くおそれがあります。そのため、IANAが文書・プレースホルダー用途
 * として予約している example.com (RFC 2606) を使い、リンク自体は機能する形で
 * 「情報源リンクのUI・データ構造」を用意しています。実データ接続時にはこの関数の
 * 実装を差し替えるだけで、実際の記事URL(TDnet/EDINET/ニュースAPI等から取得したURL)
 * に置き換えられます。
 */
function shortHash(input: string): string {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

export function newsSourceUrl(companyCode: string, newsTitle: string): string {
  return `https://example.com/demo-news/${companyCode}-${shortHash(newsTitle)}`
}

export function managementCommentSourceUrl(companyCode: string, quote: string): string {
  return `https://example.com/demo-ir/${companyCode}-${shortHash(quote)}`
}
