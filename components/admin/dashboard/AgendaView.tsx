// AMADOBOOK — AgendaView.tsx
// Vista de agenda diaria hora por hora accesible desde el dashboard
// Muestra: stats del día, línea de tiempo con citas, horas libres

'use client'

export type AgendaApptStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface AgendaAppt {
  id: string
  startHour: number          // 9.0 = 9:00, 9.5 = 9:30
  durationHours: number
  clientName: string
  clientAvatar?: string
  service: string
  status: AgendaApptStatus
}

export interface AgendaViewProps {
  date: string               // "Miércoles, 15 de Mayo"
  totalToday: number
  confirmed: number
  pending: number
  cancelled: number
  appointments: AgendaAppt[]
  onBack?: () => void
  onViewCita?: (id: string) => void
  onNewCita?: (hour?: number) => void
}

const STATUS_COLOR: Record<AgendaApptStatus, { bg: string; text: string; border: string }> = {
  pending:   { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D' },
  confirmed: { bg: '#F0FDF4', text: '#14532D', border: '#86EFAC' },
  completed: { bg: '#F9FAFB', text: '#374151', border: '#D1D5DB' },
  cancelled: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
}

const STATUS_LABEL: Record<AgendaApptStatus, string> = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled:  'Cancelada',
}

const START_HOUR = 8
const END_HOUR   = 20
const HOUR_H     = 72       // px por hora

function formatHour(h: number) {
  const hh = Math.floor(h)
  const mm = h % 1 === 0.5 ? '30' : '00'
  const ampm = hh < 12 ? 'AM' : 'PM'
  const display = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh
  return `${display}:${mm} ${ampm}`
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Detectar horas libres (sin cita en ese slot)
function getFreeSlots(appointments: AgendaAppt[]): number[] {
  const busy = new Set<number>()
  for (const appt of appointments) {
    const slots = Math.ceil(appt.durationHours / 0.5)
    for (let i = 0; i < slots; i++) {
      busy.add(Math.round((appt.startHour + i * 0.5) * 2) / 2)
    }
  }
  const free: number[] = []
  for (let h = START_HOUR; h < END_HOUR; h += 0.5) {
    if (!busy.has(h)) free.push(h)
  }
  return free
}

export default function AgendaView({
  date, totalToday, confirmed, pending, cancelled,
  appointments, onBack, onViewCita, onNewCita,
}: AgendaViewProps) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
  const totalHeight = hours.length * HOUR_H
  const LEFT_GUTTER = 68
  const freeSlots = getFreeSlots(appointments)
  const currentHour = 10   // simula la hora actual (en real: new Date().getHours())

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
        borderBottom: '1px solid #F0F0F0',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 16px 12px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>Hoy</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>{date}</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>📅</button>
        </div>

        {/* Stats del día */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          padding: '0 16px 14px', gap: 8,
        }}>
          {[
            { label: 'Citas hoy',    value: totalToday, color: '#0D0D0D' },
            { label: 'Completadas',  value: confirmed,  color: '#16A34A' },
            { label: 'Pendientes',   value: pending,    color: '#D97706' },
            { label: 'Canceladas',   value: cancelled,  color: '#DC2626' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#F5F5F5', borderRadius: 10, padding: '10px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#FFF' }}>
        <div style={{ position: 'relative', minHeight: totalHeight, paddingBottom: 32 }}>

          {/* Filas de horas */}
          {hours.map(h => (
            <div key={h} style={{ display: 'flex', height: HOUR_H, borderBottom: '1px solid #F9F9F9' }}>
              {/* Hora label */}
              <div style={{
                width: LEFT_GUTTER, flexShrink: 0,
                padding: '8px 10px 0',
                display: 'flex', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 11, color: '#CCC', fontWeight: 500 }}>{formatHour(h)}</span>
              </div>
              {/* Zona */}
              <div style={{ flex: 1, borderLeft: '1px solid #F5F5F5', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #FAFAFA' }} />
              </div>
            </div>
          ))}

          {/* Bloques de citas */}
          {appointments.map(appt => {
            const cfg = STATUS_COLOR[appt.status]
            const top = (appt.startHour - START_HOUR) * HOUR_H
            const height = appt.durationHours * HOUR_H - 6

            return (
              <button
                key={appt.id}
                onClick={() => onViewCita?.(appt.id)}
                style={{
                  position: 'absolute', top, left: LEFT_GUTTER + 8, right: 12,
                  height, background: cfg.bg,
                  borderRadius: 12,
                  borderLeft: `3px solid ${cfg.border}`,
                  padding: '8px 12px',
                  border: 'none', cursor: 'pointer',
                  textAlign: 'left', zIndex: 2,
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: appt.clientAvatar ? 'transparent' : '#FF6B1A',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#FFF',
                }}>
                  {appt.clientAvatar
                    ? <img src={appt.clientAvatar} alt={appt.clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials(appt.clientName)
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: cfg.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {appt.clientName}
                  </div>
                  <div style={{
                    fontSize: 11, color: cfg.text, opacity: 0.7,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2,
                  }}>
                    {appt.service}
                  </div>
                </div>

                {/* Status badge */}
                {appt.durationHours >= 0.5 && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: cfg.text,
                    background: 'rgba(255,255,255,0.6)',
                    padding: '2px 8px', borderRadius: 999, flexShrink: 0,
                  }}>
                    {STATUS_LABEL[appt.status]}
                  </span>
                )}
              </button>
            )
          })}

          {/* Horas libres con botón + */}
          {freeSlots.filter(h => Number.isInteger(h)).slice(0, 3).map(h => (
            <button
              key={`free-${h}`}
              onClick={() => onNewCita?.(h)}
              style={{
                position: 'absolute',
                top: (h - START_HOUR) * HOUR_H + 4,
                left: LEFT_GUTTER + 8, right: 12,
                height: HOUR_H - 8,
                background: 'none',
                border: '1.5px dashed #E5E5E5',
                borderRadius: 10,
                cursor: 'pointer', zIndex: 1,
                display: 'flex', alignItems: 'center',
                justifyContent: 'flex-end', paddingRight: 12, gap: 6,
              }}
            >
              <span style={{ fontSize: 11, color: '#CCC' }}>Hora disponible</span>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#F0F0F0', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#999', fontWeight: 700,
              }}>+</span>
            </button>
          ))}

          {/* Línea de hora actual */}
          <div style={{
            position: 'absolute',
            top: (currentHour - START_HOUR) * HOUR_H,
            left: LEFT_GUTTER,
            right: 0,
            display: 'flex', alignItems: 'center',
            zIndex: 3, pointerEvents: 'none',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B1A', marginLeft: -4, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 2, background: '#FF6B1A', opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
