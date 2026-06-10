// AMADOBOOK — ReporteResumen.tsx
// Tab "Resumen" del reporte general
// Muestra: stat grande de ingresos + gráfica de línea + desglose por categoría

'use client'

export interface IngresoCategoria {
  label: string    // "Servicios individuales"
  amount: number
  pct: number
  color: string
}

export interface ReporteResumenProps {
  netRevenue: number
  revenueChangePct: number
  sparklineData: number[]          // puntos de la línea (diarios del mes)
  sparklineDates: string[]         // etiquetas del eje X ["1 May", "8 May"...]
  breakdown: IngresoCategoria[]
}

function LineChart({
  data, dates, height = 140,
}: { data: number[]; dates: string[]; height?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 358, h = height
  const pad = { top: 10, bottom: 24, left: 8, right: 8 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom

  const pts = data.map((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * innerW
    const y = pad.top + innerH - ((v - min) / range) * innerH
    return { x, y }
  })

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // Area bajo la línea
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${h - pad.bottom} L ${pts[0].x} ${h - pad.bottom} Z`

  // Etiquetas del eje X (solo las que quepan)
  const xLabels = dates.filter((_, i) => i === 0 || i === Math.floor(dates.length / 2) || i === dates.length - 1)

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Área */}
      <path d={areaD} fill="url(#areaGrad)" />
      {/* Línea */}
      <path d={pathD} fill="none" stroke="#FF6B1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Punto final */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={4} fill="#FF6B1A" />
      {/* Eje X labels */}
      {xLabels.map((label, i) => {
        const idx = dates.indexOf(label)
        const x = pad.left + (idx / (dates.length - 1)) * innerW
        return (
          <text key={i} x={x} y={h - 4} textAnchor="middle" fontSize={10} fill="#CCC">{label}</text>
        )
      })}
      {/* Líneas guía horizontales */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = pad.top + innerH * (1 - pct)
        const val = Math.round(min + range * pct)
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#F5F5F5" strokeWidth={1} />
            <text x={0} y={y + 4} fontSize={9} fill="#DDD">${(val / 1000).toFixed(1)}k</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function ReporteResumen({
  netRevenue, revenueChangePct, sparklineData, sparklineDates, breakdown,
}: ReporteResumenProps) {
  const isPos = revenueChangePct >= 0

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Stat grande */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 6 }}>Ingresos</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#0D0D0D', lineHeight: 1, marginBottom: 6 }}>
          ${netRevenue.toLocaleString()}.00
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: isPos ? '#22C55E' : '#EF4444',
          marginBottom: 20,
        }}>
          {isPos ? '↑' : '↓'} {Math.abs(revenueChangePct)}% vs mes anterior
        </div>
        <LineChart data={sparklineData} dates={sparklineDates} />
      </div>

      {/* Desglose */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Desglose de ingresos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {breakdown.map((item, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6,
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#0D0D0D' }}>{item.label}</span>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>
                    ${item.amount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, color: '#999' }}>{item.pct}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: '#F0F0F0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${item.pct}%`,
                  background: item.color, borderRadius: 999,
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
