// AMADOBOOK — ReporteServicios.tsx
// Tab "Servicios" del reporte general
// Muestra: tabla de servicios más vendidos + donut de ingresos por servicio

'use client'

export interface ServicioReporte {
  name: string
  icon?: string
  count: number
  revenue: number
  color: string
}

export interface ReporteServiciosProps {
  topServices: ServicioReporte[]
  onViewAll?: () => void
}

function DonutChart({
  segments, size = 160,
}: {
  segments: { pct: number; color: string }[]
  size?: number
}) {
  const cx = size / 2, cy = size / 2
  const r = size / 2 - 16
  const strokeW = 28
  const circ = 2 * Math.PI * r

  // Calcular pcts desde conteos
  const total = segments.reduce((s, seg) => s + seg.pct, 0)
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={strokeW} />
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.pct / total : 0
        const dash = pct * circ
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}

export default function ReporteServicios({ topServices, onViewAll }: ReporteServiciosProps) {
  const totalRevenue = topServices.reduce((s, sv) => s + sv.revenue, 0)

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Tabla de servicios más vendidos */}
      <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 20px 12px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Servicios más vendidos</div>
          <button
            onClick={onViewAll}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#FF6B1A', fontWeight: 600 }}
          >
            Ver todos
          </button>
        </div>

        {/* Cabecera tabla */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 60px 80px',
          padding: '8px 20px',
          borderTop: '1px solid #F5F5F5',
          borderBottom: '1px solid #F5F5F5',
        }}>
          {['Servicio', 'Cant.', 'Ingresos'].map(h => (
            <div key={h} style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>{h}</div>
          ))}
        </div>

        {topServices.map((svc, i) => (
          <div
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 60px 80px',
              padding: '14px 20px',
              borderBottom: i < topServices.length - 1 ? '1px solid #F5F5F5' : 'none',
              alignItems: 'center',
            }}
          >
            {/* Nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${svc.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>
                {svc.icon ?? '✂️'}
              </div>
              <span style={{
                fontSize: 13, fontWeight: 500, color: '#0D0D0D',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {svc.name}
              </span>
            </div>
            {/* Cantidad */}
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>{svc.count}</div>
            {/* Ingresos */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>
              ${svc.revenue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Donut de ingresos por servicio */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 20 }}>
          Ingresos por servicio
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Donut */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <DonutChart segments={topServices.map(s => ({ pct: s.revenue, color: s.color }))} />
            {/* Total en el centro */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0D0D0D' }}>
                ${(totalRevenue / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: 10, color: '#999' }}>total</div>
            </div>
          </div>

          {/* Leyenda */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topServices.map((svc, i) => {
              const pct = totalRevenue > 0 ? Math.round((svc.revenue / totalRevenue) * 100) : 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: svc.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: '#0D0D0D', fontWeight: 500 }}>{svc.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}
