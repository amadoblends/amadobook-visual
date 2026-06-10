// hooks/useCitas.ts
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'

export interface CitaData {
  id: string
  time: string
  clientName: string
  clientPhone: string
  clientAvatar?: string
  service: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  price: number
  scheduledAt: string
}

export function useCitas(date?: Date) {
  const [appointments, setAppointments] = useState<CitaData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCitas = useCallback(async () => {
    setLoading(true)
    const target    = date ?? new Date()
    const startDay  = new Date(target); startDay.setHours(0,0,0,0)
    const endDay    = new Date(target); endDay.setHours(23,59,59,999)

    const { data } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_at, status, final_price,
        profiles!appointments_client_id_fkey(full_name, phone, avatar_url),
        services(name)
      `)
      .gte('scheduled_at', startDay.toISOString())
      .lte('scheduled_at', endDay.toISOString())
      .order('scheduled_at')

    setAppointments((data ?? []).map((a: any) => ({
      id:           a.id,
      time:         new Date(a.scheduled_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      clientName:   a.profiles?.full_name  ?? 'Cliente',
      clientPhone:  a.profiles?.phone      ?? '',
      clientAvatar: a.profiles?.avatar_url ?? undefined,
      service:      a.services?.name       ?? 'Servicio',
      status:       a.status,
      price:        a.final_price ?? 0,
      scheduledAt:  a.scheduled_at,
    })))
    setLoading(false)
  }, [date?.toDateString()])

  useEffect(() => { fetchCitas() }, [fetchCitas])

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from('appointments')
      .update({
        status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
        ...(status === 'cancelled' ? { cancelled_at: new Date().toISOString() } : {}),
      })
      .eq('id', id)
    fetchCitas()
  }

  return { appointments, loading, updateStatus, refetch: fetchCitas }
}
