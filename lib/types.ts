export interface Fundamentals {
  marketCapOku: number
  per: number
  pbr: number
  roe: number
  dividendYieldPct: number
  revenueGrowthYoYPct: number
  opMarginPct: number
}

export interface RiskFactor {
  title: string
  description: string
  severity: '高' | '中' | '低'
}

export interface IrSummary {
  period: string
  title: string
  highlights: string[]
  summary: string
}

export interface ManagementComment {
  role: string
  quote: string
  context: string
}

export interface AnalystView {
  rating: '強気' | '中立' | '弱気'
  targetPrice: number
  comment: string
}

export interface NewsItem {
  title: string
  sourceType: string
  publishedAgoLabel: string
  summary: string
  tone: 'ポジティブ' | '中立' | 'ネガティブ'
}

export interface Company {
  code: string
  name: string
  kana: string
  market: 'プライム' | 'スタンダード' | 'グロース'
  sector: string
  description: string
  basePrice: number
  driftPctAnnual: number
  volPctAnnual: number
  fundamentals: Fundamentals
  growthPoints: string[]
  riskFactors: RiskFactor[]
  irSummary: IrSummary
  managementComments: ManagementComment[]
  analystViews: AnalystView[]
  news: NewsItem[]
}
