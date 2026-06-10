// AMADOBOOK — ClienteProfile.tsx
// Perfil completo de un cliente
// Muestra: avatar, nombre, badge activo, acciones, info, resumen y próxima cita
// Ruta: /admin/clientes/[id]

'use client'

export interface ProximaCitaInfo {
  date: string       // "Miércoles, 22 Mayo 2024"
  time: string       // "10:30 AM"
  service: string    // "Corte clásico + Barba"
  appointmentId: string
}

export interface ClienteProfileProps {
  id: string
  name: string
  phone: string
  email?: string
  birthDate?: string         // "15 de Marzo de 1990"
  avatar?: string
  status: 'active' | 'inactive'
  notes?: string
  totalAppointments: number
  totalSpent: number
  noShows: number
  attendanceRate: number     // 0–100
  nextAppointment?: ProximaCitaInfo
  onBack?: () => void
  onCall?: (phone: string) => void
  onMessage?: (phone: string) => void
  onEdit?: (id: string) => void
  onNewCita?: (id: string) => void
  onHistorial?: (id: string) => void
  onStats?: (id: string) => void
  onViewCita?: (appointmentId: string) => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function ActionBtn({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: '#F5F5F5',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>{label}</span>
    </button>
  )
}

function StatBox({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: valueColor ?? '#0D0D0D' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

export default function ClienteProfile({
  id, name, phone, email, birthDate, avatar, status, notes,
  totalAppointments, totalSpent, noShows, attendanceRate,
  nextAppointment,
  onBack, onCall, onMessage, onEdit, onNewCita, onHistorial, onStats, onViewCita,
}: ClienteProfileProps) {
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
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666' }}>⋯</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Card principal: Avatar + Nombre + Acciones ── */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>

          {/* Avatar con botón editar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4, position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: avatar ? 'transparent' : '#FF6B1A',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {avatar
                  ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 28 }}>{getInitials(name)}</span>
                }
              </div>
              <button
                onClick={() => onEdit?.(id)}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 24, height: 24, borderRadius: '50%',
                  background: '#0D0D0D', border: '2px solid #FFF',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 12,
                }}
              >
                ✏️
              </button>
            </div>
          </div>

          {/* Nombre + Badge */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>{name}</div>
            <span style={{
              background: status === 'active' ? '#F0FDF4' : '#F9FAFB',
              color: status === 'active' ? '#16A34A' : '#6B7280',
              fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999,
            }}>
              {status === 'active' ? 'Cliente activo' : 'Cliente inactivo'}
            </span>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 4 }}>
            <ActionBtn icon="📞" label="Llamar"  onClick={() => onCall?.(phone)} />
            <ActionBtn icon="💬" label="Mensaje" onClick={() => onMessage?.(phone)} />
            <ActionBtn icon="✏️" label="Editar"  onClick={() => onEdit?.(id)} />
            <ActionBtn icon="⋯"  label="Más" />
          </div>

          {/* Info de contacto */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F5F5F5' }}>
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>📞</span>
              <span style={{ fontSize: 14, color: '#0D0D0D' }}>{phone}</span>
            </div>
            {email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F5F5F5' }}>
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>✉️</span>
                <span style={{ fontSize: 14, color: '#0D0D0D' }}>{email}</span>
              </div>
            )}
            {birthDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F5F5F5' }}>
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>📅</span>
                <div>
                  <div style={{ fontSize: 14, color: '#0D0D0D' }}>{birthDate}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Fecha de nacimiento</div>
                </div>
              </div>
            )}
            {notes && (
              <div style={{ padding: '12px 0', borderTop: '1px solid #F5F5F5' }}>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 6 }}>Notas</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Card: Resumen stats ── */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>Resumen</div>
          <div style={{ display: 'flex', gap: 0 }}>
            <StatBox label="Citas totales" value={totalAppointments} />
            <div style={{ width: 1, background: '#F0F0F0', margin: '0 4px' }} />
            <StatBox label="Total gastado" value={`$${totalSpent.toLocaleString()}`} />
            <div style={{ width: 1, background: '#F0F0F0', margin: '0 4px' }} />
            <StatBox label="No asistió" value={noShows} />
            <div style={{ width: 1, background: '#F0F0F0', margin: '0 4px' }} />
            <StatBox
              label="Asistencia"
              value={`${attendanceRate}%`}
              valueColor={attendanceRate >= 80 ? '#16A34A' : '#D97706'}
            />
          </div>
        </div>

        {/* ── Card: Próxima cita ── */}
        {nextAppointment ? (
          <button
            onClick={() => onViewCita?.(nextAppointment.appointmentId)}
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
        ) : (
          <button
            onClick={() => onNewCita?.(id)}
            style={{
              background: '#FFF', borderRadius: 16, padding: '16px 20px',
              border: '1.5px dashed #E5E5E5', cursor: 'pointer', textAlign: 'left',
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#999' }}>Sin próximas citas</div>
              <div style={{ fontSize: 12, color: '#CCC', marginTop: 2 }}>Toca para agendar una cita</div>
            </div>
            <span style={{ fontSize: 18, color: '#FF6B1A', fontWeight: 700 }}>+</span>
          </button>
        )}

        {/* ── Acciones secundarias ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onHistorial?.(id)}
            style={{
              flex: 1, height: 48,
              background: '#FFF', border: '1px solid #E5E5E5',
              borderRadius: 12, fontSize: 13, fontWeight: 600,
              color: '#0D0D0D', cursor: 'pointer',
            }}
          >
            📋 Historial
          </button>
          <button
            onClick={() => onStats?.(id)}
            style={{
              flex: 1, height: 48,
              background: '#FFF', border: '1px solid #E5E5E5',
              borderRadius: 12, fontSize: 13, fontWeight: 600,
              color: '#0D0D0D', cursor: 'pointer',
            }}
          >
            📊 Estadísticas
          </button>
          <button
            onClick={() => onNewCita?.(id)}
            style={{
              flex: 1, height: 48,
              background: '#FF6B1A', border: 'none',
              borderRadius: 12, fontSize: 13, fontWeight: 700,
              color: '#FFF', cursor: 'pointer',
            }}
          >
            + Cita
          </button>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
