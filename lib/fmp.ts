import {
  annualVolatility,
  sharpeRatio,
  maxDrawdown,
  annualizedReturn,
} from "./calc";

const BASE = "https://financialmodelingprep.com/api/v3";
const KEY = process.env.FMP_API_KEY!;

async function fmp<T = any>(path: string): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}apikey=${KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`FMP ${path} ${res.status}`);
  return res.json();
}

export type ETFData = {
  ticker: string;
  name: string;
  // Performance
  return1y: number;
  return3y: number;
  return5y: number;
  // Cost
  expenseRatio: number;
  trackingDifference: number | null;
  spreadBidAsk: number | null;
  // Risk
  volatility: number;
  beta3y: number | null;
  maxDrawdown: number;
  // Liquidity
  avgVolumeUsdM: number;
  aumUsdM: number;
  // Composition
  index: string;
  holdingsCount: number | null;
  top10Concentration: number | null;
  // Type & dividends
  style: string;
  paysDividends: boolean;
  dividendYield: number;
  currencyHedged: boolean; // manual
  // Valuation
  sharpe3y: number;
  peRatio: number | null;
  exDividendDate: string | null;
};

export async function fetchETFData(ticker: string): Promise<ETFData> {
  const t = ticker.toUpperCase();

  const [profileArr, quoteArr, etfInfoArr, histRaw] = await Promise.all([
    fmp<any[]>(`/profile/${t}`).catch(() => []),
    fmp<any[]>(`/quote/${t}`).catch(() => []),
    fmp<any[]>(`/etf-info?symbol=${t}`).catch(() => []),
    fmp<any>(`/historical-price-full/${t}?serietype=line&timeseries=1260`).catch(
      () => ({ historical: [] })
    ),
  ]);

  const profile = profileArr?.[0] || {};
  const quote = quoteArr?.[0] || {};
  const etfInfo = etfInfoArr?.[0] || {};

  // Historical: newest first → oldest first
  const hist: { date: string; close: number }[] = (histRaw?.historical || [])
    .slice()
    .reverse();
  const prices = hist.map((h) => h.close).filter((p) => typeof p === "number");

  const vol = annualVolatility(prices);
  const sharpe = sharpeRatio(prices);
  const dd = maxDrawdown(prices);
  const r1 = annualizedReturn(prices, 252);
  const r3 = annualizedReturn(prices, 252 * 3);
  const r5 = annualizedReturn(prices, 252 * 5);

  const aum = etfInfo.aum ?? profile.mktCap ?? 0;
  const avgVolDollar =
    (quote.avgVolume || profile.volAvg || 0) * (quote.price || 0);

  return {
    ticker: t,
    name: profile.companyName || etfInfo.name || t,
    return1y: r1,
    return3y: r3,
    return5y: r5,
    expenseRatio: etfInfo.expenseRatio ?? 0,
    trackingDifference: null,
    spreadBidAsk: null,
    volatility: vol,
    beta3y: profile.beta ?? null,
    maxDrawdown: dd,
    avgVolumeUsdM: avgVolDollar / 1e6,
    aumUsdM: (aum || 0) / 1e6,
    index: etfInfo.etfCompanyName || profile.industry || "—",
    holdingsCount: etfInfo.holdingsCount ?? null,
    top10Concentration: null,
    style: profile.sector || etfInfo.sectorsList?.[0]?.industry || "—",
    paysDividends: (profile.lastDiv || 0) > 0,
    dividendYield:
      profile.lastDiv && quote.price
        ? (profile.lastDiv / quote.price) * 100
        : 0,
    currencyHedged: false,
    sharpe3y: sharpe,
    peRatio: quote.pe ?? null,
    exDividendDate: profile.exDividendDate || null,
  };
}
