"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ComparisonTable from "./components/ComparisonTable";
import ManualInputs, {
  ManualInputsMap,
  ManualOverrides,
  emptyOverride,
} from "./components/ManualInputs";
import type { ETFData } from "@/lib/fmp";

export default function HomePage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [tickers, setTickers] = useState<string[]>(["VOO", "QQQ", "VGT"]);
  const [input, setInput] = useState("");
  const [rawEtfs, setRawEtfs] = useState<ETFData[]>([]);   // data from API
  const [displayEtfs, setDisplayEtfs] = useState<ETFData[]>([]); // data shown in table (with manual overrides)
  const [manualInputs, setManualInputs] = useState<ManualInputsMap>({});
  const [cellOverrides, setCellOverrides] = useState<Record<string, Record<string, string>>>({}); // inline "—" overrides
  const [dirty, setDirty] = useState(false); // manual inputs changed but not yet applied
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setAuthReady(true);
    });
  }, [router]);

  // Restore comparison state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fyc-comparison");
      if (!saved) return;
      const { tickers: t, rawEtfs: r, displayEtfs: d, manualInputs: m, cellOverrides: co } = JSON.parse(saved);
      if (t) setTickers(t);
      if (r) setRawEtfs(r);
      if (d) setDisplayEtfs(d);
      if (m) setManualInputs(m);
      if (co) setCellOverrides(co);
    } catch {}
  }, []);

  // Persist comparison state to localStorage whenever it changes
  useEffect(() => {
    if (rawEtfs.length === 0) return;
    try {
      localStorage.setItem(
        "fyc-comparison",
        JSON.stringify({ tickers, rawEtfs, displayEtfs, manualInputs, cellOverrides })
      );
    } catch {}
  }, [tickers, rawEtfs, displayEtfs, manualInputs, cellOverrides]);

  function addTicker() {
    const t = input.trim().toUpperCase();
    if (!t) return;
    if (!tickers.includes(t)) setTickers([...tickers, t]);
    setInput("");
  }

  function removeTicker(t: string) {
    setTickers((prev) => prev.filter((x) => x !== t));
    setRawEtfs((prev) => prev.filter((e) => e.ticker !== t));
    setDisplayEtfs((prev) => prev.filter((e) => e.ticker !== t));
    setManualInputs((prev) => {
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
      setRawEtfs(j.etfs);
      // Initialize manual inputs for new tickers
      setManualInputs((prev) => {
        const next = { ...prev };
        for (const etf of j.etfs) {
          if (!next[etf.ticker]) next[etf.ticker] = emptyOverride();
        }
        return next;
      });
      // Apply any existing manual overrides immediately
      setDisplayEtfs(applyOverrides(j.etfs, manualInputs));
      setDirty(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Merge manual overrides into ETF data
  function applyOverrides(etfs: ETFData[], overrides: ManualInputsMap): ETFData[] {
    return etfs.map((etf) => {
      const o: ManualOverrides | undefined = overrides[etf.ticker];
      if (!o) return etf;
      return {
        ...etf,
        spreadBidAsk: o.spreadBidAsk !== "" ? parseFloat(o.spreadBidAsk) : etf.spreadBidAsk,
        trackingDifference:
          o.trackingDifference !== "" ? parseFloat(o.trackingDifference) : etf.trackingDifference,
        currencyHedged: o.currencyHedged,
      };
    });
  }

  function handleManualChange(
    ticker: string,
    field: keyof ManualOverrides,
    value: string | boolean
  ) {
    setManualInputs((prev) => ({
      ...prev,
      [ticker]: { ...(prev[ticker] || emptyOverride()), [field]: value },
    }));
    setDirty(true);
  }

  function recalculate() {
    setDisplayEtfs(applyOverrides(rawEtfs, manualInputs));
    setDirty(false);
  }

  function handleCellOverride(ticker: string, key: string, value: string) {
    setCellOverrides((prev) => ({
      ...prev,
      [ticker]: { ...(prev[ticker] || {}), [key]: value },
    }));
  }

  if (!authReady) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Comparador de ETF</h1>
      <p className="text-black/60 mb-6">
        Agrega tickers y compáralos en múltiples criterios.
      </p>

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
        etfs={displayEtfs}
        cellOverrides={cellOverrides}
        onCellOverride={handleCellOverride}
      />

      {/* Manual inputs section */}
      {rawEtfs.length > 0 && (
        <ManualInputs
          tickers={rawEtfs.map((e) => e.ticker)}
          values={manualInputs}
          onChange={handleManualChange}
          onRecalculate={recalculate}
          dirty={dirty}
        />
      )}
    </div>
  );
}
