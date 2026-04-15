# Comparador ETF — Finanzas y Café

Proyecto educativo para comparar ETFs dirigido a inversores principiantes mexicanos.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (auth email/password + cache de datos ETF)
- Yahoo Finance API (gratis, sin key) — precios históricos
- FMP API (free tier) — beta, dividendos, AUM
- Tabla estática local — TER, índice, holdings, P/E, top10, tracking diff, ex-div date
- Deploy destino: Vercel

## Repositorio
https://github.com/pkomtya/fyc-etf-comparador

## Variables de entorno (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://mbjpojavasickaloubzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  (ver .env.local local)
FMP_API_KEY=5Xzwg9pBTj3rQA6Tl7GUbAuWlBfAV2Ef
```

## Correr en local
```bash
cd ~/Desktop/CLAUDE/fyc-etf-comparador
npm run dev
# Abre en http://localhost:3000 (o 3001 si el puerto está ocupado)
```

## Arquitectura clave

### Fuentes de datos (por qué cada una)
- **Yahoo Finance `/v8/finance/chart`** — precios históricos 6 años, gratis sin key. Usamos `adjclose` para calcular: rendimientos 1/3/5 años (por fecha calendario), volatilidad anualizada, Sharpe Ratio (CETES 10% como risk-free), Max Drawdown.
- **FMP `/stable/profile`** — beta, lastDividend, marketCap (= AUM para ETFs), price. Gratis.
- **`lib/etf-static.ts`** — ~80 ETFs populares con: expenseRatio, index, holdingsCount, top10Pct, peRatio, trackingDifference, exDivDate. Se actualiza manualmente ~1x/año.
- **Yahoo quoteSummary** — BLOQUEADO (requiere crumb/cookie, rate-limited). No usar.
- **FMP v3** — DESCONTINUADO desde ago 2025. No usar.

### Flujo de datos
1. Usuario ingresa tickers → `app/page.tsx`
2. POST `/api/etf` → `app/api/etf/route.ts`
3. Busca en caché Supabase (`etf_cache`, TTL 12h, versión `__v: 2`)
4. Si no hay caché: `lib/fmp.ts` → `fetchETFData()` llama Yahoo + FMP en paralelo
5. Resultado se guarda en caché y se devuelve al cliente
6. `app/page.tsx` muestra `ComparisonTable` + `ManualInputs`

### Datos manuales (feature especial)
- Campos que el usuario llena manualmente: **Spread Bid-Ask**, **Tracking Difference**, **Cobertura cambiaria**
- Componente: `app/components/ManualInputs.tsx`
- Botón **"Recalcular ↻"** fusiona manual + API y recalcula score
- Estado persiste en `localStorage` (clave `fyc-comparison`)

### Scoring /100
- `lib/scoring.ts` — ponderación por categoría, valor proporcional al mejor
- Pesos: Rendimiento 20pts, Costo 20pts, Riesgo 20pts, Liquidez 10pts, Composición 10pts, Dividendos 10pts, Valuación 10pts

## Diseño / Brand
- Amarillo: `#ffde59`, Negro: `#1a1a1a`, Crema: `#f5f2ec`
- Font: DM Sans (Google Fonts)
- Mejor valor por fila: fondo `#eaf5ea`, texto `#1a6e1a`
- Fila de score: fondo amarillo
- Topbar amarillo, botones con borde negro, activo = negro + texto amarillo

## Supabase
- Tabla `etf_cache`: ticker (PK), data JSONB, updated_at
- Tabla `profiles`: id UUID, email, created_at
- RLS activado, solo usuarios autenticados leen/escriben
- Auth: Email/Password, "Confirm email" DESACTIVADO para dev

## Estado actual (abril 2026)
### ✅ Funciona
- Login / signup / logout
- Comparador con 21 criterios en 7 categorías
- Tabla con mejor valor resaltado en verde
- Score /100 ponderado
- Cache en Supabase (12h TTL)
- Datos manuales + botón Recalcular
- Persistencia entre navegaciones (localStorage)
- Glosario con todos los criterios — layout columna izquierda/derecha siempre visible
- Formateo AUM/Volumen con comas ($1,457.5B)
- Cálculo de rendimientos por fecha calendario (no por índice de array)

### ⚠️ Limitaciones conocidas
- Spread Bid-Ask: manual únicamente (no hay API gratuita con datos en tiempo real)
- P/E, TER, top10, tracking diff, ex-div: tabla estática (actualizar trimestralmente)
- ETFs no listados en `etf-static.ts` muestran "—" en esos campos
- Yahoo Finance puede cambiar su API sin aviso (es no oficial)

### 📋 Pendientes posibles
- Push final a GitHub con los cambios del día
- Deploy a Vercel
- Agregar más ETFs a la tabla estática
- Posibilidad: upgrade a FMP Starter ($19/mes) para datos en tiempo real completos
- Posibilidad: calcular Beta vs SPY usando precios históricos (ya tenemos el dato de Yahoo)

## Archivos importantes
| Archivo | Qué hace |
|---|---|
| `lib/fmp.ts` | Fetch de datos (Yahoo + FMP), función principal `fetchETFData()` |
| `lib/etf-static.ts` | Tabla estática con ~80 ETFs |
| `lib/calc.ts` | Cálculos: volatilidad, Sharpe, drawdown, returns |
| `lib/criteria.ts` | Definición de los 21 criterios (label, format, get, weight) |
| `lib/scoring.ts` | Lógica de scoring /100 |
| `app/api/etf/route.ts` | API route: caché Supabase + fetch |
| `app/page.tsx` | Página principal del comparador |
| `app/components/ComparisonTable.tsx` | Tabla de comparación |
| `app/components/ManualInputs.tsx` | Sección de datos manuales |
| `app/glosario/page.tsx` | Glosario completo |
| `supabase/schema.sql` | Schema SQL para crear tablas en Supabase |
