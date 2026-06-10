// hooks/useDashboard.ts
// Obtiene todos los datos necesarios para el dashboard del admin

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export interface DashboardData {
  adminName: string
  adminAvatar?: string
  appointmentsToday: number
  nextAppointment?: {
    id: string
    time: string
    clientName: string
    service: string
    clientAvatar?: string
    appointmentId: string
  }
  daySummary: {
    dayRevenue: number
    revenueChangePct: number
    revenueSparkline: number[]
    completedAppointments: number
    totalAppointments: number
  }
  upcomingAppointments: {
    id: string
    time: string
    date: string
    clientName: string
    clientAvatar?: string
    service: string
    status: 'pending' | 'confirmed'
  }[]
  recentActivity: {
    id: string
    type: 'new_appointment' | 'appointment_completed' | 'payment_received' | 'new_client' | 'appointment_cancelled' | 'appointment_rescheduled'
    title: string
    subtitle: string
    time: string
  }[]
  quickStats: {
    id: string
    label: string
    value: string
    changePct: number
    sparkline: number[]
  }[]
  notifications: {
    id: string
    type: 'new_appointment' | 'appointment_completed' | 'payment_received' | 'new_client' | 'reminder' | 'appointment_cancelled'
    title: string
    body: string
    time: string
    isRead: boolean
  }[]
}

export function useDashboard() {
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)

        // Usuario actual
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No autenticado')

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()

        // Fechas
        const today     = new Date()
        const startDay  = new Date(today); startDay.setHours(0,0,0,0)
        const endDay    = new Date(today); endDay.setHours(23,59,59,999)
        const tomorrow  = new Date(today); tomorrow.setDate(tomorrow.getDate() + 7)

        // Citas de hoy
        const { data: todayAppts } = await supabase
          .from('appointments')
          .select(`
            id, scheduled_at, status, final_price,
            profiles!appointments_client_id_fkey(full_name, avatar_url),
            services(name)
          `)
          .gte('scheduled_at', startDay.toISOString())
          .lte('scheduled_at', endDay.toISOString())
          .neq('status', 'cancelled')
          .order('scheduled_at')

        // Próximas citas (7 días)
        const { data: upcomingAppts } = await supabase
          .from('appointments')
          .select(`
            id, scheduled_at, status,
            profiles!appointments_client_id_fkey(full_name, avatar_url),
            services(name)
          `)
          .gt('scheduled_at', new Date().toISOString())
          .lte('scheduled_at', tomorrow.toISOString())
          .in('status', ['pending', 'confirmed'])
          .order('scheduled_at')
          .limit(8)

        // Notificaciones
        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('sent_at', { ascending: false })
          .limit(5)

        // Calcular métricas del día
        const completed   = todayAppts?.filter(a => a.status === 'completed') ?? []
        const dayRevenue  = completed.reduce((sum, a) => sum + (a.final_price ?? 0), 0)

        // Próxima cita (la siguiente en el tiempo)
        const nextAppt    = upcomingAppts?.[0]
        const nextApptFormatted = nextAppt ? {
          id:             nextAppt.id,
          appointmentId:  nextAppt.id,
          time:           new Date(nextAppt.scheduled_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          clientName:     (nextAppt.profiles as any)?.full_name ?? 'Cliente',
          service:        (nextAppt.services as any)?.name ?? 'Servicio',
          clientAvatar:   (nextAppt.profiles as any)?.avatar_url,
        } : undefined

        // Formatear upcoming
        const upcomingFormatted = (upcomingAppts ?? []).map(a => {
          const date = new Date(a.scheduled_at)
          const isToday     = date.toDateString() === today.toDateString()
          const isTomorrow  = date.toDateString() === new Date(today.getTime() + 86400000).toDateString()
          const dateLabel   = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
          return {
            id:           a.id,
            time:         date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            date:         dateLabel,
            clientName:   (a.profiles as any)?.full_name ?? 'Cliente',
            clientAvatar: (a.profiles as any)?.avatar_url,
            service:      (a.services as any)?.name ?? 'Servicio',
            status:       a.status as 'pending' | 'confirmed',
          }
        })

        // Formatear notificaciones
        const notifsFormatted = (notifs ?? []).map(n => ({
          id:      n.id,
          type:    n.type as any,
          title:   n.title,
          body:    n.body,
          time:    formatTimeAgo(n.sent_at),
          isRead:  n.is_read,
        }))

        setData({
          adminName:              profile?.full_name ?? 'Admin',
          adminAvatar:            profile?.avatar_url ?? undefined,
          appointmentsToday:      todayAppts?.length ?? 0,
          nextAppointment:        nextApptFormatted,
          daySummary: {
            dayRevenue,
            revenueChangePct:       0,
            revenueSparkline:       [100, 200, 150, 300, 250, dayRevenue || 100],
            completedAppointments:  completed.length,
            totalAppointments:      todayAppts?.length ?? 0,
          },
          upcomingAppointments:   upcomingFormatted,
          recentActivity:         [],
          quickStats: [
            { id: 'revenue',  label: 'Facturación',        value: `$${dayRevenue.toLocaleString()}`, changePct: 0, sparkline: [100,200,150,300,dayRevenue||100] },
            { id: 'appts',    label: 'Citas completadas',  value: String(completed.length),          changePct: 0, sparkline: [2,3,1,4,completed.length||0]     },
            { id: 'clients',  label: 'Nuevos clientes',    value: '0',                               changePct: 0, sparkline: [1,2,1,3,0]                       },
          ],
          notifications: notifsFormatted,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()

    // Suscripción en tiempo real a nuevas citas
    const channel = supabase
      .channel('dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchDashboard)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { data, loading, error }
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60)  return `${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs} h`
  return 'Ayer'
}
