// src/services/MarketService.ts
// src/services/MarketService.ts
import type { PredictionAction, PredictionResponse, ChartPoint, MetricRecord } from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || ""; // ex: http://localhost:8000

// Apenas retorna a própria ação vinda do backend (BUY / SELL / HOLD)
function mapAction(action: PredictionAction): PredictionAction {
  return action;
}

export async function analyzeTicker(ticker: string): Promise<PredictionResponse> {
  const url = `${API_BASE}/predict/${encodeURIComponent(ticker)}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    const text = await resp.text().catch(() => null);
    throw new Error(`API error ${resp.status}${text ? `: ${text}` : ""}`);
  }

  const data = await resp.json();

  if (!data || data.error) {
    throw new Error(data?.error || "Invalid response from API");
  }

  // History normalization — mantém formato original { Date, Close }
  const rawHistory: Array<any> = data.history || [];
  const history: ChartPoint[] = rawHistory.map((h) => ({
    Date: String(h.Date ?? h.date ?? h.DateString ?? ""),
    Close: Number(h.Close ?? h.close ?? h.price ?? 0),
  }));

  // Metrics normalization — mantém formato original MetricRecord
  const rawMetricsArr: Array<any> = data.metrics || [];
  const metrics: MetricRecord[] = rawMetricsArr.map((m) => ({
    Date: String(m.Date ?? ""),
    Open: Number(m.Open ?? 0),
    High: Number(m.High ?? 0),
    Low: Number(m.Low ?? 0),
    Close: Number(m.Close ?? 0),
    Volume: Number(m.Volume ?? 0),
    return_1d: m.return_1d,
    ma7: m.ma7,
    ma21: m.ma21,
    rsi: m.rsi,
    volatility: m.volatility,
    return_next: m.return_next,
    target: m.target,
    ticker_code: m.ticker_code,
  }));

  // Final assembled response
  const cleanResponse: PredictionResponse = {
    ticker: String(data.ticker ?? ticker).toUpperCase(),
    prediction: Number(data.prediction ?? 1),
    action: mapAction(data.action as PredictionAction),
    message: String(data.message ?? ""),
    history: history.slice(-30), // garante apenas últimos 30 dias
    metrics,
  };

  return cleanResponse;
}
