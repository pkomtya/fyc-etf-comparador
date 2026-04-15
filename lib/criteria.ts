import type { ETFData } from "./fmp";

export type Direction = "higher" | "lower" | "neutral";

export type Criterion = {
  key: string;
  label: string;
  category: string;
  direction: Direction; // higher = better, lower = better
  format: (v: any) => string;
  get: (d: ETFData) => number | string | boolean | null;
  weight: number; // for scoring
  numeric: boolean;
};

const pct = (v: any) =>
  v == null || isNaN(Number(v)) ? "—" : `${Number(v).toFixed(2)}%`;
const num = (v: any) =>
  v == null || isNaN(Number(v)) ? "—" : Number(v).toFixed(2);
const money = (v: any) =>
  v == null || isNaN(Number(v)) ? "—" : `$${Number(v).toFixed(1)}M`;

export const CATEGORIES = [
  "Rendimiento",
  "Costo y eficiencia",
  "Riesgo",
  "Liquidez",
  "Composición",
  "Tipo y dividendos",
  "Valuación y riesgo ajustado",
];

export const CRITERIA: Criterion[] = [
  // Rendimiento (20)
  { key: "return1y", label: "Rend. 1 año (%)", category: "Rendimiento", direction: "higher", format: pct, get: (d) => d.return1y, weight: 8, numeric: true },
  { key: "return3y", label: "Rend. 3 años (%)", category: "Rendimiento", direction: "higher", format: pct, get: (d) => d.return3y, weight: 6, numeric: true },
  { key: "return5y", label: "Rend. 5 años (%)", category: "Rendimiento", direction: "higher", format: pct, get: (d) => d.return5y, weight: 6, numeric: true },

  // Costo (20)
  { key: "expenseRatio", label: "TER / Expense Ratio (%)", category: "Costo y eficiencia", direction: "lower", format: pct, get: (d) => d.expenseRatio * 100, weight: 10, numeric: true },
  { key: "trackingDifference", label: "Tracking Difference (%)", category: "Costo y eficiencia", direction: "lower", format: pct, get: (d) => d.trackingDifference, weight: 5, numeric: true },
  { key: "spreadBidAsk", label: "Spread Bid-Ask (%)", category: "Costo y eficiencia", direction: "lower", format: pct, get: (d) => d.spreadBidAsk, weight: 5, numeric: true },

  // Riesgo (20)
  { key: "volatility", label: "Volatilidad anual (%)", category: "Riesgo", direction: "lower", format: pct, get: (d) => d.volatility, weight: 8, numeric: true },
  { key: "beta3y", label: "Beta 3 años", category: "Riesgo", direction: "lower", format: num, get: (d) => d.beta3y, weight: 6, numeric: true },
  { key: "maxDrawdown", label: "Max Drawdown (%)", category: "Riesgo", direction: "higher", format: pct, get: (d) => d.maxDrawdown, weight: 6, numeric: true },

  // Liquidez (10)
  { key: "avgVolumeUsdM", label: "Volumen diario USD M", category: "Liquidez", direction: "higher", format: money, get: (d) => d.avgVolumeUsdM, weight: 5, numeric: true },
  { key: "aumUsdM", label: "AUM USD M", category: "Liquidez", direction: "higher", format: money, get: (d) => d.aumUsdM, weight: 5, numeric: true },

  // Composición (10)
  { key: "index", label: "Índice que replica", category: "Composición", direction: "neutral", format: (v) => v || "—", get: (d) => d.index, weight: 2, numeric: false },
  { key: "holdingsCount", label: "Nº de posiciones", category: "Composición", direction: "higher", format: num, get: (d) => d.holdingsCount, weight: 4, numeric: true },
  { key: "top10Concentration", label: "Concentración Top 10 (%)", category: "Composición", direction: "lower", format: pct, get: (d) => d.top10Concentration, weight: 4, numeric: true },

  // Dividendos (10)
  { key: "style", label: "Estilo", category: "Tipo y dividendos", direction: "neutral", format: (v) => v || "—", get: (d) => d.style, weight: 0, numeric: false },
  { key: "paysDividends", label: "¿Reparte dividendos?", category: "Tipo y dividendos", direction: "neutral", format: (v) => (v ? "Sí" : "No"), get: (d) => d.paysDividends, weight: 5, numeric: false },
  { key: "dividendYield", label: "Yield dividendo (%)", category: "Tipo y dividendos", direction: "higher", format: pct, get: (d) => d.dividendYield, weight: 5, numeric: true },
  { key: "currencyHedged", label: "Cobertura cambiaria", category: "Tipo y dividendos", direction: "neutral", format: (v) => (v ? "Sí" : "No"), get: (d) => d.currencyHedged, weight: 0, numeric: false },

  // Valuación (10)
  { key: "sharpe3y", label: "Sharpe Ratio 3a", category: "Valuación y riesgo ajustado", direction: "higher", format: num, get: (d) => d.sharpe3y, weight: 6, numeric: true },
  { key: "peRatio", label: "P/E Ratio", category: "Valuación y riesgo ajustado", direction: "lower", format: num, get: (d) => d.peRatio, weight: 4, numeric: true },
  { key: "exDividendDate", label: "Ex-Dividend Date", category: "Valuación y riesgo ajustado", direction: "neutral", format: (v) => v || "—", get: (d) => d.exDividendDate, weight: 0, numeric: false },
];
