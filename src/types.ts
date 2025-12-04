export enum RecommendationType {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD'
}

export interface ChartPoint {
  date: string;
  price: number;
}

export interface StockMetrics {
  peRatio: number;
  dividendYield: number;
  marketCap: string;
  volatility: string;
}

export interface MarketAnalysis {
  ticker: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  recommendation: RecommendationType;
  confidenceScore: number; // 0 to 100
  reasoning: string;
  metrics: StockMetrics;
  history: ChartPoint[];
}