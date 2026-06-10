// AMADOBOOK — ReporteIngresos.tsx
// Tab "Ingresos" del reporte general
// Muestra: stats brutos/descuentos/netos + gráfica barras diarias + día top + métodos de pago

'use client'

export interface DailyBar {
  day: number      // 1–31
  amount: number
}

export interface PaymentMethodSplit {
  method: string   // "Efectivo" / "Tarjeta" / "Transferencia"
  pct: number
  color: string
}

export interface ReporteIngresosProps {
  grossRevenue: number
  discounts: number
  netRevenue: number
  grossChangePct: number
  discountsChangePct: number
  netChangePct: number
  dailyBars: DailyBar[]
  topDay: { label: string; amount: number; date: string }
  dailyAvg: number
  dailyAvgChangePct: number
  paymentMethods: PaymentMethodSplit[]
}

function BarChart({ data }: { data: DailyBar[] }) {
  const max = Math.max(...data.map(d => d.amount))
  const H = 100

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end',
      gap: 3, height: H,
    }}>
      {data.map((d, i) => {
        const barH = max > 0 ? Math.max((d.amount / max) * H, 4) : 4
        const isTop = d.amount === max
        return (
          <div
            key={i}
            title={`Día ${d.day}: $${d.amount}`}
            style={{
              flex: 1,
              height: barH,
              background: isTop ? '#FF6B1A' : '#E5E5E5',
              borderRadius: '3px 3px 0 0',
              transition: 'height 400ms ease',
              cursor: 'default',
            }}
          />
        )
      })}
    </div>
  )
}

function StatTriple({
  label, value, changePct, highlight = false,
}: { label: string; value: string; changePct: number; highlight?: boolean }) {
  const isPos = changePct >= 0
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontSize: 16, fontWeight: 800,
        color: highlight ? '#EF4444' : '#0D0D0D',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#999', margin: '3px 0 3px', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: isPos ? '#22C55E' : '#EF4444' }}>
        {isPos ? '+' : ''}{changePct}%
      </div>
    </div>
  )
}

export default function ReporteIngresos({
  grossRevenue, discounts, netRevenue,
  grossChangePct, discountsChangePct, netChangePct,
  dailyBars, topDay, dailyAvg, dailyAvgChangePct,
  paymentMethods,
}: ReporteIngresosProps) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Stats: bruto / descuentos / neto */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: '16px 12px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <StatTriple label="Ingresos brutos" value={`$${grossRevenue.toLocaleString()}`} changePct={grossChangePct} />
          <div style={{ width: 1, background: '#F0F0F0' }} />
          <StatTriple label="Descuentos" value={`-$${discounts.toLocaleString()}`} changePct={discountsChangePct} highlight />
          <div style={{ width: 1, background: '#F0F0F0' }} />
          <StatTriple label="Ingresos netos" value={`$${netRevenue.toLocaleString()}`} changePct={netChangePct} />
        </div>
      </div>

      {/* Gráfica de barras diarias */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Ingresos diarios
        </div>
        <BarChart data={dailyBars} />
        {/* Eje X */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {['1', '8', '15', '22', '29'].map(d => (
            <span key={d} style={{ fontSize: 10, color: '#CCC' }}>{d}</span>
          ))}
        </div>

        {/* Top day + promedio */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 16,
          borderTop: '1px solid #F5F5F5', paddingTop: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Día con más ingresos</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0D0D0D' }}>{topDay.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6B1A' }}>${topDay.amount.toLocaleString()}.00</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{topDay.date}</div>
          </div>
          <div style={{ width: 1, background: '#F5F5F5', margin: '0 16px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Promedio diario</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0D0D0D' }}>${dailyAvg.toFixed(2)}</div>
            <div style={{
              fontSize: 12, fontWeight: 600, marginTop: 2,
              color: dailyAvgChangePct >= 0 ? '#22C55E' : '#EF4444',
            }}>
              {dailyAvgChangePct >= 0 ? '↑' : '↓'} {Math.abs(dailyAvgChangePct)}%
            </div>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Métodos de pago
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paymentMethods.map((pm, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 6,
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#0D0D0D' }}>{pm.method}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{pm.pct}%</span>
              </div>
              <div style={{ height: 8, background: '#F0F0F0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pm.pct}%`,
                  background: pm.color, borderRadius: 999,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}
