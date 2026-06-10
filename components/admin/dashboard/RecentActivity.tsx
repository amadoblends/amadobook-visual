// AMADOBOOK — RecentActivity.tsx
// Lista de actividad reciente del admin en el dashboard
// Tipos: nueva cita, pago recibido, cita completada, nuevo cliente

'use client'

export type ActivityType =
  | 'new_appointment'
  | 'payment_received'
  | 'appointment_completed'
  | 'new_client'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string        // "Carlos Mendoza"
  subtitle: string     // "Nueva cita creada" / "Pago recibido $300"
  time: string         // "10:00 AM" / "Ayer"
  amount?: number
}

export interface RecentActivityProps {
  items: ActivityItem[]
  onViewAll?: () => void
  onItemPress?: (item: ActivityItem) => void
}

const TYPE_CONFIG: Record<ActivityType, { icon: string; iconBg: string }> = {
  new_appointment:         { icon: '📅', iconBg: '#EFF6FF' },
  payment_received:        { icon: '💰', iconBg: '#F0FDF4' },
  appointment_completed:   { icon: '✓',  iconBg: '#F0FDF4' },
  new_client:              { icon: '👤', iconBg: '#FFF3EC' },
  appointment_cancelled:   { icon: '✕',  iconBg: '#FEF2F2' },
  appointment_rescheduled: { icon: '↺',  iconBg: '#FFFBEB' },
}

export default function RecentActivity({
  items, onViewAll, onItemPress,
}: RecentActivityProps) {
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
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Actividad reciente</div>
        <button
          onClick={onViewAll}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#FF6B1A', fontWeight: 600,
          }}
        >
          Ver todas
        </button>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: 14 }}>
            Sin actividad reciente
          </div>
        ) : (
          items.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type]
            return (
              <button
                key={item.id}
                onClick={() => onItemPress?.(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: i < items.length - 1 ? '1px solid #F5F5F5' : 'none',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', width: '100%',
                  borderTop: 'none',
                }}
              >
                {/* Ícono */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: cfg.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>

                {/* Texto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: '#0D0D0D',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#999', marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.subtitle}
                  </div>
                </div>

                {/* Tiempo */}
                <div style={{
                  fontSize: 11, color: '#CCC', flexShrink: 0,
                }}>
                  {item.time}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
