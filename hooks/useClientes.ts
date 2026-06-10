// hooks/useClientes.ts
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'

export interface ClienteData {
  id: string
  name: string
  phone: string
  avatar?: string
  appointmentCount: number
  status: 'active' | 'inactive'
}

export function useClientes() {
  const [clients, setClients]   = useState<ClienteData[]>([])
  const [loading, setLoading]   = useState(true)
  const [totals, setTotals]     = useState({ total: 0, active: 0, newThisMonth: 0 })
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, status')
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    // Contar citas por cliente
    const { data: apptCounts } = await supabase
      .from('appointments')
      .select('client_id')

    const countMap: Record<string, number> = {}
    apptCounts?.forEach((a: any) => {
      countMap[a.client_id] = (countMap[a.client_id] ?? 0) + 1
    })

    const formatted = (data ?? []).map((p: any) => ({
      id:               p.id,
      name:             p.full_name,
      phone:            p.phone ?? '',
      avatar:           p.avatar_url ?? undefined,
      appointmentCount: countMap[p.id] ?? 0,
      status:           p.status ?? 'active',
    }))

    const startMonth = new Date(); startMonth.setDate(1); startMonth.setHours(0,0,0,0)
    const { count: newCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('role', 'client')
      .gte('created_at', startMonth.toISOString())

    setClients(formatted)
    setTotals({
      total:        formatted.length,
      active:       formatted.filter(c => c.status === 'active').length,
      newThisMonth: newCount ?? 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { clients, loading, totals, refetch: fetch }
}
