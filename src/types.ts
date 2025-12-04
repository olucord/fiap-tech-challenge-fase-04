// =============================================
// API Types for FastAPI Stock Predictor
// =============================================

// Action returned by the backend
export enum PredictionAction {
  BUY = "BUY",
  HOLD = "HOLD",
  SELL = "SELL"
}

// Single point of history: date + price
export interface ChartPoint {
  Date: string;   // ex: "2025-01-20"
  Close: number;  // price
}

// Raw metric returned by backend (generic)
export interface MetricRecord {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  return_1d?: number;
  ma7?: number;
  ma21?: number;
  rsi?: number;
  volatility?: number;
  return_next?: number;
  target?: number;
  ticker_code?: number;
}

// Full API response
export interface PredictionResponse {
  ticker: string;
  prediction: number; // 0 = SELL, 1 = HOLD, 2 = BUY
  action: PredictionAction;
  message: string;

  history: ChartPoint[];       // Last 30 days of raw prices
  metrics: MetricRecord[];     // Last rows of the metrics dataframe
}
