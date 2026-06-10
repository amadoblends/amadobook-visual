// app/admin/AdminDashboardClient.tsx
// Client component que conecta el hook con el componente visual

'use client'

import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import DashboardHome from '@/components/admin/dashboard/DashboardHome'

export default function AdminDashboardClient() {
  const { data, loading, error } = useDashboard()
  const router = useRouter()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh', background: '#F5F5F5',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid #F0F0F0',
            borderTopColor: '#FF6B1A',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ color: '#999', fontSize: 14 }}>Cargando...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 24px', background: '#FF6B1A', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <DashboardHome
      adminName={data.adminName}
      adminAvatar={data.adminAvatar}
      appointmentsToday={data.appointmentsToday}
      nextAppointment={data.nextAppointment}
      daySummary={data.daySummary}
      recentActivity={data.recentActivity}
      upcomingAppointments={data.upcomingAppointments}
      quickStats={data.quickStats}
      notifications={data.notifications}

      // Navegación
      onNewCita={()    => router.push('/admin/citas/nueva')}
      onClientes={()   => router.push('/admin/clientes')}
      onServicios={()  => router.push('/admin/servicios')}
      onCalendario={() => router.push('/admin/citas/calendario')}
      onReportes={()   => router.push('/admin/reportes')}
      onIngresos={()   => router.push('/admin/reportes/ingresos')}
      onViewCita={(id) => router.push(`/admin/citas/${id}`)}
      onViewAllCitas={()     => router.push('/admin/citas')}
      onViewAllActivity={()  => router.push('/admin/actividad')}
      onMarkNotifRead={()    => {}}
      onMarkAllNotifsRead={()=> {}}
      onReferral={()         => {}}
      onViewSummary={()      => router.push('/admin/reportes')}
      onViewAgenda={()       => router.push('/admin/citas')}
      onViewNotifications={()=> router.push('/admin/notificaciones')}
      onMenuOpen={()         => {}}
    />
  )
}
