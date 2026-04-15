import {
  annualVolatility,
  sharpeRatio,
  maxDrawdown,
} from "./calc";
import { getStaticData } from "./etf-static";

const CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
const FMP_BASE = "https://financialmodelingprep.com/stable";
const FMP_KEY = process.env.FMP_API_KEY!;

const UA = "Mozilla/5.0 (compatible; FyCComparador/1.0)";

async function yahooChart(ticker: string, range = "6y") {
  const url = `${CHART}/${encodeURIComponent(ticker)}?interval=1d&range=${range}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Yahoo ${ticker} ${res.status}`);
  const j = await res.json();
  if (j?.chart?.error) throw new Error(j.chart.error.description || "Yahoo error");
  const result = j?.chart?.result?.[0];
  if (!result) throw new Error(`Sin datos para ${ticker}`);
  return result;
}

async function fmpProfile(ticker: string): Promise<any> {
  try {
    const url = `${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const arr = await res.json();
    return arr?.[0] || {};
  } catch {
    return {};
  }
}

export type ETFData = {
  ticker: string;
  name: string;
  return1y: number;
  return3y: number;
  return5y: number;
  expenseRatio: number | null;
  trackingDifference: number | null;
  spreadBidAsk: number | null;
  volatility: number;
  beta3y: number | null;
  maxDrawdown: number;
  avgVolumeUsdM: number;
  aumUsdM: number | null;
  index: string;
  holdingsCount: number | null;
  top10Concentration: number | null;
  style: string;
  paysDividends: boolean;
  dividendYield: number | null;
  currencyHedged: boolean;
  sharpe3y: number;
  peRatio: number | null;
  exDividendDate: string | null;
};

export async function fetchETFData(ticker: string): Promise<ETFData> {
  const t = ticker.toUpperCase();

  // Fetch Yahoo chart + FMP profile in parallel
  const [chart, profile] = await Promise.all([
    yahooChart(t, "6y"),
    fmpProfile(t),
  ]);

  // ── Yahoo: build clean prices + timestamps ───────────────────────
  const meta = chart.meta || {};
  const quoteData = chart.indicators?.quote?.[0] || {};
  const adjcloseRaw: (number | null)[] =
    chart.indicators?.adjclose?.[0]?.adjclose || [];
  const volumesRaw: (number | null)[] = quoteData.volume || [];
  const timestamps: number[] = chart.timestamp || [];

  // Build aligned arrays filtering nulls
  const prices: number[] = [];
  const vols: number[] = [];
  const dates: number[] = [];

  for (let i = 0; i < adjcloseRaw.length; i++) {
    const p = adjcloseRaw[i];
    if (typeof p === "number" && isFinite(p) && p > 0) {
      prices.push(p);
      vols.push(typeof volumesRaw[i] === "number" ? (volumesRaw[i] as number) : 0);
      dates.push(timestamps[i] ?? 0);
    }
  }

  // ── Calculated metrics ──────────────────────────────────────────
  const vol = annualVolatility(prices);
  const sharpe = sharpeRatio(prices);
  const dd = maxDrawdown(prices);

  // Date-based returns: find price closest to N calendar years ago
  function returnByYears(years: number): number {
    if (prices.length < 2 || dates.length === 0) return 0;
    const targetMs = Date.now() - years * 365.25 * 24 * 3600 * 1000;
    let bestIdx = -1;
    let bestDiff = Infinity;
    for (let i = 0; i < dates.length; i++) {
      const diff = Math.abs(dates[i] * 1000 - targetMs);
      if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
    }
    if (bestIdx === -1) return 0;
    const startPrice = prices[bestIdx];
    const endPrice = prices[prices.length - 1];
    if (!startPrice || !endPrice) return 0;
    return (Math.pow(endPrice / startPrice, 1 / years) - 1) * 100;
  }

  const r1 = returnByYears(1);
  const r3 = returnByYears(3);
  const r5 = returnByYears(5);

  // Avg daily dollar volume (last 60 trading days)
  const lastN = 60;
  const tailVols = vols.slice(-lastN);
  const tailPrices = prices.slice(-lastN);
  const dollarVols = tailVols.map((v, i) => v * (tailPrices[i] || 0));
  const avgDollarVol =
    dollarVols.length > 0
      ? dollarVols.reduce((a, b) => a + b, 0) / dollarVols.length
      : 0;

  // ── FMP profile fields ──────────────────────────────────────────
  const currentPrice: number = profile.price || meta.regularMarketPrice || prices[prices.length - 1] || 0;
  const beta: number | null = typeof profile.beta === "number" ? profile.beta : null;
  const lastDiv: number = profile.lastDividend || 0;
  const aum: number | null = profile.marketCap ? profile.marketCap / 1e6 : null;
  const dividendYield: number | null =
    lastDiv > 0 && currentPrice > 0 ? (lastDiv / currentPrice) * 100 : null;
  const paysDividends = lastDiv > 0;
  const style: string = profile.sector || meta.instrumentType || "—";

  // ── Static data ─────────────────────────────────────────────────
  const staticData = getStaticData(t);
  const expenseRatio: number | null = staticData?.expenseRatio ?? null;
  const indexName: string = staticData?.index || meta.fullExchangeName || meta.exchangeName || "—";
  const holdingsCount: number | null = staticData?.holdingsCount ?? null;
  const top10Concentration: number | null = staticData?.top10Pct ?? null;
  const peRatio: number | null = staticData?.peRatio ?? null;
  const trackingDifference: number | null = staticData?.trackingDifference ?? null;

  return {
    ticker: t,
    name: profile.companyName || meta.longName || meta.shortName || t,
    return1y: r1,
    return3y: r3,
    return5y: r5,
    expenseRatio,
    spreadBidAsk: null,
    volatility: vol,
    beta3y: beta,
    maxDrawdown: dd,
    avgVolumeUsdM: avgDollarVol / 1e6,
    aumUsdM: aum,
    index: indexName,
    holdingsCount,
    top10Concentration,
    style,
    paysDividends,
    dividendYield,
    currencyHedged: false,
    sharpe3y: sharpe,
    peRatio,
    trackingDifference,
    exDividendDate: staticData?.exDivDate ?? null,
  };
}
