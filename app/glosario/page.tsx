"use client";
import { useState } from "react";

type Light = "green" | "yellow" | "red";
type Threshold = { light: Light; label: string };

type GlossaryItem = {
  key: string;
  name: string;
  short: string;
  full: string;
  example: string;
  thresholds: Threshold[];
};

const ITEMS: GlossaryItem[] = [
  {
    key: "ter",
    name: "TER / Expense Ratio",
    short: "Costo anual que cobra el ETF por gestionarlo.",
    full:
      "Es el porcentaje anual que el ETF descuenta automáticamente del valor de tus acciones por cubrir costos de administración. Menor TER = mayor rendimiento neto para ti.",
    example: "Si un ETF cuesta 0.03% y subió 10%, tu rendimiento real fue 9.97%.",
    thresholds: [
      { light: "green", label: "Ideal < 0.20%" },
      { light: "yellow", label: "Aceptable 0.20–0.50%" },
      { light: "red", label: "Alerta > 1.0%" },
    ],
  },
  {
    key: "vol",
    name: "Volatilidad anual",
    short: "Cuánto oscila el precio del ETF en un año.",
    full:
      "Se calcula con la desviación estándar de los rendimientos diarios, anualizada. Alta volatilidad significa cambios bruscos de precio — más riesgo emocional.",
    example: "Un ETF con 15% de volatilidad oscila ±15% al año típicamente.",
    thresholds: [
      { light: "green", label: "Ideal < 15%" },
      { light: "yellow", label: "Aceptable 15–25%" },
      { light: "red", label: "Alerta > 35%" },
    ],
  },
  {
    key: "beta",
    name: "Beta 3 años",
    short: "Qué tanto se mueve el ETF comparado con el mercado.",
    full:
      "Beta = 1 significa que se mueve igual que el mercado (S&P 500). Beta > 1 amplifica el mercado; Beta < 1 lo suaviza.",
    example: "Beta de 1.2 = si el mercado sube 10%, el ETF tiende a subir 12%.",
    thresholds: [
      { light: "green", label: "Cerca de 1.0" },
      { light: "yellow", label: "1.0–1.5" },
      { light: "red", label: "> 1.5" },
    ],
  },
  {
    key: "dd",
    name: "Max Drawdown",
    short: "La peor caída desde un máximo histórico.",
    full:
      "Mide cuánto podrías haber perdido si comprabas en el peor momento. Es una prueba de estómago: ¿aguantarías esta caída?",
    example: "Max Drawdown de -35% = en algún punto valió 35% menos que su pico.",
    thresholds: [
      { light: "green", label: "Mejor que -20%" },
      { light: "yellow", label: "-20% a -40%" },
      { light: "red", label: "Peor a -50%" },
    ],
  },
  {
    key: "aum",
    name: "AUM (Activos bajo administración)",
    short: "Tamaño total del ETF en USD.",
    full:
      "ETFs grandes suelen ser más líquidos, baratos y con menor riesgo de cierre. Evita ETFs muy pequeños si eres principiante.",
    example: "AUM de $50B = muy líquido y establecido.",
    thresholds: [
      { light: "green", label: "> $500M" },
      { light: "yellow", label: "$50M–500M" },
      { light: "red", label: "< $50M" },
    ],
  },
  {
    key: "sharpe",
    name: "Sharpe Ratio 3a",
    short: "Rendimiento ajustado al riesgo.",
    full:
      "Compara el rendimiento extra sobre la tasa libre de riesgo (CETES 28 días ≈ 10%) entre la volatilidad. Mayor Sharpe = mejor retorno por unidad de riesgo.",
    example: "Sharpe de 1.2 = bueno; de 0.3 = pobre para el riesgo asumido.",
    thresholds: [
      { light: "green", label: "> 1.0" },
      { light: "yellow", label: "0.5–1.0" },
      { light: "red", label: "< 0" },
    ],
  },
  {
    key: "pe",
    name: "P/E Ratio",
    short: "Cuánto pagas por cada dólar de utilidad.",
    full:
      "El precio sobre utilidades del conjunto de empresas dentro del ETF. Menor P/E = más barato; muy alto puede indicar sobrevaluación.",
    example: "P/E de 20x es normal; de 50x sugiere expectativas agresivas.",
    thresholds: [
      { light: "green", label: "15–25x" },
      { light: "yellow", label: "25–35x" },
      { light: "red", label: "> 35x" },
    ],
  },
  {
    key: "spread",
    name: "Spread Bid-Ask",
    short: "Costo oculto al comprar/vender.",
    full:
      "Diferencia entre el precio de compra y venta. Spreads altos te cuestan en cada operación.",
    example: "Spread de 0.02% es excelente; de 0.8% es caro.",
    thresholds: [
      { light: "green", label: "< 0.1%" },
      { light: "yellow", label: "0.1–0.5%" },
      { light: "red", label: "> 0.5%" },
    ],
  },
  {
    key: "vol$",
    name: "Volumen diario USD",
    short: "Qué tanto se negocia al día.",
    full:
      "Volumen alto = entras y sales fácil sin mover el precio. Crucial para órdenes grandes.",
    example: "Volumen de $500M diarios = muy líquido.",
    thresholds: [
      { light: "green", label: "> $1M" },
      { light: "yellow", label: "$100K–1M" },
      { light: "red", label: "< $100K" },
    ],
  },
  {
    key: "yield",
    name: "Yield de dividendo",
    short: "Rendimiento por dividendos.",
    full:
      "Porcentaje anual que recibirías en dividendos sobre el precio actual. Útil si buscas ingresos, pero un yield extremadamente alto puede ser señal de alerta.",
    example: "Yield de 3% en un ETF = $30 por cada $1,000 invertidos.",
    thresholds: [
      { light: "green", label: "1–5%" },
      { light: "yellow", label: "0–1%" },
      { light: "red", label: "No declarado" },
    ],
  },
];

const DOT: Record<Light, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

export default function GlosarioPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Glosario</h1>
      <p className="text-black/60 mb-6">
        Qué significa cada criterio y qué valores considerar ideales.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((it) => {
          const expanded = open === it.key;
          return (
            <div
              key={it.key}
              className="border border-black/10 rounded-xl bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpen(expanded ? null : it.key)}
                className="w-full text-left p-4 hover:bg-brand-cream"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">{it.name}</h2>
                  <div className="flex gap-1.5">
                    {it.thresholds.map((t, i) => (
                      <span
                        key={i}
                        className={`w-3 h-3 rounded-full ${DOT[t.light]}`}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-black/60 mt-1">{it.short}</p>
              </button>
              {expanded && (
                <div className="px-4 pb-4 text-sm space-y-3 border-t border-black/5">
                  <p>{it.full}</p>
                  <p className="italic text-black/70">Ejemplo: {it.example}</p>
                  <ul className="space-y-1">
                    {it.thresholds.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${DOT[t.light]}`} />
                        {t.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
