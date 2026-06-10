// app/admin/reportes/ReportesPageClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ReportesDashboard from '@/components/admin/reportes/ReportesDashboard'

export default function ReportesPageClient() {
  const router   = useRouter()
  const supabase = createClient()
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const startMonth = new Date(); startMonth.setDate(1); startMonth.setHours(0,0,0,0)

      const { data: appts } = await supabase
        .from('appointments')
        .select('final_price, status, service_id, services(name)')
        .eq('status', 'completed')
        .gte('scheduled_at', startMonth.toISOString())

      const netRevenue = (appts ?? []).reduce((s, a) => s + (a.final_price ?? 0), 0)

      const serviceMap: Record<string, { name: string; revenue: number; color: string }> = {}
      const COLORS = ['#FF6B1A', '#0D0D0D', '#22C55E', '#3B82F6']
      let ci = 0
      ;(appts ?? []).forEach((a: any) => {
        const name = a.services?.name ?? 'Otros'
        if (!serviceMap[name]) serviceMap[name] = { name, revenue: 0, color: COLORS[ci++ % 4] }
        serviceMap[name].revenue += a.final_price ?? 0
      })

      const breakdown = Object.values(serviceMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)
        .map(s => ({
          name:   s.name,
          pct:    netRevenue > 0 ? Math.round((s.revenue / netRevenue) * 100) : 0,
          amount: s.revenue,
          color:  s.color,
        }))

      setData({ netRevenue, breakdown })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <ReportesDashboard
      period="Este mes"
      netRevenue={data?.netRevenue ?? 0}
      revenueChangePct={0}
      stats={{
        appointmentsCount: 0, appointmentsChangePct: 0,
        uniqueClients: 0,     clientsChangePct: 0,
        servicesSold: 0,      servicesChangePct: 0,
        avgTicket: 0,         avgTicketChangePct: 0,
        hoursWorked: '0h',    rescheduled: 0, rescheduledChangePct: 0,
      }}
      serviceBreakdown={data?.breakdown ?? []}
      onViewFull={()        => router.push('/admin/reportes/general')}
      onPeriodChange={()    => {}}
      onNotifications={()   => {}}
    />
  )
}
