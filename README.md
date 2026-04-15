# Comparador ETF — Finanzas y Café

App Next.js 14 para comparar ETFs en 23 criterios educativos, pensada para inversores principiantes mexicanos.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Supabase (auth + cache de datos de ETF)
- Financial Modeling Prep (FMP) como fuente de datos
- Cálculos locales: volatilidad anual, Sharpe (CETES 10%), max drawdown

## Setup

```bash
npm install
cp .env.local.example .env.local
# Llena las 3 variables
npm run dev
```

### Variables de entorno
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
FMP_API_KEY=
```

### Supabase
Corre `supabase/schema.sql` en el editor SQL del proyecto. Crea las tablas `etf_cache` y `profiles` con RLS.

### Auth
Activa Email/Password en Supabase Auth. Los usuarios se registran desde `/login`.

## Estructura
- `app/page.tsx` — comparador principal (protegido)
- `app/login/page.tsx` — login / signup
- `app/glosario/page.tsx` — glosario con semáforos
- `app/api/etf/route.ts` — endpoint server-side que consulta FMP y cachea en Supabase
- `lib/fmp.ts` — integración con FMP
- `lib/calc.ts` — cálculos (volatilidad, Sharpe, drawdown, returns)
- `lib/criteria.ts` — los 23 criterios agrupados en 7 categorías
- `lib/scoring.ts` — puntaje /100 ponderado

## Notas
- La tasa libre de riesgo usada para Sharpe es 10% (CETES 28 días, aproximado).
- Tracking difference, spread, concentración top 10 y cobertura cambiaria pueden no estar siempre disponibles en free tier FMP — algunos son entradas manuales o nulos.
- Datos vía FMP · Solo fines educativos · Finanzas y Café
