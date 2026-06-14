'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Scissors, User, Calendar, CreditCard, Clock } from 'lucide-react'

function NuevaCitaContent() {
  const router     = useRouter()
  const params     = useSearchParams()
  const supabase   = createClient()
  const [step,        setStep]       = useState(1)
  const [services,    setServices]   = useState<any[]>([])
  const [slots,       setSlots]      = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate,    setSelectedDate]    = useState<string>('')
  const [selectedTime,    setSelectedTime]    = useState<string>('')
  const [notes,           setNotes]           = useState('')
  const [loading,         setLoading]         = useState(true)
  const [submitting,      setSubmitting]      = useState(false)

  // Generar fechas de los próximos 14 días
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return d
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('services').select('*').eq('is_active', true).order('display_order')
      setServices(data ?? [])
      const preselect = params.get('serviceId')
      if (preselect && data) {
        const svc = data.find((s: any) => s.id === preselect)
        if (svc) setSelectedService(svc)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    // Generar slots cada 30 min de 9am a 7pm
    const s: string[] = []
    for (let h = 9; h < 19; h++) {
      s.push(`${h.toString().padStart(2,'0')}:00`)
      s.push(`${h.toString().padStart(2,'0')}:30`)
    }
    setSlots(s)
  }, [selectedDate])

  async function handleConfirm() {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`)
    const { error } = await supabase.from('appointments').insert({
      client_id:    user.id,
      service_id:   selectedService.id,
      scheduled_at: scheduledAt.toISOString(),
      duration_min: selectedService.duration_min,
      status:       'pending',
      price:        selectedService.price,
      final_price:  selectedService.price,
    })
    if (error) { alert('Error al reservar: ' + error.message); setSubmitting(false); return }
    router.push('/app/citas?booked=1')
  }

  const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const DAY_NAMES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const STEPS = ['Servicio','Fecha y hora','Confirmar']

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#FFF' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#FFF', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => step > 1 ? setStep(s => s-1) : router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <ArrowLeft size={22} color="#0D0D0D" />
          </button>
          <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Reservar cita</div>
          <div style={{ width:30 }} />
        </div>

        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'flex-start', padding:'0 16px 16px', gap:0 }}>
          {STEPS.map((label, i) => {
            const n = i+1, done = n < step, active = n === step
            return (
              <div key={n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, position:'relative' }}>
                {i < STEPS.length-1 && <div style={{ position:'absolute', top:14, left:'50%', right:'-50%', height:2, background: done ? '#FF6B1A' : '#E5E5E5', zIndex:0 }} />}
                <div style={{ width:28, height:28, borderRadius:'50%', zIndex:1, background: done || active ? (done ? '#FF6B1A' : '#0D0D0D') : '#E5E5E5', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none' }}>
                  {done ? <Check size={14} color="#FFF" /> : <span style={{ color: active ? '#FFF' : '#999', fontSize:12, fontWeight:700 }}>{n}</span>}
                </div>
                <span style={{ fontSize:10, color: active ? '#0D0D0D' : '#999', fontWeight: active ? 700 : 400, textAlign:'center' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>

        {/* PASO 1: Seleccionar servicio */}
        {step === 1 && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Selecciona un servicio</div>
            {services.map(srv => {
              const isSel = selectedService?.id === srv.id
              return (
                <button key={srv.id} onClick={() => setSelectedService(srv)} style={{
                  display:'flex', alignItems:'center', gap:14, width:'100%',
                  padding:'14px 0', background:'none', border:'none',
                  borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left',
                }}>
                  <div style={{ width:52, height:52, borderRadius:12, background: isSel ? '#FF6B1A' : '#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 200ms' }}>
                    <Scissors size={22} color={isSel ? '#FFF' : '#666'} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'#0D0D0D', marginBottom:3 }}>{srv.name}</div>
                    <div style={{ fontSize:12, color:'#999', display:'flex', alignItems:'center', gap:4 }}>
                      <Clock size={11} /> {srv.duration_min} min
                    </div>
                  </div>
                  <div style={{ fontSize:17, fontWeight:800, color: isSel ? '#FF6B1A' : '#0D0D0D', flexShrink:0 }}>${srv.price}</div>
                  <div style={{ width:24, height:24, borderRadius:'50%', border: isSel ? 'none' : '2px solid #E5E5E5', background: isSel ? '#FF6B1A' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {isSel && <Check size={12} color="#FFF" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* PASO 2: Fecha y hora */}
        {step === 2 && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Selecciona fecha y hora</div>

            {/* Fechas */}
            <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', marginBottom:24 }}>
              {dates.map((d, i) => {
                const iso  = d.toISOString().split('T')[0]
                const isSel = selectedDate === iso
                return (
                  <button key={i} onClick={() => { setSelectedDate(iso); setSelectedTime('') }} style={{
                    flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center',
                    padding:'10px 12px', borderRadius:14,
                    background: isSel ? '#0D0D0D' : '#F5F5F5',
                    border:'none', cursor:'pointer', gap:4,
                    minWidth:56,
                  }}>
                    <span style={{ fontSize:11, color: isSel ? '#999' : '#999', fontWeight:500 }}>{DAY_NAMES[d.getDay()]}</span>
                    <span style={{ fontSize:18, fontWeight:800, color: isSel ? '#FFF' : '#0D0D0D' }}>{d.getDate()}</span>
                    <span style={{ fontSize:10, color: isSel ? 'rgba(255,255,255,0.6)' : '#CCC' }}>{MONTH_NAMES[d.getMonth()]}</span>
                  </button>
                )
              })}
            </div>

            {/* Slots */}
            {selectedDate && (
              <>
                <div style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', marginBottom:12 }}>Horarios disponibles</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                  {slots.map((slot, i) => {
                    const isSel = selectedTime === slot
                    return (
                      <button key={i} onClick={() => setSelectedTime(slot)} style={{
                        height:46, borderRadius:12, border:'none',
                        background: isSel ? '#FF6B1A' : '#F5F5F5',
                        color: isSel ? '#FFF' : '#0D0D0D',
                        fontSize:13, fontWeight: isSel ? 700 : 400,
                        cursor:'pointer', transition:'all 200ms',
                      }}>
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* PASO 3: Confirmar */}
        {step === 3 && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Resumen de tu cita</div>

            <div style={{ background:'#F9F9F9', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
              {[
                { icon:<Scissors size={18} color="#FF6B1A" />, label:'Servicio', value:`${selectedService?.name} — $${selectedService?.price}` },
                { icon:<Clock size={18} color="#666" />,       label:'Duración', value:`${selectedService?.duration_min} min` },
                { icon:<Calendar size={18} color="#666" />,    label:'Fecha',    value: new Date(selectedDate).toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' }) },
                { icon:<CreditCard size={18} color="#666" />,  label:'Hora',     value: selectedTime },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderBottom: i < 3 ? '1px solid #F0F0F0' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{row.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:'#999', marginBottom:2 }}>{row.label}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#0D0D0D' }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:8 }}>Notas (opcional)</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="¿Alguna indicación especial?" rows={3} style={{ width:'100%', padding:14, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' as const }} />
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F5F5F5', borderRadius:14, padding:16 }}>
              <span style={{ fontSize:15, fontWeight:600, color:'#666' }}>Total</span>
              <span style={{ fontSize:24, fontWeight:800, color:'#0D0D0D' }}>${selectedService?.price}</span>
            </div>
          </div>
        )}

        <div style={{ height:20 }} />
      </div>

      {/* Footer */}
      <div style={{ padding:'14px 16px calc(14px + env(safe-area-inset-bottom, 0px))', borderTop:'1px solid #F0F0F0', background:'#FFF', flexShrink:0 }}>
        <button
          onClick={() => {
            if (step === 1 && selectedService) setStep(2)
            else if (step === 2 && selectedDate && selectedTime) setStep(3)
            else if (step === 3) handleConfirm()
          }}
          disabled={
            (step === 1 && !selectedService) ||
            (step === 2 && (!selectedDate || !selectedTime)) ||
            submitting
          }
          style={{
            width:'100%', height:52,
            background: submitting ? '#E5E5E5' : ((step===1 && !selectedService) || (step===2 && (!selectedDate||!selectedTime))) ? '#E5E5E5' : '#FF6B1A',
            color: ((step===1 && !selectedService) || (step===2 && (!selectedDate||!selectedTime)) || submitting) ? '#999' : '#FFF',
            border:'none', borderRadius:14, fontSize:15, fontWeight:700,
            cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}
        >
          {submitting ? 'Confirmando...' : step === 3 ? 'Confirmar cita' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}

export default function NuevaCitaPage() {
  return (
    <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <NuevaCitaContent />
    </Suspense>
  )
}
