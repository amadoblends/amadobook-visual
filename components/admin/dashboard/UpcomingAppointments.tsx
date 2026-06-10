// AMADOBOOK — UpcomingAppointments.tsx
// Lista de próximas citas del dashboard con hora, avatar, servicio y estado
// Sección "Próximas citas" con scroll + link "Ver agenda"

'use client'

export interface UpcomingAppt {
  id: string
  time: string
  date: string             // "Mañana, 16 de Mayo" / "Viernes, 17 de Mayo"
  clientName: string
  clientAvatar?: string
  service: string
  status: 'pending' | 'confirmed'
}

export interface UpcomingAppointmentsProps {
  appointments: UpcomingAppt[]
  onViewAll?: () => void
  onViewCita?: (id: string) => void
  onOptions?: (id: string) => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Agrupar por fecha
function groupByDate(items: UpcomingAppt[]): { date: string; items: UpcomingAppt[] }[] {
  const map = new Map<string, UpcomingAppt[]>()
  for (const item of items) {
    if (!map.has(item.date)) map.set(item.date, [])
    map.get(item.date)!.push(item)
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }))
}

export default function UpcomingAppointments({
  appointments, onViewAll, onViewCita, onOptions,
}: UpcomingAppointmentsProps) {
  const groups = groupByDate(appointments)

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
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Próximas citas</div>
        <button
          onClick={onViewAll}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#FF6B1A', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          Ver agenda <span style={{ fontSize: 16 }}>›</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: 14 }}>
          Sin citas próximas
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(group => (
            <div key={group.date}>
              {/* Fecha del grupo */}
              <div style={{
                fontSize: 12, fontWeight: 600, color: '#999',
                marginBottom: 10, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {group.date}
              </div>

              {/* Citas del grupo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {group.items.map((appt, i) => (
                  <button
                    key={appt.id}
                    onClick={() => onViewCita?.(appt.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 0',
                      borderBottom: i < group.items.length - 1 ? '1px solid #F5F5F5' : 'none',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    {/* Hora */}
                    <div style={{
                      minWidth: 60, fontSize: 14, fontWeight: 700,
                      color: '#0D0D0D', lineHeight: 1.2,
                    }}>
                      {appt.time}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: appt.clientAvatar ? 'transparent' : '#FF6B1A',
                      overflow: 'hidden', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {appt.clientAvatar
                        ? <img src={appt.clientAvatar} alt={appt.clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 14 }}>{getInitials(appt.clientName)}</span>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: '#0D0D0D',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {appt.clientName}
                      </div>
                      <div style={{
                        fontSize: 12, color: '#999', marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {appt.service}
                      </div>
                    </div>

                    {/* Opciones */}
                    <button
                      onClick={e => { e.stopPropagation(); onOptions?.(appt.id) }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 18, color: '#CCC', flexShrink: 0, padding: '0 2px',
                      }}
                    >
                      ⋯
                    </button>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
