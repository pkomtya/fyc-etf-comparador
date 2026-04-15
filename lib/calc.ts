// Financial calculations from historical daily prices

export type Bar = { date: string; close: number };

// Annualized volatility of daily log returns
export function annualVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const rets: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    rets.push(Math.log(prices[i] / prices[i - 1]));
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance =
    rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1);
  const dailyStd = Math.sqrt(variance);
  return dailyStd * Math.sqrt(252) * 100;
}

// Annualized Sharpe ratio using Mexican CETES ~10% as risk-free
export function sharpeRatio(prices: number[], riskFree = 0.1): number {
  if (prices.length < 2) return 0;
  const rets: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    rets.push(prices[i] / prices[i - 1] - 1);
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance =
    rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1);
  const std = Math.sqrt(variance);
  const annReturn = mean * 252;
  const annStd = std * Math.sqrt(252);
  if (annStd === 0) return 0;
  return (annReturn - riskFree) / annStd;
}

// Max drawdown as negative percentage
export function maxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0;
  let peak = prices[0];
  let maxDd = 0;
  for (const p of prices) {
    if (p > peak) peak = p;
    const dd = (p - peak) / peak;
    if (dd < maxDd) maxDd = dd;
  }
  return maxDd * 100;
}

// Return over N days (approx: 252 = 1 yr)
export function periodReturn(prices: number[], days: number): number {
  if (prices.length < days + 1) return 0;
  const start = prices[prices.length - 1 - days];
  const end = prices[prices.length - 1];
  return ((end / start) - 1) * 100;
}

// Annualized return over N days
export function annualizedReturn(prices: number[], days: number): number {
  if (prices.length < days + 1) return 0;
  const start = prices[prices.length - 1 - days];
  const end = prices[prices.length - 1];
  const years = days / 252;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}
