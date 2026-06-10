// AMADOBOOK — ClienteHistorial.tsx
// Historial de citas de un cliente específico
// Ruta: /admin/clientes/[id]/historial

'use client'

export type HistorialStatus = 'completed' | 'cancelled' | 'pending' | 'confirmed' | 'no_show'

export interface HistorialItem {
  id: string
  date: string          // "08 Mayo 2024"
  time: string          // "10:00 AM"
  service: string
  status: HistorialStatus
  price: number
}

export interface ProximaCitaInfo {
  date: string
  time: string
  service: string
  appointmentId: string
}

export interface ClienteHistorialProps {
  clientName: string
  clientAvatar?: string
  totalAppointments: number
  completed: number
  cancelled: number
  noShows: number
  nextAppointment?: ProximaCitaInfo
  history: HistorialItem[]
  onBack?: () => void
  onViewCita?: (id: string) => void
  onViewNextCita?: (id: string) => void
}

const STATUS_CONFIG: Record<HistorialStatus, { label: string; color: string }> = {
  completed: { label: 'Completada', color: '#16A34A' },
  cancelled: { label: 'Cancelada',  color: '#DC2626' },
  pending:   { label: 'Pendiente',  color: '#D97706' },
  confirmed: { label: 'Confirmada', color: '#16A34A' },
  no_show:   { label: 'No asistió', color: '#7C3AED' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ClienteHistorial({
  clientName, clientAvatar,
  totalAppointments, completed, cancelled, noShows,
  nextAppointment, history,
  onBack, onViewCita, onViewNextCita,
}: ClienteHistorialProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Historial de Citas</div>
          <div style={{ width: 22 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Stats resumen ── */}
        <div style={{
          background: '#FFF', borderRadius: 16,
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Citas\ntotales',   value: totalAppointments, color: '#0D0D0D' },
            { label: 'Comple-\ntadas',   value: completed,         color: '#16A34A' },
            { label: 'Cance-\nladas',    value: cancelled,         color: '#DC2626' },
            { label: 'No\nasistió',      value: noShows,           color: '#7C3AED' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '16px 8px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid #F5F5F5' : 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 4, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Próxima cita ── */}
        {nextAppointment ? (
          <button
            onClick={() => onViewNextCita?.(nextAppointment.appointmentId)}
            style={{
              background: '#0D0D0D', borderRadius: 16, padding: '16px 20px',
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 500, marginBottom: 4 }}>Próxima cita</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>{nextAppointment.date}</div>
              <div style={{ fontSize: 13, color: '#AAA', marginTop: 2 }}>
                {nextAppointment.time} · {nextAppointment.service}
              </div>
            </div>
            <span style={{ fontSize: 18, color: '#888' }}>›</span>
          </button>
        ) : null}

        {/* ── Historial ── */}
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 8px', fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>
            Historial
          </div>

          {history.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#999', fontSize: 14 }}>
              Sin citas anteriores
            </div>
          ) : (
            history.map((item, i) => {
              const cfg = STATUS_CONFIG[item.status]
              return (
                <button
                  key={item.id}
                  onClick={() => onViewCita?.(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '14px 16px',
                    borderTop: i === 0 ? 'none' : '1px solid #F5F5F5',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', width: '100%', gap: 12,
                  }}
                >
                  {/* Fecha + hora */}
                  <div style={{ minWidth: 80 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D' }}>{item.date}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{item.time}</div>
                  </div>

                  {/* Servicio */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500, color: '#0D0D0D',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.service}
                    </div>
                  </div>

                  {/* Estado + precio */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', marginTop: 2 }}>
                      {item.status === 'cancelled' ? '-' : `$${item.price}`}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
