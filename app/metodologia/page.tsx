export default function MetodologiaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Metodología del comparador</h1>
      <p className="text-black/60 mb-10">
        Explicación de cómo se obtiene y calcula cada dato que aparece en la tabla.
      </p>

      {/* Fuentes de datos */}
      <Section title="Fuentes de datos">
        <p className="mb-3">
          El comparador combina tres fuentes para cubrir los 21 criterios:
        </p>
        <table className="w-full text-sm border border-black/10 rounded-lg overflow-hidden mb-2">
          <thead>
            <tr className="bg-brand-black text-brand-yellow">
              <th className="text-left px-4 py-2">Fuente</th>
              <th className="text-left px-4 py-2">Qué datos aporta</th>
              <th className="text-left px-4 py-2">Costo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-black/5">
              <td className="px-4 py-2 font-medium">Yahoo Finance</td>
              <td className="px-4 py-2">Precios históricos diarios ajustados (6 años), volumen</td>
              <td className="px-4 py-2">Gratis, sin key</td>
            </tr>
            <tr className="border-t border-black/5 bg-brand-cream">
              <td className="px-4 py-2 font-medium">FMP (Financial Modeling Prep)</td>
              <td className="px-4 py-2">Beta, último dividendo, AUM (capitalización), precio actual</td>
              <td className="px-4 py-2">Gratis (tier básico)</td>
            </tr>
            <tr className="border-t border-black/5">
              <td className="px-4 py-2 font-medium">Tabla estática interna</td>
              <td className="px-4 py-2">TER, índice replicado, número de posiciones, concentración Top 10, P/E Ratio, Tracking Difference, Ex-Dividend Date</td>
              <td className="px-4 py-2">Actualización manual ~1×/año</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-black/50">
          Los datos de precios se guardan en caché por 12 horas para evitar consultas excesivas a las APIs.
        </p>
      </Section>

      {/* Rendimientos */}
      <Section title="Rendimientos a 1, 3 y 5 años">
        <p className="mb-3">
          Se calculan usando el <strong>precio de cierre ajustado</strong> (<em>adjclose</em>) de Yahoo Finance,
          que incorpora dividendos y splits. Esto significa que el rendimiento reflejado asume que
          los dividendos se reinvierten automáticamente.
        </p>
        <p className="mb-3">
          Para encontrar el precio inicial se busca la fecha de cotización más cercana a exactamente
          1, 3 o 5 años calendario atrás (usando marcas de tiempo, no conteo de sesiones bursátiles).
          La fórmula es:
        </p>
        <FormulaBox>
          Rendimiento anualizado = (Precio hoy / Precio hace N años)^(1/N) − 1
        </FormulaBox>
        <Note>
          <strong>¿Por qué puede diferir de ETF.com o Yahoo Finanzas?</strong> Esas páginas usan
          precios NAV oficiales y fechas de corte exactas al cierre del mes. Nuestro cálculo usa
          precios de mercado diarios y la fecha calendario más cercana, lo que puede generar
          diferencias de ±2–4 puntos porcentuales.
        </Note>
      </Section>

      {/* Volatilidad */}
      <Section title="Volatilidad anual">
        <p className="mb-3">
          Mide qué tan bruscos son los movimientos de precio. Se calcula con los retornos
          logarítmicos diarios de los últimos 6 años:
        </p>
        <FormulaBox>
          Volatilidad = Desviación estándar(retornos diarios) × √252 × 100
        </FormulaBox>
        <p className="text-sm text-black/70">
          Se multiplica por √252 porque hay aproximadamente 252 sesiones bursátiles al año,
          lo que convierte la volatilidad diaria a anual.
        </p>
      </Section>

      {/* Sharpe */}
      <Section title="Sharpe Ratio (3 años)">
        <p className="mb-3">
          Indica cuánto rendimiento extra se obtiene por cada unidad de riesgo asumido.
          Un valor mayor es mejor.
        </p>
        <FormulaBox>
          Sharpe = (Rendimiento anual − Tasa libre de riesgo) / Volatilidad anual
        </FormulaBox>
        <p className="mb-2 text-sm text-black/70">
          Como tasa libre de riesgo usamos <strong>10% anual</strong>, que aproxima el
          rendimiento de los CETES mexicanos. Este valor es relevante para un inversionista
          mexicano que evalúa si conviene más invertir en ETFs o en CETES.
        </p>
        <Note>
          Un Sharpe mayor a 1.0 se considera bueno. Mayor a 2.0 es excelente.
          Si el Sharpe es negativo, el ETF no compensó el riesgo frente a los CETES.
        </Note>
      </Section>

      {/* Max Drawdown */}
      <Section title="Max Drawdown">
        <p className="mb-3">
          Es la caída máxima desde un pico hasta el valle más bajo durante todo el período analizado
          (6 años). Responde a la pregunta: <em>¿cuánto pude haber perdido en el peor momento?</em>
        </p>
        <FormulaBox>
          Max Drawdown = (Valle más bajo − Pico previo) / Pico previo × 100
        </FormulaBox>
        <p className="text-sm text-black/70">
          El valor es negativo (ej. −33%) porque representa una pérdida. En la tabla se muestra
          el valor negativo: quien tenga el número más cercano a cero tuvo menor caída, lo que es mejor.
        </p>
      </Section>

      {/* Beta */}
      <Section title="Beta 3 años">
        <p className="mb-3">
          Mide la sensibilidad del ETF respecto al mercado general (S&P 500 como referencia).
          Proviene directamente de FMP y se calcula sobre los últimos 3 años.
        </p>
        <ul className="text-sm text-black/70 space-y-1 list-disc list-inside">
          <li>Beta = 1.0 → se mueve igual que el mercado</li>
          <li>Beta &gt; 1.0 → más volátil que el mercado (ej. 1.2 = 20% más movimiento)</li>
          <li>Beta &lt; 1.0 → menos volátil que el mercado</li>
        </ul>
      </Section>

      {/* Liquidez */}
      <Section title="Volumen diario y AUM">
        <p className="mb-3">
          El <strong>volumen diario en USD</strong> se calcula multiplicando el volumen de acciones
          por el precio promedio del período, promediado sobre todos los días disponibles.
          Se expresa en millones (M) o miles de millones (B).
        </p>
        <p className="text-sm text-black/70">
          El <strong>AUM</strong> (Assets Under Management) proviene de FMP como la capitalización
          de mercado del ETF, que equivale al total de activos administrados.
        </p>
      </Section>

      {/* Datos estáticos */}
      <Section title="Datos de tabla estática (TER, P/E, Top 10, etc.)">
        <p className="mb-3">
          Algunos datos cambian poco y no requieren API en tiempo real. Se mantienen en una
          tabla interna que se actualiza manualmente aproximadamente una vez al año:
        </p>
        <ul className="text-sm text-black/70 space-y-1 list-disc list-inside mb-3">
          <li><strong>TER (Expense Ratio):</strong> comisión anual del ETF, publicada por el emisor</li>
          <li><strong>Índice replicado:</strong> nombre del benchmark que sigue el ETF</li>
          <li><strong>Número de posiciones:</strong> cuántos activos tiene en cartera</li>
          <li><strong>Concentración Top 10:</strong> qué porcentaje del ETF está en sus 10 mayores posiciones</li>
          <li><strong>P/E Ratio:</strong> relación precio/ganancia promedio ponderada de los activos del ETF</li>
          <li><strong>Tracking Difference:</strong> diferencia entre el rendimiento del ETF y su índice de referencia</li>
          <li><strong>Ex-Dividend Date:</strong> última fecha en que se debía ser tenedor para recibir el dividendo</li>
        </ul>
        <Note>
          Los ETFs que no están en la tabla interna mostrarán "—" en estos campos.
          Si comparas un ETF poco conocido y ves muchos "—", consulta su ficha técnica directamente
          en el sitio del emisor (iShares, Vanguard, Invesco, etc.).
        </Note>
      </Section>

      {/* Scoring */}
      <Section title="Puntaje global /100">
        <p className="mb-3">
          Cada criterio tiene un peso en puntos. El puntaje total máximo es 100.
          Para criterios numéricos, el mejor ETF en ese criterio recibe el puntaje completo
          y los demás reciben una fracción proporcional a qué tan cerca están del mejor.
        </p>
        <FormulaBox>
          Puntos = Peso × (1 − |valor − mejor| / rango)
        </FormulaBox>
        <p className="mb-4 text-sm text-black/70">
          Si todos los ETFs empatan en un criterio, todos reciben el puntaje completo.
          Si un ETF no tiene dato en un criterio, recibe 0 en ese criterio.
        </p>
        <table className="w-full text-sm border border-black/10 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-brand-black text-brand-yellow">
              <th className="text-left px-4 py-2">Categoría</th>
              <th className="text-right px-4 py-2">Puntos máx.</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Rendimiento", 20],
              ["Costo y eficiencia", 20],
              ["Riesgo", 20],
              ["Liquidez", 10],
              ["Composición", 8],
              ["Tipo y dividendos", 10],
              ["Valuación y riesgo ajustado", 10],
              ["Total", 98],
            ].map(([cat, pts], i) => (
              <tr
                key={i}
                className={`border-t border-black/5 ${cat === "Total" ? "bg-brand-yellow font-bold" : i % 2 === 0 ? "" : "bg-brand-cream"}`}
              >
                <td className="px-4 py-2">{cat}</td>
                <td className="px-4 py-2 text-right">{pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-black/50 mt-2">
          * El máximo real es 98 porque los criterios con peso 0 (Estilo, Cobertura cambiaria, Ex-Dividend Date)
          son informativos y no suman al puntaje.
        </p>
      </Section>

      {/* Disclaimer */}
      <Section title="Limitaciones y uso educativo">
        <Note>
          Este comparador es una herramienta <strong>educativa</strong> para estudiantes de Finanzas y Café.
          Los datos provienen de fuentes gratuitas no oficiales y pueden diferir de plataformas
          profesionales como Bloomberg, Morningstar o los propios emisores de ETFs.
          No debe usarse como única fuente para tomar decisiones de inversión reales.
        </Note>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-black/10">{title}</h2>
      {children}
    </section>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-cream border-l-4 border-brand-black px-4 py-3 my-3 font-mono text-sm rounded-r-md">
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-yellow/30 border border-brand-yellow rounded-md px-4 py-3 text-sm mt-3">
      {children}
    </div>
  );
}
