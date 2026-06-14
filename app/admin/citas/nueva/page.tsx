'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Scissors, User, Calendar, Clock, Search } from 'lucide-react'

export default function NuevaCitaAdminPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [step,        setStep]       = useState(1)
  const [services,    setServices]   = useState<any[]>([])
  const [clients,     setClients]    = useState<any[]>([])
  const [slots,       setSlots]      = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedClient,  setSelectedClient]  = useState<any>(null)
  const [selectedDate,    setSelectedDate]    = useState('')
  const [selectedTime,    setSelectedTime]    = useState('')
  const [notes,           setNotes]           = useState('')
  const [clientQuery,     setClientQuery]     = useState('')
  const [loading,         setLoading]         = useState(true)
  const [submitting,      setSubmitting]      = useState(false)

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d
  })

  useEffect(() => {
    async function load() {
      const [{ data: svcs }, { data: cls }] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('profiles').select('id, full_name, phone, avatar_url').eq('role', 'client').order('full_name'),
      ])
      setServices(svcs ?? [])
      setClients(cls ?? [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    const s: string[] = []
    for (let h = 8; h < 20; h++) { s.push(`${h.toString().padStart(2,'0')}:00`); s.push(`${h.toString().padStart(2,'0')}:30`) }
    setSlots(s)
  }, [selectedDate])

  async function handleConfirm() {
    setSubmitting(true)
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`)
    const { error } = await supabase.from('appointments').insert({
      client_id:    selectedClient.id,
      service_id:   selectedService.id,
      scheduled_at: scheduledAt.toISOString(),
      duration_min: selectedService.duration_min,
      status:       'confirmed',
      price:        selectedService.price,
      final_price:  selectedService.price,
      notes,
    })
    if (error) { alert('Error: ' + error.message); setSubmitting(false); return }
    router.push('/admin/citas')
  }

  const STEPS = ['Servicio','Cliente','Fecha y hora','Confirmar']
  const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const filteredClients = clients.filter(c => !clientQuery || c.full_name?.toLowerCase().includes(clientQuery.toLowerCase()) || c.phone?.includes(clientQuery))

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
          <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Nueva cita</div>
          <div style={{ width:30 }} />
        </div>

        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'flex-start', padding:'0 16px 16px', gap:0 }}>
          {STEPS.map((label, i) => {
            const n = i+1, done = n < step, active = n === step
            return (
              <div key={n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, position:'relative' }}>
                {i < STEPS.length-1 && <div style={{ position:'absolute', top:14, left:'50%', right:'-50%', height:2, background: done ? '#FF6B1A' : '#E5E5E5', zIndex:0 }} />}
                <div style={{ width:28, height:28, borderRadius:'50%', zIndex:1, background: done ? '#FF6B1A' : active ? '#0D0D0D' : '#E5E5E5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {done ? <Check size={14} color="#FFF" /> : <span style={{ color: active ? '#FFF' : '#999', fontSize:12, fontWeight:700 }}>{n}</span>}
                </div>
                <span style={{ fontSize:9, color: active ? '#0D0D0D' : '#999', fontWeight: active ? 700 : 400, textAlign:'center', lineHeight:1.2 }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {/* Paso 1: Servicio */}
        {step === 1 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Selecciona un servicio</div>
            {services.map(srv => {
              const isSel = selectedService?.id === srv.id
              return (
                <button key={srv.id} onClick={() => setSelectedService(srv)} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', padding:'14px 0', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ width:48, height:48, borderRadius:12, background: isSel ? '#FF6B1A' : '#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Scissors size={20} color={isSel ? '#FFF' : '#666'} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', marginBottom:2 }}>{srv.name}</div>
                    <div style={{ fontSize:12, color:'#999' }}>{srv.duration_min} min</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color: isSel ? '#FF6B1A' : '#0D0D0D' }}>${srv.price}</div>
                  <div style={{ width:22, height:22, borderRadius:'50%', border: isSel ? 'none' : '2px solid #E5E5E5', background: isSel ? '#FF6B1A' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {isSel && <Check size={12} color="#FFF" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Paso 2: Cliente */}
        {step === 2 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:12 }}>Selecciona un cliente</div>
            <div style={{ position:'relative', marginBottom:16 }}>
              <Search size={16} color="#999" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              <input type="text" value={clientQuery} onChange={e => setClientQuery(e.target.value)} placeholder="Buscar cliente..." style={{ width:'100%', height:44, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
            </div>
            {filteredClients.map(client => {
              const isSel = selectedClient?.id === client.id
              return (
                <button key={client.id} onClick={() => setSelectedClient(client)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'12px 0', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background: isSel ? '#FF6B1A' : '#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color: isSel ? '#FFF' : '#666', flexShrink:0 }}>
                    {client.full_name?.charAt(0) ?? 'U'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#0D0D0D' }}>{client.full_name}</div>
                    <div style={{ fontSize:12, color:'#999', marginTop:2 }}>{client.phone ?? 'Sin teléfono'}</div>
                  </div>
                  <div style={{ width:22, height:22, borderRadius:'50%', border: isSel ? 'none' : '2px solid #E5E5E5', background: isSel ? '#FF6B1A' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {isSel && <Check size={12} color="#FFF" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Paso 3: Fecha y hora */}
        {step === 3 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Selecciona fecha y hora</div>
            <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', marginBottom:24 }}>
              {dates.map((d, i) => {
                const iso = d.toISOString().split('T')[0]
                const isSel = selectedDate === iso
                return (
                  <button key={i} onClick={() => { setSelectedDate(iso); setSelectedTime('') }} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 12px', borderRadius:14, background: isSel ? '#0D0D0D' : '#F5F5F5', border:'none', cursor:'pointer', gap:4, minWidth:52 }}>
                    <span style={{ fontSize:10, color: isSel ? '#888' : '#999' }}>{DAY_NAMES[d.getDay()]}</span>
                    <span style={{ fontSize:18, fontWeight:800, color: isSel ? '#FFF' : '#0D0D0D' }}>{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
            {selectedDate && (
              <>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:12 }}>Horarios disponibles</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                  {slots.map((slot, i) => {
                    const isSel = selectedTime === slot
                    return (
                      <button key={i} onClick={() => setSelectedTime(slot)} style={{ height:44, borderRadius:12, border:'none', background: isSel ? '#FF6B1A' : '#F5F5F5', color: isSel ? '#FFF' : '#0D0D0D', fontSize:13, fontWeight: isSel ? 700 : 400, cursor:'pointer' }}>
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Paso 4: Confirmar */}
        {step === 4 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16 }}>Resumen de la cita</div>
            <div style={{ background:'#F9F9F9', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
              {[
                { label:'Servicio',  value:`${selectedService?.name} — $${selectedService?.price}` },
                { label:'Cliente',   value:`${selectedClient?.full_name} · ${selectedClient?.phone ?? ''}` },
                { label:'Fecha',     value: new Date(selectedDate).toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' }) },
                { label:'Hora',      value: selectedTime },
                { label:'Duración',  value:`${selectedService?.duration_min} min` },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom: i < 4 ? '1px solid #F0F0F0' : 'none' }}>
                  <span style={{ fontSize:13, color:'#666' }}>{row.label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', textAlign:'right', maxWidth:'60%' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:8 }}>Notas (opcional)</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Indicaciones especiales..." rows={3} style={{ width:'100%', padding:14, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' as const }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F5F5F5', borderRadius:14, padding:16 }}>
              <span style={{ fontSize:15, fontWeight:600, color:'#666' }}>Total</span>
              <span style={{ fontSize:24, fontWeight:800, color:'#0D0D0D' }}>${selectedService?.price}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:'14px 16px calc(14px + env(safe-area-inset-bottom, 0px))', borderTop:'1px solid #F0F0F0', background:'#FFF', flexShrink:0 }}>
        <button
          onClick={() => {
            if (step === 1 && selectedService) setStep(2)
            else if (step === 2 && selectedClient) setStep(3)
            else if (step === 3 && selectedDate && selectedTime) setStep(4)
            else if (step === 4) handleConfirm()
          }}
          disabled={
            (step===1 && !selectedService) || (step===2 && !selectedClient) ||
            (step===3 && (!selectedDate||!selectedTime)) || submitting
          }
          style={{
            width:'100%', height:52,
            background: submitting ? '#E5E5E5' : ((step===1&&!selectedService)||(step===2&&!selectedClient)||(step===3&&(!selectedDate||!selectedTime))) ? '#E5E5E5' : '#FF6B1A',
            color: '#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer',
          }}
        >
          {submitting ? 'Creando cita...' : step === 4 ? 'Confirmar cita' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}
