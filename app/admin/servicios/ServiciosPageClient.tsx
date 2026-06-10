// app/admin/servicios/ServiciosPageClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ServiciosList from '@/components/admin/servicios/ServiciosList'

export default function ServiciosPageClient() {
  const router   = useRouter()
  const supabase = createClient()
  const [tab,      setTab]      = useState<'servicios'|'paquetes'|'ofertas'>('servicios')
  const [services, setServices] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('display_order')
      setServices(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('services').update({ is_active: active }).eq('id', id)
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: active } : s))
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const formatted = services.map(s => ({
    id:       s.id,
    name:     s.name,
    duration: s.duration_min,
    price:    s.price,
    isActive: s.is_active,
  }))

  return (
    <ServiciosList
      services={formatted}
      totalServices={services.length}
      activeServices={services.filter(s => s.is_active).length}
      totalPackages={0}
      activeOffers={0}
      activeTab={tab}
      onTabChange={setTab}
      onNewServicio={() => router.push('/admin/servicios/nuevo')}
      onEdit={(id)        => router.push(`/admin/servicios/${id}/editar`)}
      onToggleActive={toggleActive}
      onDelete={async (id) => {
        await supabase.from('services').delete().eq('id', id)
        setServices(prev => prev.filter(s => s.id !== id))
      }}
    />
  )
}
