// AMADOBOOK — QuickStats.tsx
// 3 stat cards horizontales: Facturación, Citas completadas, Nuevos clientes
// Con sparkline y porcentaje de cambio vs mes anterior

'use client'

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 56, h = 24
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const color = positive ? '#22C55E' : '#EF4444'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export interface QuickStat {
  id: string
  label: string
  value: string       // "$12,450" / "128" / "24"
  changePct: number   // +15 o -5
  sparkline: number[]
  period?: string     // "Este mes"
}

export interface QuickStatsProps {
  stats: QuickStat[]
  period?: string     // Selector de período activo (UI informativa)
  onPeriodChange?: (period: string) => void
}

export default function QuickStats({ stats, period = 'Este mes', onPeriodChange }: QuickStatsProps) {
  return (
    <div>
      {/* Selector de período */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Estadísticas rápidas</div>
        <button
          onClick={() => onPeriodChange?.(period)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#666', fontWeight: 500,
          }}
        >
          {period} <span style={{ fontSize: 10 }}>▼</span>
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10 }}>
        {stats.map(stat => {
          const isPositive = stat.changePct >= 0
          return (
            <div
              key={stat.id}
              style={{
                flex: 1,
                background: '#FFF',
                borderRadius: 14,
                padding: '14px 12px',
                border: '1px solid #F0F0F0',
              }}
            >
              <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0D0D0D', lineHeight: 1, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: isPositive ? '#22C55E' : '#EF4444',
                }}>
                  {isPositive ? '+' : ''}{stat.changePct}%
                </div>
                <Sparkline values={stat.sparkline} positive={isPositive} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
