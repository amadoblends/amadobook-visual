// AMADOBOOK — ReporteClientes.tsx
// Tab "Clientes" del reporte general
// Muestra: stats únicos/nuevos/recurrentes + donut frecuencia + top por gasto

'use client'

export interface ClienteFrecuencia {
  label: string    // "1 vez" / "2 a 3 veces" etc.
  count: number
  pct: number
  color: string
}

export interface TopCliente {
  name: string
  avatar?: string
  appointmentCount: number
  totalSpent: number
}

export interface ReporteClientesProps {
  uniqueClients: number
  uniqueChangePct: number
  newClients: number
  newChangePct: number
  recurringClients: number
  recurringChangePct: number
  frequencyBreakdown: ClienteFrecuencia[]
  topClients: TopCliente[]
}

function DonutChart({ segments, size = 120 }: { segments: { pct: number; color: string }[]; size?: number }) {
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
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ReporteClientes({
  uniqueClients, uniqueChangePct,
  newClients, newChangePct,
  recurringClients, recurringChangePct,
  frequencyBreakdown, topClients,
}: ReporteClientesProps) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Stats grid */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: '16px 12px' }}>
        <div style={{ display: 'flex' }}>
          {[
            { label: 'Clientes únicos',      value: uniqueClients,    pct: uniqueChangePct    },
            { label: 'Nuevos clientes',       value: newClients,       pct: newChangePct       },
            { label: 'Clientes recurrentes',  value: recurringClients, pct: recurringChangePct },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 4px', borderRight: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0D0D0D' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', margin: '4px 0', lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: s.pct >= 0 ? '#22C55E' : '#EF4444' }}>
                {s.pct >= 0 ? '+' : ''}{s.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clientes por frecuencia */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 20 }}>
          Clientes por frecuencia
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flexShrink: 0 }}>
            <DonutChart segments={frequencyBreakdown.map(f => ({ pct: f.pct, color: f.color }))} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {frequencyBreakdown.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 12, color: '#0D0D0D', fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{f.pct}%</div>
                <div style={{ fontSize: 11, color: '#999' }}>({f.count})</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top clientes por gasto */}
      <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>
          Top clientes por gasto
        </div>
        {topClients.map((client, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px',
              borderTop: '1px solid #F5F5F5',
            }}
          >
            {/* Posición */}
            <div style={{
              width: 20, fontSize: 13, fontWeight: 700,
              color: i === 0 ? '#FF6B1A' : i === 1 ? '#888' : '#AAA',
              flexShrink: 0,
            }}>
              {i + 1}
            </div>

            {/* Avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: client.avatar ? 'transparent' : '#FF6B1A',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {client.avatar
                ? <img src={client.avatar} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 13 }}>{getInitials(client.name)}</span>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {client.name}
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                {client.appointmentCount} citas
              </div>
            </div>

            {/* Gasto */}
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0D0D0D', flexShrink: 0 }}>
              ${client.totalSpent.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}
