// AMADOBOOK — ReportesDashboard.tsx
// Dashboard principal de reportes del admin
// Muestra: ingresos netos del mes, stats rápidos, resumen rápido con donut
// Ruta: /admin/reportes

'use client'

export interface ReportesDashboardProps {
  period: string                    // "Este mes"
  netRevenue: number
  revenueChangePct: number
  stats: {
    appointmentsCount: number
    appointmentsChangePct: number
    uniqueClients: number
    clientsChangePct: number
    servicesSold: number
    servicesChangePct: number
    avgTicket: number
    avgTicketChangePct: number
    hoursWorked: string             // "36h 30m"
    rescheduled: number
    rescheduledChangePct: number
  }
  serviceBreakdown: {
    name: string
    pct: number
    amount: number
    color: string
  }[]
  onViewFull?: () => void
  onPeriodChange?: () => void
  onNotifications?: () => void
}

function DonutChart({
  segments,
  size = 120,
}: {
  segments: { pct: number; color: string }[]
  size?: number
}) {
  const cx = size / 2, cy = size / 2
  const r = size / 2 - 12
  const strokeW = 20
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={strokeW} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ
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

function StatPair({
  label, value, changePct,
}: { label: string; value: string | number; changePct: number }) {
  const isPos = changePct >= 0
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: isPos ? '#22C55E' : '#EF4444', marginTop: 2 }}>
        {isPos ? '+' : ''}{changePct}%
      </div>
    </div>
  )
}

export default function ReportesDashboard({
  period, netRevenue, revenueChangePct, stats,
  serviceBreakdown, onViewFull, onPeriodChange, onNotifications,
}: ReportesDashboardProps) {
  const isPos = revenueChangePct >= 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 16px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>☰</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>Reportes</div>
              <div style={{ fontSize: 12, color: '#999' }}>Tu rendimiento como barbero independiente</div>
            </div>
          </div>
          <button onClick={onNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>🔔</button>
        </div>

        {/* Selector período */}
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

        {/* Ingresos netos card */}
        <div style={{
          background: '#0D0D0D', borderRadius: 16, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,107,26,0.15)', pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>Ingresos netos</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                ${netRevenue.toLocaleString()}.00
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, marginTop: 8,
                color: isPos ? '#22C55E' : '#EF4444',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {isPos ? '↑' : '↓'} {Math.abs(revenueChangePct)}% vs mes anterior
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>$</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <StatPair label="Citas realizadas" value={stats.appointmentsCount} changePct={stats.appointmentsChangePct} />
            <StatPair label="Clientes únicos"  value={stats.uniqueClients}     changePct={stats.clientsChangePct}     />
            <StatPair label="Servicios vend."  value={stats.servicesSold}      changePct={stats.servicesChangePct}    />
          </div>
          <div style={{ height: 1, background: '#F5F5F5', margin: '16px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <StatPair label="Ticket promedio"  value={`$${stats.avgTicket}`}   changePct={stats.avgTicketChangePct}   />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D' }}>{stats.hoursWorked}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Horas trabajadas</div>
            </div>
            <StatPair label="Reprogramadas"   value={stats.rescheduled}       changePct={stats.rescheduledChangePct} />
          </div>
        </div>

        {/* Resumen rápido (donut) */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Resumen rápido</div>
            <button
              onClick={onViewFull}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#FF6B1A', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              Ver reporte completo <span>›</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flexShrink: 0 }}>
              <DonutChart segments={serviceBreakdown.map(s => ({ pct: s.pct, color: s.color }))} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {serviceBreakdown.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: '#0D0D0D', fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{s.pct}%</div>
                  <div style={{ fontSize: 11, color: '#999' }}>${s.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* Bottom Nav */}
      <div style={{
        height: 80, background: '#FFF', borderTop: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)', flexShrink: 0,
      }}>
        {[
          { icon: '🏠', label: 'Inicio',   active: false },
          { icon: '📅', label: 'Citas',    active: false },
          { icon: '+',  label: '',         isFab: true   },
          { icon: '👤', label: 'Clientes', active: false },
          { icon: '📊', label: 'Reportes', active: true  },
        ].map((item, i) => {
          if ((item as any).isFab) return (
            <button key={i} style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FF6B1A',
              border: 'none', cursor: 'pointer', fontSize: 28, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,26,0.35)', marginTop: -20,
            }}>+</button>
          )
          return (
            <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: item.active ? '#FF6B1A' : '#999', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
