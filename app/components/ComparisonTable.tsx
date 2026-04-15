"use client";
import { CRITERIA, CATEGORIES } from "@/lib/criteria";
import { bestByCriterion, computeScores } from "@/lib/scoring";
import type { ETFData } from "@/lib/fmp";

export default function ComparisonTable({ etfs }: { etfs: ETFData[] }) {
  if (etfs.length === 0) return null;
  const scores = computeScores(etfs);

  return (
    <div className="overflow-x-auto border border-black/10 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-black text-brand-yellow">
            <th className="text-left px-4 py-3 font-semibold">Criterio</th>
            {etfs.map((e) => (
              <th key={e.ticker} className="text-left px-4 py-3 font-semibold">
                {e.ticker}
                <div className="text-xs opacity-70 font-normal">{e.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat) => (
            <CategoryGroup key={cat} category={cat} etfs={etfs} />
          ))}
          <tr className="bg-brand-yellow font-bold">
            <td className="px-4 py-3">Puntaje global /100</td>
            {etfs.map((e) => (
              <td key={e.ticker} className="px-4 py-3">
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
}: {
  category: string;
  etfs: ETFData[];
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
        const bestTicker = bestByCriterion(etfs, c.key);
        return (
          <tr key={c.key} className="border-t border-black/5">
            <td className="px-4 py-2 text-black/80">{c.label}</td>
            {etfs.map((e) => {
              const raw = c.get(e);
              const isBest = bestTicker === e.ticker;
              return (
                <td
                  key={e.ticker}
                  className={`px-4 py-2 ${
                    isBest
                      ? "bg-brand-goodBg text-brand-goodFg font-semibold"
                      : ""
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
