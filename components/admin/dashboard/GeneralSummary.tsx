// AMADOBOOK — GeneralSummary.tsx
// Vista "Resumen general" del dashboard admin
// Métricas del mes: ingresos, citas completadas, nuevos clientes, canceladas
// Gráfica de barras de ingresos diarios + servicios más vendidos

'use client'

export interface MonthStat {
  label: string
  value: string        // "$12,450" / "128"
  changePct: number
  sparkline: number[]
  isPositive?: boolean // override automático del changePct
}

export interface DailyRevenue {
  day: number          // 1–31
  amount: number
}

export interface TopService {
  name: string
  pct: number          // 0–100
}

export interface GeneralSummaryProps {
  period: string                   // "Este mes"
  stats: MonthStat[]               // [ingresos, citas, nuevos clientes, canceladas]
  monthRevenue: number
  monthRevenueChangePct: number
  dailyRevenue: DailyRevenue[]
  topServices: TopService[]
  onPeriodChange?: () => void
  onViewAllServices?: () => void
  onBack?: () => void
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values), min = Math.min(...values)
  const range = max - min || 1
  const w = 60, h = 28
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const color = positive ? '#22C55E' : '#EF4444'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data }: { data: DailyRevenue[] }) {
  const max = Math.max(...data.map(d => d.amount))
  const chartH = 80
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 3,
      height: chartH, paddingTop: 8,
    }}>
      {data.map((d, i) => {
        const barH = max > 0 ? (d.amount / max) * chartH : 4
        const isLast = i === data.length - 1
        return (
          <div
            key={i}
            style={{
              flex: 1, height: barH,
              background: isLast ? '#FF6B1A' : '#E5E5E5',
              borderRadius: '3px 3px 0 0',
              minHeight: 4,
              transition: 'height 400ms ease',
            }}
          />
        )
      })}
    </div>
  )
}

export default function GeneralSummary({
  period, stats, monthRevenue, monthRevenueChangePct,
  dailyRevenue, topServices,
  onPeriodChange, onViewAllServices, onBack,
}: GeneralSummaryProps) {
  const isPositiveMonth = monthRevenueChangePct >= 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 16px 12px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Resumen general</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>⚙️</button>
        </div>
        {/* Selector de período */}
        <div style={{ padding: '0 16px 14px' }}>
          <button
            onClick={onPeriodChange}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F5F5F5', border: 'none', borderRadius: 10,
              padding: '8px 14px', fontSize: 13, fontWeight: 600,
              color: '#0D0D0D', cursor: 'pointer',
            }}
          >
            📅 {period} <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Stats grid 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map((stat, i) => {
            const isPos = stat.isPositive ?? stat.changePct >= 0
            return (
              <div key={i} style={{
                background: '#FFF', borderRadius: 14, padding: '16px 14px',
              }}>
                <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0D0D0D', marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isPos ? '#22C55E' : '#EF4444' }}>
                    {isPos ? '+' : ''}{stat.changePct}% vs mes anterior
                  </span>
                  <Sparkline values={stat.sparkline} positive={isPos} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Ingresos del mes */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, color: '#999', fontWeight: 500, marginBottom: 4 }}>Ingresos del mes</div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: '#0D0D0D',
            display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4,
          }}>
            ${monthRevenue.toLocaleString()}.00
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: isPositiveMonth ? '#22C55E' : '#EF4444',
            }}>
              {isPositiveMonth ? '+' : ''}{monthRevenueChangePct}%
            </span>
          </div>

          {/* Barra de días */}
          <BarChart data={dailyRevenue} />

          {/* Eje X simplificado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['1 May', '7 May', '14 May', '21 May', '28 May'].map(l => (
              <span key={l} style={{ fontSize: 10, color: '#CCC' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Servicios más vendidos */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Servicios más vendidos</div>
            <button onClick={onViewAllServices} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#FF6B1A', fontWeight: 600 }}>
              Ver todos
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topServices.map((svc, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>
                      {i === 0 ? '✂️' : i === 1 ? '💈' : i === 2 ? '🪒' : '✂️'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0D0D0D' }}>{svc.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{svc.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#F0F0F0', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${svc.pct}%`,
                    background: i === 0 ? '#FF6B1A' : i === 1 ? '#0D0D0D' : '#E5E5E5',
                    borderRadius: 999,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
