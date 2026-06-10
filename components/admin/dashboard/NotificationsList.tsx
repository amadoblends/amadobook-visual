// AMADOBOOK — NotificationsList.tsx
// Panel de notificaciones del dashboard admin
// Con tipos, puntos de no leída, y "marcar todas como leídas"

'use client'

export type NotifType =
  | 'new_appointment'
  | 'appointment_completed'
  | 'payment_received'
  | 'new_client'
  | 'reminder'
  | 'appointment_cancelled'

export interface NotifItem {
  id: string
  type: NotifType
  title: string
  body: string
  time: string        // "5 min" / "1 h" / "Ayer"
  isRead: boolean
}

export interface NotificationsListProps {
  notifications: NotifItem[]
  onMarkAllRead?: () => void
  onMarkRead?: (id: string) => void
  onItemPress?: (item: NotifItem) => void
}

const TYPE_CONFIG: Record<NotifType, { icon: string; iconBg: string; iconColor: string }> = {
  new_appointment:       { icon: '📅', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  appointment_completed: { icon: '✓',  iconBg: '#F0FDF4', iconColor: '#16A34A' },
  payment_received:      { icon: '$',  iconBg: '#F0FDF4', iconColor: '#16A34A' },
  new_client:            { icon: '👤', iconBg: '#FFF3EC', iconColor: '#FF6B1A' },
  reminder:              { icon: '🔔', iconBg: '#FFFBEB', iconColor: '#D97706' },
  appointment_cancelled: { icon: '✕',  iconBg: '#FEF2F2', iconColor: '#DC2626' },
}

export default function NotificationsList({
  notifications, onMarkAllRead, onMarkRead, onItemPress,
}: NotificationsListProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Notificaciones</div>
          {unreadCount > 0 && (
            <span style={{
              background: '#FF6B1A', color: '#FFF',
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, padding: '2px 8px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#FF6B1A', fontWeight: 600,
            }}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: 14 }}>
            Sin notificaciones
          </div>
        ) : (
          notifications.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type]
            return (
              <button
                key={notif.id}
                onClick={() => { onMarkRead?.(notif.id); onItemPress?.(notif) }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 0',
                  borderBottom: i < notifications.length - 1 ? '1px solid #F5F5F5' : 'none',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', width: '100%',
                  opacity: notif.isRead ? 0.6 : 1,
                  transition: 'opacity 200ms',
                }}
              >
                {/* Ícono */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: cfg.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: cfg.iconColor,
                }}>
                  {cfg.icon}
                </div>

                {/* Contenido */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: '#0D0D0D',
                    marginBottom: 3, lineHeight: 1.4,
                  }}>
                    {notif.title}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#999', lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}>
                    {notif.body}
                  </div>
                </div>

                {/* Tiempo + dot */}
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-end', gap: 6, flexShrink: 0,
                }}>
                  <span style={{ fontSize: 11, color: '#CCC' }}>{notif.time}</span>
                  {!notif.isRead && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#FF6B1A',
                    }} />
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
