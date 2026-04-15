"use client";

type Light = "green" | "yellow" | "red";
type Threshold = { light: Light; label: string };

type GlossaryItem = {
  key: string;
  category: string;
  name: string;
  short: string;
  full: string;
  example: string;
  thresholds: Threshold[];
};

const ITEMS: GlossaryItem[] = [
  // ── Rendimiento ──────────────────────────────────────────────────
  {
    key: "return1y", category: "Rendimiento",
    name: "Rendimiento 1 año (%)",
    short: "Ganancia o pérdida anualizada del último año.",
    full: "Compara el precio (ajustado por dividendos) de hace un año con el precio actual. Es el indicador más usado para saber cómo le fue al ETF recientemente, aunque un solo año puede ser muy engañoso.",
    example: "VOO subió ~30% en el último año. Pero en 2022 bajó ~18%.",
    thresholds: [
      { light: "green", label: "Mayor es mejor" },
      { light: "yellow", label: "Entre 0% y promedio del mercado" },
      { light: "red", label: "Negativo" },
    ],
  },
  {
    key: "return3y", category: "Rendimiento",
    name: "Rendimiento 3 años (%)",
    short: "Rendimiento anualizado de los últimos 3 años.",
    full: "Promedia el rendimiento anual de los últimos 3 años. Es más estable que el de 1 año porque incluye distintos ciclos de mercado.",
    example: "Un ETF con 12% anualizado a 3 años dobló tu dinero en ese periodo.",
    thresholds: [
      { light: "green", label: "Mayor es mejor" },
      { light: "yellow", label: "0% a 8%" },
      { light: "red", label: "Negativo" },
    ],
  },
  {
    key: "return5y", category: "Rendimiento",
    name: "Rendimiento 5 años (%)",
    short: "Rendimiento anualizado de los últimos 5 años.",
    full: "El horizonte de 5 años es el mínimo recomendado para invertir en renta variable. Suaviza eventos puntuales y refleja mejor la tendencia de largo plazo.",
    example: "QQQ ha tenido ~18% anualizado a 5 años históricamente.",
    thresholds: [
      { light: "green", label: "Mayor es mejor" },
      { light: "yellow", label: "0% a 7%" },
      { light: "red", label: "Negativo" },
    ],
  },
  // ── Costo y eficiencia ────────────────────────────────────────────
  {
    key: "ter", category: "Costo y eficiencia",
    name: "TER / Expense Ratio (%)",
    short: "Costo anual que cobra el ETF por gestionarlo.",
    full: "Porcentaje anual que el ETF descuenta automáticamente del valor de tus acciones para cubrir costos de administración. Nunca lo ves como cargo directo — el ETF simplemente crece un poco menos. Menor TER = mayor rendimiento neto.",
    example: "VOO cobra 0.03%. En $100,000 pagas $30/año. Un fondo activo al 1.5% te costaría $1,500.",
    thresholds: [
      { light: "green", label: "< 0.20% — excelente" },
      { light: "yellow", label: "0.20% – 0.50% — aceptable" },
      { light: "red", label: "> 1.0% — busca alternativas" },
    ],
  },
  {
    key: "trackingDifference", category: "Costo y eficiencia",
    name: "Tracking Difference (%)",
    short: "Diferencia entre el rendimiento del ETF y su índice.",
    full: "Mide qué tan bien replica el ETF a su benchmark. Negativo (-0.01%) significa que el ETF le GANÓ al índice (por préstamo de valores). Es más informativo que el TER porque incluye todos los costos reales.",
    example: "VOO tiene TD de -0.01%: en la práctica rinde ligeramente MÁS que el S&P 500.",
    thresholds: [
      { light: "green", label: "< 0% (le gana al índice)" },
      { light: "yellow", label: "0% a 0.20%" },
      { light: "red", label: "> 0.50%" },
    ],
  },
  {
    key: "spreadBidAsk", category: "Costo y eficiencia",
    name: "Spread Bid-Ask (%)",
    short: "Costo oculto al comprar o vender.",
    full: "Diferencia porcentual entre el precio de compra (ask) y de venta (bid). Es un costo que pagas inmediatamente en cada operación. ETFs con alto volumen tienen spreads muy bajos.",
    example: "Spread 0.01% en $10,000 = pierdes $1 por operación. Spread 0.5% = pierdes $50.",
    thresholds: [
      { light: "green", label: "< 0.05% — muy líquido" },
      { light: "yellow", label: "0.05% – 0.50%" },
      { light: "red", label: "> 0.50% — costoso al operar" },
    ],
  },
  // ── Riesgo ────────────────────────────────────────────────────────
  {
    key: "volatility", category: "Riesgo",
    name: "Volatilidad anual (%)",
    short: "Cuánto oscila el precio del ETF en un año.",
    full: "Desviación estándar de los rendimientos diarios, anualizada × √252. Alta volatilidad = cambios bruscos frecuentes. Para inversores de largo plazo es tolerable; para conservadores puede ser estresante.",
    example: "VOO tiene ~16% de volatilidad: el precio oscila ±16% alrededor de su tendencia en un año típico.",
    thresholds: [
      { light: "green", label: "< 15% — tranquilo" },
      { light: "yellow", label: "15% – 25% — moderado" },
      { light: "red", label: "> 35% — muy agresivo" },
    ],
  },
  {
    key: "beta3y", category: "Riesgo",
    name: "Beta 3 años",
    short: "Qué tanto se mueve el ETF comparado con el mercado.",
    full: "Beta = 1.0 significa que el ETF se mueve igual que el S&P 500. Beta > 1.0 amplifica los movimientos. Beta < 1.0 los amortigua. No es bueno ni malo — depende de tu perfil de riesgo.",
    example: "VGT Beta ~1.1: si el mercado sube 10%, VGT tiende a subir 11%. Si baja 10%, baja ~11%.",
    thresholds: [
      { light: "green", label: "0.8 – 1.2 (cerca del mercado)" },
      { light: "yellow", label: "1.2 – 1.5 o 0.5 – 0.8" },
      { light: "red", label: "> 1.5 o < 0.5" },
    ],
  },
  {
    key: "maxDrawdown", category: "Riesgo",
    name: "Max Drawdown (%)",
    short: "La peor caída desde un máximo histórico.",
    full: "Caída máxima desde el punto más alto hasta el más bajo en el periodo analizado. Es la prueba de estómago más realista: ¿aguantarías ver tu inversión caer ese porcentaje sin vender?",
    example: "VOO tuvo Max Drawdown de ~-34% en marzo 2020 (COVID). Quien vendió ese mes, materializó esa pérdida.",
    thresholds: [
      { light: "green", label: "Mayor a -20%" },
      { light: "yellow", label: "-20% a -40%" },
      { light: "red", label: "Peor que -50%" },
    ],
  },
  // ── Liquidez ──────────────────────────────────────────────────────
  {
    key: "avgVolumeUsdM", category: "Liquidez",
    name: "Volumen diario USD",
    short: "Cuánto dinero se negocia en ese ETF cada día.",
    full: "Valor en dólares de las acciones compradas y vendidas en un día promedio. Volumen alto = puedes entrar y salir sin mover el precio y con spreads bajos.",
    example: "SPY tiene volumen de ~$30B diarios. Un ETF con $500K diarios puede tener spreads altos.",
    thresholds: [
      { light: "green", label: "> $1M diario" },
      { light: "yellow", label: "$100K – $1M diario" },
      { light: "red", label: "< $100K diario" },
    ],
  },
  {
    key: "aumUsdM", category: "Liquidez",
    name: "AUM (Activos bajo administración)",
    short: "Tamaño total del ETF en dólares.",
    full: "Valor total de todos los activos del ETF. ETFs grandes son más líquidos y tienen menor riesgo de cierre. Para principiantes es preferible invertir en ETFs grandes y establecidos.",
    example: "VOO tiene ~$580B en AUM. Un ETF con $20M en AUM tiene riesgo de que el emisor lo cierre.",
    thresholds: [
      { light: "green", label: "> $500M" },
      { light: "yellow", label: "$50M – $500M" },
      { light: "red", label: "< $50M" },
    ],
  },
  // ── Composición ───────────────────────────────────────────────────
  {
    key: "index", category: "Composición",
    name: "Índice que replica",
    short: "El benchmark que el ETF intenta seguir.",
    full: "Define exactamente qué compras cuando adquieres el ETF. Dos ETFs con el mismo índice son casi idénticos aunque tengan diferente ticker y emisor.",
    example: "VOO, IVV y SPY replican el mismo índice (S&P 500) pero los gestiona Vanguard, BlackRock y State Street.",
    thresholds: [
      { light: "green", label: "Índice amplio y conocido" },
      { light: "yellow", label: "Índice especializado o de nicho" },
      { light: "red", label: "Gestión activa sin benchmark claro" },
    ],
  },
  {
    key: "holdingsCount", category: "Composición",
    name: "Número de posiciones",
    short: "Cuántas empresas o activos tiene el ETF.",
    full: "Más posiciones = mayor diversificación, menor riesgo específico de una empresa. Menos posiciones = mayor concentración.",
    example: "VTI tiene ~3,700 empresas (casi toda la economía USA). QQQ tiene solo 101 empresas.",
    thresholds: [
      { light: "green", label: "> 100 posiciones" },
      { light: "yellow", label: "20 – 100 posiciones" },
      { light: "red", label: "< 20 posiciones" },
    ],
  },
  {
    key: "top10Concentration", category: "Composición",
    name: "Concentración Top 10 (%)",
    short: "Qué porcentaje del ETF está en sus 10 mayores posiciones.",
    full: "Indica cuánto influyen las 10 empresas más grandes. Si Apple representa 12% del ETF y cae 20%, el ETF cae ~2.4% solo por Apple.",
    example: "QQQ tiene ~51% en top 10. VTI tiene ~28% — mucho más distribuido.",
    thresholds: [
      { light: "green", label: "< 30% — bien diversificado" },
      { light: "yellow", label: "30% – 50%" },
      { light: "red", label: "> 60% — muy concentrado" },
    ],
  },
  // ── Tipo y dividendos ─────────────────────────────────────────────
  {
    key: "style", category: "Tipo y dividendos",
    name: "Estilo / Tipo",
    short: "Categoría de activos o enfoque del ETF.",
    full: "Clasifica el tipo de inversión: renta variable, renta fija, materias primas, bienes raíces, etc. Define el rol del ETF en tu portafolio.",
    example: "QQQ = Growth/Tech. BND = Renta fija. GLD = Materias primas. VYM = Dividendos.",
    thresholds: [
      { light: "green", label: "Categoría amplia y diversificada" },
      { light: "yellow", label: "Sector específico" },
      { light: "red", label: "Temático muy estrecho" },
    ],
  },
  {
    key: "paysDividends", category: "Tipo y dividendos",
    name: "¿Reparte dividendos?",
    short: "Si el ETF distribuye pagos en efectivo periódicamente.",
    full: "Los ETFs distribuidores pagan dividendos directo a tu cuenta. Para inversores mexicanos, cada pago genera un evento fiscal. Los acumuladores reinvierten automáticamente y son más eficientes fiscalmente.",
    example: "VOO paga ~$7/acción al año. QQQ paga muy poco porque sus empresas (tech) reinvierten sus ganancias.",
    thresholds: [
      { light: "green", label: "Depende de tu estrategia" },
      { light: "yellow", label: "Reparte dividendos (considera el impuesto)" },
      { light: "red", label: "N/A" },
    ],
  },
  {
    key: "dividendYield", category: "Tipo y dividendos",
    name: "Yield de dividendo (%)",
    short: "Rendimiento anual por dividendos sobre el precio actual.",
    full: "Cuánto pagaría el ETF en dividendos al año como porcentaje del precio. Un yield muy alto puede indicar que el precio cayó (rendimiento trampa) o que el ETF realmente genera mucho flujo.",
    example: "SCHD tiene yield ~3.5%. Sobre $100,000 invertidos recibirías ~$3,500 al año en dividendos.",
    thresholds: [
      { light: "green", label: "1% – 5% — sostenible" },
      { light: "yellow", label: "0% – 1% — poco dividendo" },
      { light: "red", label: "> 6% sin justificación — revisar" },
    ],
  },
  {
    key: "currencyHedged", category: "Tipo y dividendos",
    name: "Cobertura cambiaria",
    short: "Si el ETF protege contra la variación del tipo de cambio.",
    full: "Un ETF con cobertura (hedged) reduce el efecto USD/MXN. Sin cobertura, si el peso se aprecia, tus rendimientos en MXN bajan aunque el ETF suba en USD.",
    example: "Si invertiste en VOO y el peso se apreció 10%, tu rendimiento en MXN fue 10% menor al rendimiento en USD.",
    thresholds: [
      { light: "green", label: "Sin cobertura si confías en el USD largo plazo" },
      { light: "yellow", label: "Con cobertura si quieres estabilidad en MXN" },
      { light: "red", label: "N/A" },
    ],
  },
  // ── Valuación y riesgo ajustado ───────────────────────────────────
  {
    key: "sharpe3y", category: "Valuación y riesgo ajustado",
    name: "Sharpe Ratio 3 años",
    short: "Rendimiento ajustado al riesgo (CETES como referencia).",
    full: "Rendimiento extra sobre la tasa libre de riesgo (CETES 28d ≈ 10%) dividido entre la volatilidad. Un Sharpe alto = buen rendimiento sin asumir demasiado riesgo.",
    example: "Sharpe 1.2: por cada unidad de riesgo que asumiste, obtuviste 1.2 unidades de rendimiento extra sobre CETES.",
    thresholds: [
      { light: "green", label: "> 1.0 — excelente" },
      { light: "yellow", label: "0.5 – 1.0 — aceptable" },
      { light: "red", label: "< 0 — no compensó el riesgo vs CETES" },
    ],
  },
  {
    key: "peRatio", category: "Valuación y riesgo ajustado",
    name: "P/E Ratio",
    short: "Cuánto pagas por cada dólar de utilidad de las empresas.",
    full: "Precio sobre utilidades promedio ponderado del ETF. P/E bajo = empresas baratas vs ganancias. P/E alto = expectativas de crecimiento futuro. Compara siempre con el histórico del índice.",
    example: "P/E histórico del S&P 500 es ~16x. Actualmente ronda 24x, indicando prima de valoración.",
    thresholds: [
      { light: "green", label: "15x – 25x — valuación razonable" },
      { light: "yellow", label: "25x – 35x — caro pero justificable" },
      { light: "red", label: "> 35x — valuación muy exigente" },
    ],
  },
  {
    key: "exDividendDate", category: "Valuación y riesgo ajustado",
    name: "Ex-Dividend Date",
    short: "Fecha límite para tener derecho al próximo dividendo.",
    full: "Para recibir el próximo dividendo debes ser dueño del ETF ANTES de esta fecha. El precio del ETF normalmente baja un monto similar al dividendo en esa fecha.",
    example: "Si VOO tiene ex-date el 24 de marzo y compras el 25, no recibes el dividendo de ese trimestre.",
    thresholds: [
      { light: "green", label: "Fecha futura (aún puedes calificar)" },
      { light: "yellow", label: "Fecha pasada reciente" },
      { light: "red", label: "No aplica (ETF no paga dividendos)" },
    ],
  },
];

const CATEGORIES = [
  "Rendimiento",
  "Costo y eficiencia",
  "Riesgo",
  "Liquidez",
  "Composición",
  "Tipo y dividendos",
  "Valuación y riesgo ajustado",
];

const DOT: Record<Light, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

export default function GlosarioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Glosario</h1>
      <p className="text-black/60 mb-8">
        Qué significa cada criterio y qué valores considerar ideales.
      </p>

      {CATEGORIES.map((cat) => {
        const items = ITEMS.filter((i) => i.category === cat);
        return (
          <div key={cat} className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-3 pl-1">
              {cat}
            </h2>
            <div className="border border-black/10 rounded-xl overflow-hidden divide-y divide-black/5">
              {items.map((it) => (
                <div key={it.key} className="grid grid-cols-[220px_1fr] bg-white hover:bg-brand-cream/40 transition-colors">
                  {/* Left: name + semáforo */}
                  <div className="px-4 py-4 border-r border-black/5 flex flex-col justify-between gap-2">
                    <span className="font-semibold text-sm leading-snug">{it.name}</span>
                    <div className="flex gap-1.5">
                      {it.thresholds.map((t, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full ${DOT[t.light]}`}
                          title={t.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right: description + thresholds + example */}
                  <div className="px-4 py-4 text-sm space-y-2">
                    <p className="text-black/80">{it.full}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {it.thresholds.map((t, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs text-black/60">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${DOT[t.light]}`} />
                          {t.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-black/50 italic border-l-2 border-brand-yellow pl-2">
                      {it.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
