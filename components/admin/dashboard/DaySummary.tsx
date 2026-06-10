// AMADOBOOK — DaySummary.tsx
// Resumen del día: ingresos con sparkline + citas completadas con progreso circular
// Sección "Resumen de hoy" del dashboard

'use client'

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 80, h = 32
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  const color = positive ? '#22C55E' : '#EF4444'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Punto final */}
      <circle
        cx={parseFloat(points[points.length - 1].split(',')[0])}
        cy={parseFloat(points[points.length - 1].split(',')[1])}
        r={3}
        fill={color}
      />
    </svg>
  )
}

function CircularProgress({ value, max, size = 56 }: { value: number; max: number; size?: number }) {
  const pct = Math.min(value / max, 1)
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="#FF6B1A"
        strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export interface DaySummaryProps {
  dayRevenue: number
  revenueChangePct: number          // positivo o negativo vs ayer
  revenueSparkline: number[]        // últimos 7 puntos de ingresos
  completedAppointments: number
  totalAppointments: number
  onViewMore?: () => void
}

export default function DaySummary({
  dayRevenue,
  revenueChangePct,
  revenueSparkline,
  completedAppointments,
  totalAppointments,
  onViewMore,
}: DaySummaryProps) {
  const isPositive = revenueChangePct >= 0
  const completionPct = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0

  return (
    <div style={{
      background: '#FFF',
      borderRadius: 16,
      padding: 20,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Resumen de hoy</div>
        <button
          onClick={onViewMore}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#FF6B1A', fontWeight: 600,
          }}
        >
          Ver más
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>

        {/* Ingresos */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>$</span>
            <span>Ingresos</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0D0D0D', lineHeight: 1 }}>
            ${dayRevenue.toLocaleString()}.00
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            marginTop: 6, fontSize: 12,
            color: isPositive ? '#22C55E' : '#EF4444',
            fontWeight: 600,
          }}>
            {isPositive ? '↑' : '↓'} {Math.abs(revenueChangePct)}% vs ayer
          </div>
          <div style={{ marginTop: 10 }}>
            <Sparkline values={revenueSparkline} positive={isPositive} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 80, background: '#F0F0F0' }} />

        {/* Citas completadas */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress value={completedAppointments} max={totalAppointments} size={64} />
            <div style={{
              position: 'absolute', display: 'flex', flexDirection: 'column',
              alignItems: 'center', lineHeight: 1,
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D' }}>{completedAppointments}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0D0D0D' }}>Citas completadas</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{completionPct}% del total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
