"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ComparisonTable from "./components/ComparisonTable";
import type { ETFData } from "@/lib/fmp";

export default function HomePage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [tickers, setTickers] = useState<string[]>(["VOO", "QQQ", "VGT"]);
  const [input, setInput] = useState("");
  const [etfs, setEtfs] = useState<ETFData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setAuthReady(true);
    });
  }, [router]);

  function addTicker() {
    const t = input.trim().toUpperCase();
    if (!t) return;
    if (!tickers.includes(t)) setTickers([...tickers, t]);
    setInput("");
  }

  function removeTicker(t: string) {
    setTickers(tickers.filter((x) => x !== t));
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

  if (!authReady) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Comparador de ETF</h1>
      <p className="text-black/60 mb-6">
        Agrega tickers y compáralos en 23 criterios.
      </p>

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

      <ComparisonTable etfs={etfs} />
    </div>
  );
}
