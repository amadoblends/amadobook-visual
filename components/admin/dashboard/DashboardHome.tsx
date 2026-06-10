// AMADOBOOK — DashboardHome.tsx
// Pantalla principal del admin — /admin
// Orquesta todos los widgets del dashboard. Los datos vienen de props (Supabase).

'use client'

import NextAppointmentCard, { NextAppointmentCardProps } from './NextAppointmentCard'
import QuickActionsGrid from './QuickActionsGrid'
import DaySummary, { DaySummaryProps } from './DaySummary'
import RecentActivity, { RecentActivityProps } from './RecentActivity'
import UpcomingAppointments, { UpcomingAppointmentsProps } from './UpcomingAppointments'
import QuickStats, { QuickStatsProps } from './QuickStats'
import NotificationsList, { NotificationsListProps } from './NotificationsList'
import ReferralBanner from './ReferralBanner'

export type DashboardView = 'home' | 'summary' | 'agenda' | 'notifications'

export interface DashboardHomeProps {
  // Datos del usuario
  adminName: string
  adminAvatar?: string
  weather?: { temp: number; condition: string }
  appointmentsToday: number

  // Próxima cita
  nextAppointment?: NextAppointmentCardProps

  // Resumen del día
  daySummary: DaySummaryProps

  // Actividad reciente
  recentActivity: RecentActivityProps['items']

  // Próximas citas (lista)
  upcomingAppointments: UpcomingAppointmentsProps['appointments']

  // Estadísticas rápidas
  quickStats: QuickStatsProps['stats']

  // Notificaciones
  notifications: NotificationsListProps['notifications']

  // Callbacks de navegación
  onNewCita?: () => void
  onClientes?: () => void
  onServicios?: () => void
  onCalendario?: () => void
  onReportes?: () => void
  onIngresos?: () => void
  onViewCita?: (id: string) => void
  onViewAllCitas?: () => void
  onViewAllActivity?: () => void
  onMarkNotifRead?: (id: string) => void
  onMarkAllNotifsRead?: () => void
  onReferral?: () => void
  onViewSummary?: () => void
  onViewAgenda?: () => void
  onViewNotifications?: () => void
  onMenuOpen?: () => void
}

export default function DashboardHome({
  adminName,
  adminAvatar,
  weather,
  appointmentsToday,
  nextAppointment,
  daySummary,
  recentActivity,
  upcomingAppointments,
  quickStats,
  notifications,
  onNewCita,
  onClientes,
  onServicios,
  onCalendario,
  onReportes,
  onIngresos,
  onViewCita,
  onViewAllCitas,
  onViewAllActivity,
  onMarkNotifRead,
  onMarkAllNotifsRead,
  onReferral,
  onViewSummary,
  onViewAgenda,
  onViewNotifications,
  onMenuOpen,
}: DashboardHomeProps) {

  const unreadCount = notifications.filter(n => !n.isRead).length
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  })()

  const firstName = adminName.split(' ')[0]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: '#F5F5F5',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430,
      margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 16px',
        }}>
          {/* Menú + Avatar + Saludo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onMenuOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}
            >
              ☰
            </button>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: adminAvatar ? 'transparent' : '#FF6B1A',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {adminAvatar
                ? <img src={adminAvatar} alt={adminName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 16 }}>
                    {adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
              }
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>
                {greeting}, {firstName}!
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Bienvenido a tu barbería</div>
            </div>
          </div>

          {/* Notificaciones */}
          <button
            onClick={onViewNotifications}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative', padding: 4,
            }}
          >
            <span style={{ fontSize: 24 }}>🔔</span>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 18, height: 18, borderRadius: '50%',
                background: '#FF6B1A', border: '2px solid #FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#FFF',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Clima + Citas de hoy */}
          {(weather || appointmentsToday > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {weather && (
                <div style={{
                  background: '#FFF', borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 24 }}>☀️</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0D0D0D' }}>{weather.temp}°C</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{weather.condition}</div>
                  </div>
                </div>
              )}
              <button
                onClick={onViewAgenda}
                style={{
                  background: '#FFF', borderRadius: 14, padding: '14px 16px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>📅</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0D0D0D' }}>{appointmentsToday}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>Citas hoy</div>
                </div>
              </button>
            </div>
          )}

          {/* Próxima cita */}
          {nextAppointment && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 8 }}>Próxima cita</div>
              <NextAppointmentCard
                {...nextAppointment}
                onView={onViewCita}
              />
            </div>
          )}

          {/* Quick Actions */}
          <QuickActionsGrid
            onNewCita={onNewCita}
            onClientes={onClientes}
            onServicios={onServicios}
            onCalendario={onCalendario}
            onReportes={onReportes}
            onIngresos={onIngresos}
          />

          {/* Resumen del día */}
          <DaySummary
            {...daySummary}
            onViewMore={onViewSummary}
          />

          {/* Actividad reciente */}
          <RecentActivity
            items={recentActivity}
            onViewAll={onViewAllActivity}
            onItemPress={item => item.type === 'new_appointment' && onViewCita?.(item.id)}
          />

          {/* Próximas citas */}
          <UpcomingAppointments
            appointments={upcomingAppointments}
            onViewAll={onViewAllCitas}
            onViewCita={onViewCita}
          />

          {/* Estadísticas rápidas */}
          <QuickStats stats={quickStats} />

          {/* Notificaciones */}
          <NotificationsList
            notifications={notifications.slice(0, 4)}
            onMarkAllRead={onMarkAllNotifsRead}
            onMarkRead={onMarkNotifRead}
          />

          {/* Banner referidos */}
          <ReferralBanner onCta={onReferral} />

          {/* Espacio para bottom nav */}
          <div style={{ height: 80 }} />
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{
        height: 80,
        background: '#FFF',
        borderTop: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        flexShrink: 0,
      }}>
        {[
          { icon: '🏠', label: 'Inicio',   active: true  },
          { icon: '📅', label: 'Citas',    active: false, action: onViewAllCitas },
          { icon: '+',  label: '',         isFab: true   },
          { icon: '👤', label: 'Clientes', active: false, action: onClientes },
          { icon: '⋯',  label: 'Más',     active: false },
        ].map((item, i) => {
          if (item.isFab) return (
            <button key={i} onClick={onNewCita} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FF6B1A', border: 'none', cursor: 'pointer',
              fontSize: 28, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,26,0.35)', marginTop: -20,
            }}>+</button>
          )
          return (
            <button key={i} onClick={(item as any).action} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: item.active ? '#FF6B1A' : '#999', fontWeight: item.active ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
