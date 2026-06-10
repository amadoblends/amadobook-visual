// app/admin/citas/CitasPageClient.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCitas } from '@/hooks/useCitas'
import CitasList, { DEMO_DAYS } from '@/components/admin/citas/CitasList'

export default function CitasPageClient() {
  const router = useRouter()
  const [activeDate, setActiveDate] = useState(new Date())
  const { appointments, loading, updateStatus } = useCitas(activeDate)

  // Generar strip de 7 días desde hoy
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 2 + i)
    const DAY_LABELS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
    return {
      dayShort: DAY_LABELS[d.getDay()],
      dayNum:   d.getDate(),
      date:     d.toISOString().split('T')[0],
    }
  })

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <CitasList
      days={days}
      appointments={appointments}
      onNewCita={()       => router.push('/admin/citas/nueva')}
      onViewCita={(id)    => router.push(`/admin/citas/${id}`)}
      onConfirm={(id)     => updateStatus(id, 'confirmed')}
      onComplete={(id)    => updateStatus(id, 'completed')}
      onReschedule={(id)  => router.push(`/admin/citas/${id}?action=reschedule`)}
      onCancel={(id)      => updateStatus(id, 'cancelled')}
    />
  )
}
