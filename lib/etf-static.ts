// Static ETF metadata.
// Sources: ETF issuer websites (Vanguard, BlackRock, Invesco, State Street, Invesco, etc.)
//          and ETF.com published reports.
// Update frequency:
//   - expenseRatio: ~1x/year
//   - holdingsCount, top10Pct, peRatio: quarterly
//   - trackingDifference: annually (calendar-year TD from ETF.com)
// Last updated: April 2026.

export type StaticETF = {
  expenseRatio: number;              // Annual fee as decimal, e.g. 0.0003 = 0.03%
  index: string;                     // Benchmark index tracked
  holdingsCount: number;             // Approximate number of holdings
  top10Pct: number;                  // % of fund in top 10 holdings
  peRatio: number | null;            // Weighted avg P/E of holdings (trailing)
  trackingDifference: number | null; // Annual TD vs benchmark (negative = beat index)
  exDivDate: string | null;          // Most recent ex-dividend date (update quarterly)
};

export const ETF_STATIC: Record<string, StaticETF> = {
  // ── Broad US Market ────────────────────────────────────────────────
  // ── Broad US Market ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  //          expenseRatio   index                                     holdingsCount  top10Pct   peRatio   trackingDiff  exDivDate
  VOO:  { expenseRatio: 0.0003,   index: "S&P 500",                          holdingsCount: 505,   top10Pct: 35.9,  peRatio: 24.5, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  IVV:  { expenseRatio: 0.0003,   index: "S&P 500",                          holdingsCount: 505,   top10Pct: 35.9,  peRatio: 24.5, trackingDifference: -0.01, exDivDate: "2026-03-26" },
  SPY:  { expenseRatio: 0.000945, index: "S&P 500",                          holdingsCount: 503,   top10Pct: 35.7,  peRatio: 24.4, trackingDifference:  0.01, exDivDate: "2026-03-20" },
  SPLG: { expenseRatio: 0.0002,   index: "S&P 500",                          holdingsCount: 503,   top10Pct: 35.7,  peRatio: 24.4, trackingDifference: -0.02, exDivDate: "2026-03-24" },
  VTI:  { expenseRatio: 0.0003,   index: "CRSP US Total Market",             holdingsCount: 3700,  top10Pct: 30.1,  peRatio: 23.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  ITOT: { expenseRatio: 0.0003,   index: "S&P Total Market",                 holdingsCount: 3400,  top10Pct: 30.0,  peRatio: 23.7, trackingDifference: -0.01, exDivDate: "2026-03-26" },
  SCHB: { expenseRatio: 0.0003,   index: "Dow Jones Broad US",               holdingsCount: 2500,  top10Pct: 29.8,  peRatio: 23.6, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  // ── Growth / Tech ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  QQQ:  { expenseRatio: 0.002,    index: "NASDAQ-100",                       holdingsCount: 101,   top10Pct: 51.5,  peRatio: 31.8, trackingDifference:  0.05, exDivDate: "2026-03-24" },
  QQQM: { expenseRatio: 0.0015,   index: "NASDAQ-100",                       holdingsCount: 101,   top10Pct: 51.5,  peRatio: 31.8, trackingDifference:  0.00, exDivDate: "2026-03-24" },
  VGT:  { expenseRatio: 0.001,    index: "MSCI US IMI Info Tech 25/50",      holdingsCount: 316,   top10Pct: 61.2,  peRatio: 34.1, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  XLK:  { expenseRatio: 0.0009,   index: "S&P Technology Select Sector",     holdingsCount: 67,    top10Pct: 65.0,  peRatio: 34.8, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  FTEC: { expenseRatio: 0.0008,   index: "MSCI US IMI Info Tech 25/50",      holdingsCount: 316,   top10Pct: 61.0,  peRatio: 34.0, trackingDifference: -0.02, exDivDate: "2026-03-26" },
  IYW:  { expenseRatio: 0.004,    index: "Russell 1000 Technology RIC",      holdingsCount: 135,   top10Pct: 68.3,  peRatio: 35.5, trackingDifference:  0.14, exDivDate: "2026-03-26" },
  SOXX: { expenseRatio: 0.0035,   index: "ICE Semiconductor",                holdingsCount: 30,    top10Pct: 58.2,  peRatio: 28.4, trackingDifference:  0.04, exDivDate: "2026-03-26" },
  SMH:  { expenseRatio: 0.0035,   index: "MVIS US Listed Semiconductor 25",  holdingsCount: 26,    top10Pct: 60.1,  peRatio: 27.9, trackingDifference:  0.03, exDivDate: "2026-03-26" },
  ARKK: { expenseRatio: 0.0075,   index: "ARK Innovation (active)",          holdingsCount: 35,    top10Pct: 48.0,  peRatio: null, trackingDifference: null,  exDivDate: null         },
  // ── Small & Mid Cap ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  IWM:  { expenseRatio: 0.0019,   index: "Russell 2000",                     holdingsCount: 1980,  top10Pct:  4.2,  peRatio: 14.8, trackingDifference:  0.04, exDivDate: "2026-03-20" },
  VB:   { expenseRatio: 0.0005,   index: "CRSP US Small Cap",                holdingsCount: 1400,  top10Pct:  3.5,  peRatio: 15.2, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  IJR:  { expenseRatio: 0.0006,   index: "S&P SmallCap 600",                 holdingsCount: 603,   top10Pct:  5.1,  peRatio: 15.5, trackingDifference:  0.00, exDivDate: "2026-03-26" },
  VO:   { expenseRatio: 0.0004,   index: "CRSP US Mid Cap",                  holdingsCount: 390,   top10Pct:  9.2,  peRatio: 19.3, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  IJH:  { expenseRatio: 0.0005,   index: "S&P MidCap 400",                   holdingsCount: 400,   top10Pct:  8.8,  peRatio: 19.0, trackingDifference:  0.00, exDivDate: "2026-03-26" },
  // ── Value ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VTV:  { expenseRatio: 0.0004,   index: "CRSP US Large Cap Value",          holdingsCount: 345,   top10Pct: 22.0,  peRatio: 17.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  IVE:  { expenseRatio: 0.0018,   index: "S&P 500 Value",                    holdingsCount: 435,   top10Pct: 20.5,  peRatio: 17.5, trackingDifference:  0.02, exDivDate: "2026-03-26" },
  SCHV: { expenseRatio: 0.0004,   index: "Dow Jones US Large-Cap Value",     holdingsCount: 360,   top10Pct: 21.3,  peRatio: 17.6, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  // ── Growth ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VUG:  { expenseRatio: 0.0004,   index: "CRSP US Large Cap Growth",         holdingsCount: 183,   top10Pct: 52.8,  peRatio: 32.4, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  IVW:  { expenseRatio: 0.0018,   index: "S&P 500 Growth",                   holdingsCount: 238,   top10Pct: 50.2,  peRatio: 31.9, trackingDifference:  0.02, exDivDate: "2026-03-26" },
  SCHG: { expenseRatio: 0.0004,   index: "Dow Jones US Large-Cap Growth",    holdingsCount: 250,   top10Pct: 51.0,  peRatio: 32.1, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  // ── International Developed ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VEA:  { expenseRatio: 0.0005,   index: "FTSE Developed All Cap ex US",     holdingsCount: 3900,  top10Pct:  9.8,  peRatio: 14.2, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  EFA:  { expenseRatio: 0.0032,   index: "MSCI EAFE",                        holdingsCount: 799,   top10Pct: 11.2,  peRatio: 14.5, trackingDifference:  0.05, exDivDate: "2026-03-26" },
  IEFA: { expenseRatio: 0.0007,   index: "MSCI EAFE IMI",                    holdingsCount: 2900,  top10Pct: 10.5,  peRatio: 14.3, trackingDifference: -0.01, exDivDate: "2026-03-26" },
  SCHF: { expenseRatio: 0.0006,   index: "FTSE Developed ex US",             holdingsCount: 1560,  top10Pct: 10.0,  peRatio: 14.1, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  // ── Emerging Markets ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VWO:  { expenseRatio: 0.0008,   index: "FTSE Emerging Markets All Cap",    holdingsCount: 5900,  top10Pct: 24.5,  peRatio: 12.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  EEM:  { expenseRatio: 0.0068,   index: "MSCI Emerging Markets",            holdingsCount: 1216,  top10Pct: 26.2,  peRatio: 13.1, trackingDifference:  0.20, exDivDate: "2026-03-26" },
  IEMG: { expenseRatio: 0.0009,   index: "MSCI Emerging Markets IMI",        holdingsCount: 2850,  top10Pct: 25.0,  peRatio: 12.9, trackingDifference: -0.01, exDivDate: "2026-03-26" },
  // ── Dividends ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VYM:  { expenseRatio: 0.0006,   index: "FTSE High Dividend Yield",         holdingsCount: 559,   top10Pct: 24.3,  peRatio: 16.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  DVY:  { expenseRatio: 0.0038,   index: "Dow Jones Select Dividend",        holdingsCount: 100,   top10Pct: 19.5,  peRatio: 14.2, trackingDifference:  0.05, exDivDate: "2026-03-26" },
  SCHD: { expenseRatio: 0.0006,   index: "Dow Jones US Dividend 100",        holdingsCount: 100,   top10Pct: 40.5,  peRatio: 16.5, trackingDifference: -0.01, exDivDate: "2026-03-25" },
  HDV:  { expenseRatio: 0.0008,   index: "Morningstar Dividend Yield Focus", holdingsCount: 75,    top10Pct: 42.8,  peRatio: 15.9, trackingDifference:  0.01, exDivDate: "2026-03-26" },
  DGRO: { expenseRatio: 0.0008,   index: "Morningstar US Dividend Growth",   holdingsCount: 431,   top10Pct: 26.5,  peRatio: 19.2, trackingDifference: -0.01, exDivDate: "2026-03-26" },
  // ── Bonds ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  AGG:  { expenseRatio: 0.0003,   index: "Bloomberg US Aggregate Bond",      holdingsCount: 11000, top10Pct:  2.1,  peRatio: null, trackingDifference:  0.00, exDivDate: "2026-04-01" },
  BND:  { expenseRatio: 0.0003,   index: "Bloomberg US Aggregate Float Adj", holdingsCount: 10900, top10Pct:  2.0,  peRatio: null, trackingDifference: -0.01, exDivDate: "2026-04-01" },
  TLT:  { expenseRatio: 0.0015,   index: "ICE US Treasury 20+ Year",         holdingsCount: 39,    top10Pct: 46.2,  peRatio: null, trackingDifference:  0.01, exDivDate: "2026-04-01" },
  IEF:  { expenseRatio: 0.0015,   index: "ICE US Treasury 7-10 Year",        holdingsCount: 12,    top10Pct: 91.0,  peRatio: null, trackingDifference:  0.01, exDivDate: "2026-04-01" },
  SHY:  { expenseRatio: 0.0015,   index: "ICE US Treasury 1-3 Year",         holdingsCount: 85,    top10Pct: 31.5,  peRatio: null, trackingDifference:  0.00, exDivDate: "2026-04-01" },
  LQD:  { expenseRatio: 0.0014,   index: "Markit iBoxx USD Liquid IG",       holdingsCount: 2300,  top10Pct:  3.8,  peRatio: null, trackingDifference:  0.01, exDivDate: "2026-04-01" },
  HYG:  { expenseRatio: 0.0048,   index: "Markit iBoxx USD Liquid HY",       holdingsCount: 1250,  top10Pct:  4.5,  peRatio: null, trackingDifference:  0.08, exDivDate: "2026-04-01" },
  JNK:  { expenseRatio: 0.004,    index: "Bloomberg HY Bond",                holdingsCount: 1280,  top10Pct:  4.2,  peRatio: null, trackingDifference:  0.06, exDivDate: "2026-04-01" },
  VCIT: { expenseRatio: 0.0004,   index: "Bloomberg US Corp 5-10 Yr",        holdingsCount: 2400,  top10Pct:  3.5,  peRatio: null, trackingDifference:  0.00, exDivDate: "2026-04-01" },
  VCSH: { expenseRatio: 0.0004,   index: "Bloomberg US Corp 1-5 Yr",         holdingsCount: 2300,  top10Pct:  3.2,  peRatio: null, trackingDifference:  0.00, exDivDate: "2026-04-01" },
  // ── Sectors ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  XLF:  { expenseRatio: 0.0009,   index: "S&P Financial Select Sector",      holdingsCount: 73,    top10Pct: 52.3,  peRatio: 16.8, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLV:  { expenseRatio: 0.0009,   index: "S&P Health Care Select Sector",    holdingsCount: 63,    top10Pct: 47.5,  peRatio: 19.2, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLE:  { expenseRatio: 0.0009,   index: "S&P Energy Select Sector",         holdingsCount: 23,    top10Pct: 53.0,  peRatio: 12.5, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLI:  { expenseRatio: 0.0009,   index: "S&P Industrial Select Sector",     holdingsCount: 78,    top10Pct: 38.5,  peRatio: 22.5, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLU:  { expenseRatio: 0.0009,   index: "S&P Utilities Select Sector",      holdingsCount: 30,    top10Pct: 43.2,  peRatio: 18.3, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLP:  { expenseRatio: 0.0009,   index: "S&P Consumer Staples Select",      holdingsCount: 38,    top10Pct: 48.1,  peRatio: 20.4, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLY:  { expenseRatio: 0.0009,   index: "S&P Consumer Discretionary",       holdingsCount: 51,    top10Pct: 56.8,  peRatio: 26.2, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLB:  { expenseRatio: 0.0009,   index: "S&P Materials Select Sector",      holdingsCount: 28,    top10Pct: 44.0,  peRatio: 19.8, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  XLRE: { expenseRatio: 0.0009,   index: "S&P Real Estate Select Sector",    holdingsCount: 31,    top10Pct: 44.5,  peRatio: 36.5, trackingDifference: -0.01, exDivDate: "2026-03-20" },
  VNQ:  { expenseRatio: 0.0012,   index: "MSCI US IMI Real Estate 25/50",    holdingsCount: 165,   top10Pct: 42.0,  peRatio: 35.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  GLD:  { expenseRatio: 0.004,    index: "LBMA Gold Price PM",               holdingsCount: 1,     top10Pct: 100.0, peRatio: null, trackingDifference:  0.03, exDivDate: null         },
  IAU:  { expenseRatio: 0.0025,   index: "LBMA Gold Price PM",               holdingsCount: 1,     top10Pct: 100.0, peRatio: null, trackingDifference:  0.02, exDivDate: null         },
  SLV:  { expenseRatio: 0.005,    index: "LBMA Silver Price",                holdingsCount: 1,     top10Pct: 100.0, peRatio: null, trackingDifference:  0.04, exDivDate: null         },
  // ── Factor / Smart Beta ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  MTUM: { expenseRatio: 0.0015,   index: "MSCI USA Momentum SR",             holdingsCount: 126,   top10Pct: 38.5,  peRatio: 29.8, trackingDifference:  0.04, exDivDate: "2026-03-26" },
  USMV: { expenseRatio: 0.0015,   index: "MSCI USA Minimum Volatility",      holdingsCount: 186,   top10Pct: 18.5,  peRatio: 21.5, trackingDifference:  0.03, exDivDate: "2026-03-26" },
  QUAL: { expenseRatio: 0.0015,   index: "MSCI USA Sector Neutral Quality",  holdingsCount: 125,   top10Pct: 34.2,  peRatio: 27.5, trackingDifference:  0.03, exDivDate: "2026-03-26" },
  VLUE: { expenseRatio: 0.0015,   index: "MSCI USA Enhanced Value",          holdingsCount: 150,   top10Pct: 20.5,  peRatio: 14.8, trackingDifference:  0.04, exDivDate: "2026-03-26" },
  // ── All World ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  VT:   { expenseRatio: 0.0007,   index: "FTSE Global All Cap",              holdingsCount: 9800,  top10Pct: 18.5,  peRatio: 18.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  ACWI: { expenseRatio: 0.0032,   index: "MSCI ACWI",                        holdingsCount: 2400,  top10Pct: 19.5,  peRatio: 19.0, trackingDifference:  0.04, exDivDate: "2026-03-26" },
  VXUS: { expenseRatio: 0.0007,   index: "FTSE Global All Cap ex US",        holdingsCount: 8600,  top10Pct: 11.0,  peRatio: 13.8, trackingDifference: -0.01, exDivDate: "2026-03-24" },
  // ── Mexico / LatAm ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  EWW:  { expenseRatio: 0.005,    index: "MSCI Mexico IMI 25/50",            holdingsCount: 56,    top10Pct: 58.5,  peRatio: 10.5, trackingDifference:  0.12, exDivDate: "2026-03-26" },
  ILF:  { expenseRatio: 0.0048,   index: "S&P Latin America 40",             holdingsCount: 40,    top10Pct: 55.0,  peRatio: 9.8,  trackingDifference:  0.10, exDivDate: "2026-03-26" },
  FLN:  { expenseRatio: 0.0059,   index: "S&P Latin America 40",             holdingsCount: 40,    top10Pct: 55.0,  peRatio: 9.8,  trackingDifference:  0.12, exDivDate: "2026-03-26" },
};

export function getStaticData(ticker: string): StaticETF | null {
  return ETF_STATIC[ticker.toUpperCase()] ?? null;
}
