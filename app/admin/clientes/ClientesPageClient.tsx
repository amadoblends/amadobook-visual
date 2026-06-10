// app/admin/clientes/ClientesPageClient.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useClientes } from '@/hooks/useClientes'
import ClientesList from '@/components/admin/clientes/ClientesList'

export default function ClientesPageClient() {
  const router = useRouter()
  const { clients, loading, totals } = useClientes()

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <ClientesList
      clients={clients as any}
      totalClients={totals.total}
      activeClients={totals.active}
      newThisMonth={totals.newThisMonth}
      onNewCliente={()    => router.push('/admin/clientes/nuevo')}
      onView={(id)        => router.push(`/admin/clientes/${id}`)}
      onNewCita={(id)     => router.push(`/admin/clientes/${id}/nueva-cita`)}
      onHistorial={(id)   => router.push(`/admin/clientes/${id}/historial`)}
      onEdit={(id)        => router.push(`/admin/clientes/${id}/editar`)}
      onCall={(phone)     => window.open(`tel:${phone}`)}
      onMessage={(phone)  => window.open(`sms:${phone}`)}
    />
  )
}
