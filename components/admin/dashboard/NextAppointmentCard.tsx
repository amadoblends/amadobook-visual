// AMADOBOOK — NextAppointmentCard.tsx
// Tarjeta oscura "Próxima cita" del dashboard admin
// Muestra: hora, nombre del cliente, servicio, foto y botón de opciones

'use client'

export interface NextAppointmentCardProps {
  time: string           // "10:00 AM"
  clientName: string
  service: string        // "Corte clásico + Barba"
  clientAvatar?: string
  appointmentId: string
  onView?: (id: string) => void
  onOptions?: (id: string) => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function NextAppointmentCard({
  time, clientName, service, clientAvatar,
  appointmentId, onView, onOptions,
}: NextAppointmentCardProps) {
  return (
    <button
      onClick={() => onView?.(appointmentId)}
      style={{
        width: '100%',
        background: '#0D0D0D',
        borderRadius: 16,
        padding: '18px 20px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 6 }}>{time}</div>
        <div style={{
          fontSize: 18, fontWeight: 700, color: '#FFF',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>
          {clientName}
        </div>
        <div style={{
          fontSize: 13, color: '#999',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {service}
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: clientAvatar ? 'transparent' : '#FF6B1A',
        overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid rgba(255,255,255,0.1)',
      }}>
        {clientAvatar
          ? <img src={clientAvatar} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 18 }}>{getInitials(clientName)}</span>
        }
      </div>

      {/* Opciones */}
      <button
        onClick={e => { e.stopPropagation(); onOptions?.(appointmentId) }}
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: 'none', borderRadius: '50%',
          width: 32, height: 32, cursor: 'pointer',
          color: '#888', fontSize: 16, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⋯
      </button>
    </button>
  )
}
