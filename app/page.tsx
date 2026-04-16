"use client";
import { useEffect, useState } from "react";
import ComparisonTable from "./components/ComparisonTable";
import type { ETFData } from "@/lib/fmp";

export default function HomePage() {
  const [tickers, setTickers] = useState<string[]>(["VOO", "QQQ", "VGT"]);
  const [input, setInput] = useState("");
  const [etfs, setEtfs] = useState<ETFData[]>([]);
  const [cellOverrides, setCellOverrides] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fyc-comparison");
      if (!saved) return;
      const { tickers: t, etfs: e, cellOverrides: co } = JSON.parse(saved);
      if (t) setTickers(t);
      if (e) setEtfs(e);
      if (co) setCellOverrides(co);
    } catch {}
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (etfs.length === 0) return;
    try {
      localStorage.setItem("fyc-comparison", JSON.stringify({ tickers, etfs, cellOverrides }));
    } catch {}
  }, [tickers, etfs, cellOverrides]);

  function addTicker() {
    const t = input.trim().toUpperCase();
    if (!t) return;
    if (!tickers.includes(t)) setTickers([...tickers, t]);
    setInput("");
  }

  function removeTicker(t: string) {
    setTickers((prev) => prev.filter((x) => x !== t));
    setEtfs((prev) => prev.filter((e) => e.ticker !== t));
    setCellOverrides((prev) => {
      const next = { ...prev };
      delete next[t];
      return next;
    });
  }

  async function compare() {
    if (tickers.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/etf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Error");
      setEtfs(j.etfs);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCellOverride(ticker: string, key: string, value: string) {
    setCellOverrides((prev) => ({
      ...prev,
      [ticker]: { ...(prev[ticker] || {}), [key]: value },
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Comparador de ETF</h1>
      <p className="text-black/60 mb-2">
        Agrega los tickers de los ETFs que quieras comparar y presiona <strong className="text-black">Comparar</strong>.
      </p>
      <div className="bg-brand-cream border border-black/10 rounded-lg px-4 py-3 mb-6 text-sm text-black/70 space-y-1">
        <p>📋 Algunos datos no están disponibles de forma automática y aparecerán como un campo editable en la tabla. Puedes buscarlos en:</p>
        <ul className="list-disc list-inside space-y-0.5 mt-1 ml-1">
          <li><strong className="text-black">ETF.com</strong> — Spread Bid-Ask, Tracking Difference, concentración Top 10</li>
          <li><strong className="text-black">Morningstar.com</strong> — P/E Ratio, estilo, composición</li>
          <li><strong className="text-black">Sitio del emisor</strong> (iShares.com, Vanguard.com, Invesco.com) — TER, holdings, Ex-Dividend Date</li>
        </ul>
        <p className="mt-1">El puntaje se actualiza automáticamente al ingresar los datos.</p>
      </div>

      {/* Ticker pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tickers.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-cream border border-black/10 text-sm"
          >
            {t}
            <button
              onClick={() => removeTicker(t)}
              className="text-black/50 hover:text-black"
              aria-label={`Quitar ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Ticker input */}
      <div className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTicker()}
          placeholder="Ej. SPY"
          className="px-3 py-2 rounded-md border border-black/30 bg-white"
        />
        <button
          onClick={addTicker}
          className="px-4 py-2 rounded-md border border-black bg-white font-medium"
        >
          Añadir
        </button>
        <button
          onClick={compare}
          disabled={loading || tickers.length === 0}
          className="px-5 py-2 rounded-md bg-brand-black text-brand-yellow font-semibold disabled:opacity-60"
        >
          {loading ? "Cargando…" : "Comparar"}
        </button>
      </div>

      {error && <p className="text-red-700 mb-4">{error}</p>}

      {/* Comparison table */}
      <ComparisonTable
        etfs={etfs}
        cellOverrides={cellOverrides}
        onCellOverride={handleCellOverride}
      />

      {etfs.length > 0 && (
        <p className="text-xs text-black/40 mt-3">
          Los campos con <span className="font-mono">—</span> se pueden rellenar manualmente — el puntaje se actualiza al instante.
        </p>
      )}
    </div>
  );
}
