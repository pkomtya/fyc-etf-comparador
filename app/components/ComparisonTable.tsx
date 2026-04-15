"use client";
import { CRITERIA, CATEGORIES } from "@/lib/criteria";
import { bestByCriterion, computeScores } from "@/lib/scoring";
import type { ETFData } from "@/lib/fmp";

type CellOverrides = Record<string, Record<string, string>>; // ticker → criterionKey → raw string

interface Props {
  etfs: ETFData[];
  cellOverrides?: CellOverrides;
  onCellOverride?: (ticker: string, key: string, value: string) => void;
}

export default function ComparisonTable({ etfs, cellOverrides = {}, onCellOverride }: Props) {
  if (etfs.length === 0) return null;
  const scores = computeScores(etfs, cellOverrides);

  return (
    <div className="overflow-x-auto border border-black/10 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-black text-brand-yellow">
            <th className="text-left px-4 py-3 font-semibold w-48">Criterio</th>
            {etfs.map((e) => (
              <th key={e.ticker} className="text-center px-4 py-3 font-semibold">
                {e.ticker}
                <div className="text-xs opacity-70 font-normal">{e.name}</div>
                {e.price > 0 && (
                  <div className="text-xs font-normal mt-0.5">
                    ${e.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat) => (
            <CategoryGroup
              key={cat}
              category={cat}
              etfs={etfs}
              cellOverrides={cellOverrides}
              onCellOverride={onCellOverride}
            />
          ))}
          <tr className="bg-brand-yellow font-bold">
            <td className="px-4 py-3">Puntaje global /100</td>
            {etfs.map((e) => (
              <td key={e.ticker} className="px-4 py-3 text-center">
                {scores[e.ticker]}/100
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryGroup({
  category,
  etfs,
  cellOverrides,
  onCellOverride,
}: {
  category: string;
  etfs: ETFData[];
  cellOverrides: CellOverrides;
  onCellOverride?: (ticker: string, key: string, value: string) => void;
}) {
  const rows = CRITERIA.filter((c) => c.category === category);
  return (
    <>
      <tr className="bg-brand-cream">
        <td
          colSpan={etfs.length + 1}
          className="px-4 py-2 font-semibold text-black/70 text-xs uppercase tracking-wide"
        >
          {category}
        </td>
      </tr>
      {rows.map((c) => {
        const bestTicker = bestByCriterion(etfs, c.key, cellOverrides);
        return (
          <tr key={c.key} className="border-t border-black/5">
            <td className="px-4 py-2 text-black/80">{c.label}</td>
            {etfs.map((e) => {
              const raw = c.get(e);
              const isNull = raw == null || (typeof raw === "number" && isNaN(raw));
              const override = cellOverrides[e.ticker]?.[c.key] ?? "";
              const isBest = bestTicker === e.ticker;

              // Show inline input for null/boolean fields that are editable
              if (isNull && onCellOverride && c.direction !== "neutral") {
                return (
                  <td key={e.ticker} className="px-2 py-1 text-center">
                    <input
                      type="number"
                      value={override}
                      onChange={(ev) => onCellOverride(e.ticker, c.key, ev.target.value)}
                      placeholder="—"
                      className="w-20 text-center text-xs border border-black/20 rounded px-1 py-0.5 bg-white placeholder-black/30 focus:outline-none focus:border-black/50"
                    />
                  </td>
                );
              }

              return (
                <td
                  key={e.ticker}
                  className={`px-4 py-2 text-center ${
                    isBest ? "bg-brand-goodBg text-brand-goodFg font-semibold" : ""
                  }`}
                >
                  {c.format(raw)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
