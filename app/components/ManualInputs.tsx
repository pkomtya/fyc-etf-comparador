"use client";

export type ManualOverrides = {
  spreadBidAsk: string;       // % as string, e.g. "0.05"
  trackingDifference: string; // % as string
  currencyHedged: boolean;
};

export type ManualInputsMap = Record<string, ManualOverrides>;

export function emptyOverride(): ManualOverrides {
  return { spreadBidAsk: "", trackingDifference: "", currencyHedged: false };
}

type Props = {
  tickers: string[];
  values: ManualInputsMap;
  onChange: (ticker: string, field: keyof ManualOverrides, value: string | boolean) => void;
  onRecalculate: () => void;
  dirty: boolean;
};

export default function ManualInputs({ tickers, values, onChange, onRecalculate, dirty }: Props) {
  if (tickers.length === 0) return null;

  return (
    <div className="mt-6 border border-black/10 rounded-xl overflow-hidden">
      <div className="bg-brand-cream px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm">Datos manuales</h2>
          <p className="text-xs text-black/60 mt-0.5">
            Ingresa estos valores desde tu broker o desde{" "}
            <a
              href="https://etfdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              etfdb.com
            </a>
            {" / "}
            <a
              href="https://etf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              etf.com
            </a>
            . No son en tiempo real, pero permiten comparar costos ocultos.
          </p>
        </div>
        {dirty && (
          <button
            onClick={onRecalculate}
            className="ml-4 shrink-0 px-4 py-2 rounded-md bg-brand-black text-brand-yellow text-sm font-semibold"
          >
            Recalcular ↻
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-black/10 bg-white">
              <th className="text-left px-4 py-2 font-medium text-black/60 w-56">Campo</th>
              {tickers.map((t) => (
                <th key={t} className="text-left px-4 py-2 font-semibold">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Spread Bid-Ask */}
            <tr className="border-t border-black/5">
              <td className="px-4 py-2 text-black/70">
                Spread Bid-Ask (%)
                <span className="ml-1 text-black/40 text-xs">¿Cuánto cuesta comprar/vender?</span>
              </td>
              {tickers.map((t) => (
                <td key={t} className="px-4 py-2">
                  <div className="relative w-28">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="ej. 0.01"
                      value={values[t]?.spreadBidAsk ?? ""}
                      onChange={(e) => onChange(t, "spreadBidAsk", e.target.value)}
                      className="w-full pl-2 pr-6 py-1.5 rounded border border-black/20 bg-white text-sm focus:outline-none focus:border-black"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 text-xs">%</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Tracking Difference */}
            <tr className="border-t border-black/5">
              <td className="px-4 py-2 text-black/70">
                Tracking Difference (%)
                <span className="ml-1 text-black/40 text-xs">¿Cuánto se desvía del índice?</span>
              </td>
              {tickers.map((t) => (
                <td key={t} className="px-4 py-2">
                  <div className="relative w-28">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="ej. -0.02"
                      value={values[t]?.trackingDifference ?? ""}
                      onChange={(e) => onChange(t, "trackingDifference", e.target.value)}
                      className="w-full pl-2 pr-6 py-1.5 rounded border border-black/20 bg-white text-sm focus:outline-none focus:border-black"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 text-xs">%</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Cobertura cambiaria */}
            <tr className="border-t border-black/5">
              <td className="px-4 py-2 text-black/70">
                Cobertura cambiaria
                <span className="ml-1 text-black/40 text-xs">¿Cubre riesgo USD/MXN?</span>
              </td>
              {tickers.map((t) => (
                <td key={t} className="px-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values[t]?.currencyHedged ?? false}
                      onChange={(e) => onChange(t, "currencyHedged", e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm">
                      {values[t]?.currencyHedged ? "Sí" : "No"}
                    </span>
                  </label>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {dirty && (
        <div className="px-4 py-3 bg-brand-yellow/30 border-t border-black/10 text-sm flex items-center justify-between">
          <span>Tienes datos manuales sin aplicar.</span>
          <button
            onClick={onRecalculate}
            className="px-4 py-1.5 rounded-md bg-brand-black text-brand-yellow text-sm font-semibold"
          >
            Recalcular ↻
          </button>
        </div>
      )}
    </div>
  );
}
