import { CRITERIA } from "./criteria";
import type { ETFData } from "./fmp";

type CellOverrides = Record<string, Record<string, string>>;

// Resolve a criterion value, using cell overrides when the original is null
function resolveValue(
  c: (typeof CRITERIA)[number],
  etf: ETFData,
  overrides: CellOverrides
): number | string | boolean | null {
  const raw = c.get(etf);
  const isNull = raw == null || (typeof raw === "number" && isNaN(raw));
  if (!isNull) return raw;

  const override = overrides[etf.ticker]?.[c.key];
  if (!override || override.trim() === "") return null;

  if (c.numeric) {
    const n = parseFloat(override);
    return isNaN(n) ? null : n;
  }
  return override;
}

// Returns a map: ticker -> score /100 (sum of weighted proportional points)
export function computeScores(
  etfs: ETFData[],
  cellOverrides: CellOverrides = {}
): Record<string, number> {
  const scores: Record<string, number> = {};
  etfs.forEach((e) => (scores[e.ticker] = 0));

  for (const c of CRITERIA) {
    if (c.weight <= 0) continue;
    if (!c.numeric) {
      // paysDividends etc → boolean: true gets full points
      const truths = etfs.filter((e) => !!resolveValue(c, e, cellOverrides));
      if (truths.length === 0) continue;
      for (const e of etfs) {
        if (resolveValue(c, e, cellOverrides)) scores[e.ticker] += c.weight;
      }
      continue;
    }

    const values = etfs.map((e) => {
      const v = resolveValue(c, e, cellOverrides);
      return typeof v === "number" && isFinite(v) ? v : null;
    });
    const valid = values.filter((v): v is number => v != null);
    if (valid.length === 0) continue;

    const best = c.direction === "higher" ? Math.max(...valid) : Math.min(...valid);
    const worst = c.direction === "higher" ? Math.min(...valid) : Math.max(...valid);
    const range = Math.abs(best - worst);

    etfs.forEach((e, i) => {
      const v = values[i];
      if (v == null) return;
      if (range === 0) {
        scores[e.ticker] += c.weight;
        return;
      }
      const proportion = 1 - Math.abs(v - best) / range;
      scores[e.ticker] += c.weight * Math.max(0, Math.min(1, proportion));
    });
  }

  // Round
  Object.keys(scores).forEach((k) => (scores[k] = Math.round(scores[k])));
  return scores;
}

export function bestByCriterion(
  etfs: ETFData[],
  criterionKey: string,
  cellOverrides: CellOverrides = {}
): string | null {
  const c = CRITERIA.find((x) => x.key === criterionKey);
  if (!c || c.direction === "neutral") return null;

  if (!c.numeric) {
    const winner = etfs.find((e) => !!resolveValue(c, e, cellOverrides));
    return winner?.ticker || null;
  }

  let bestTicker: string | null = null;
  let bestVal: number | null = null;
  for (const e of etfs) {
    const v = resolveValue(c, e, cellOverrides);
    if (typeof v !== "number" || !isFinite(v)) continue;
    if (bestVal == null) {
      bestVal = v;
      bestTicker = e.ticker;
      continue;
    }
    if (c.direction === "higher" && v > bestVal) {
      bestVal = v;
      bestTicker = e.ticker;
    } else if (c.direction === "lower" && v < bestVal) {
      bestVal = v;
      bestTicker = e.ticker;
    }
  }
  return bestTicker;
}
