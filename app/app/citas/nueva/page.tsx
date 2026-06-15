'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Scissors, Clock, Calendar, ChevronRight } from 'lucide-react'

function NuevaCita() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<any[]>([])
  const [selectedSvc, setSelectedSvc] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d })
  const slots = Array.from({ length: 22 }, (_, i) => { const h = 8 + Math.floor(i/2), m = i%2===0?'00':'30'; return `${h.toString().padStart(2,'0')}:${m}` })
  const DAYS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      setServices(data ?? [])
      const pre = params.get('serviceId')
      if (pre && data) setSelectedSvc(data.find((s:any) => s.id === pre) ?? null)
      setLoading(false)
    })
  }, [])

  async function confirm() {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('appointments').insert({
      client_id: user.id, service_id: selectedSvc.id,
      scheduled_at: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
      duration_min: selectedSvc.duration_min, status: 'pending',
      price: selectedSvc.price, final_price: selectedSvc.price, notes,
    })
    if (error) { alert(error.message); setSubmitting(false); return }
    router.push('/app/citas?booked=1')
  }

  const canNext = (step===1 && selectedSvc) || (step===2 && selectedDate && selectedTime) || step===3
  const STEPS = ['Servicio', 'Fecha y hora', 'Confirmar']

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><Spinner /></div>

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#FFF', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => step > 1 ? setStep(s=>s-1) : router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ArrowLeft size={22} color="#0D0D0D" /></button>
          <span style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Reservar cita</span>
          <div style={{ width:30 }} />
        </div>
        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'flex-start', padding:'0 20px 18px', gap:0 }}>
          {STEPS.map((label, i) => {
            const n=i+1, done=n<step, active=n===step
            return (
              <div key={n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, position:'relative' }}>
                {i < STEPS.length-1 && <div style={{ position:'absolute', top:13, left:'50%', right:'-50%', height:2, background: done?'#FF6B1A':'#E5E5E5', zIndex:0 }} />}
                <div style={{ width:26, height:26, borderRadius:'50%', zIndex:1, background: done?'#FF6B1A': active?'#0D0D0D':'#E5E5E5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {done ? <Check size={13} color="#FFF" /> : <span style={{ color: active?'#FFF':'#999', fontSize:11, fontWeight:700 }}>{n}</span>}
                </div>
                <span style={{ fontSize:10, color: active?'#0D0D0D':'#999', fontWeight: active?700:400, textAlign:'center', lineHeight:1.2 }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        {/* Paso 1 */}
        {step === 1 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16, marginTop:0 }}>¿Qué servicio necesitas?</p>
          {services.map((s:any) => {
            const sel = selectedSvc?.id === s.id
            return (
              <button key={s.id} onClick={() => setSelectedSvc(s)} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', padding:'14px 0', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left' }}>
                <div style={{ width:50, height:50, borderRadius:12, background: sel?'#FF6B1A':'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 200ms' }}>
                  <Scissors size={20} color={sel?'#FFF':'#666'} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:600, color:'#0D0D0D', margin:'0 0 3px' }}>{s.name}</p>
                  <p style={{ fontSize:12, color:'#999', margin:0, display:'flex', alignItems:'center', gap:4 }}><Clock size={11} />{s.duration_min} min</p>
                </div>
                <p style={{ fontSize:16, fontWeight:800, color: sel?'#FF6B1A':'#0D0D0D', margin:0 }}>${s.price}</p>
                <div style={{ width:22, height:22, borderRadius:'50%', border: sel?'none':'2px solid #E5E5E5', background: sel?'#FF6B1A':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {sel && <Check size={12} color="#FFF" />}
                </div>
              </button>
            )
          })}
        </>}

        {/* Paso 2 */}
        {step === 2 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16, marginTop:0 }}>¿Cuándo te venemos bien?</p>
          <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', marginBottom:24, paddingBottom:4 }}>
            {dates.map((d,i) => {
              const iso = d.toISOString().split('T')[0], sel = selectedDate===iso
              return (
                <button key={i} onClick={() => { setSelectedDate(iso); setSelectedTime('') }} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 14px', borderRadius:14, background: sel?'#0D0D0D':'#F5F5F5', border:'none', cursor:'pointer', gap:4, minWidth:54 }}>
                  <span style={{ fontSize:11, color: sel?'#777':'#999', fontWeight:500 }}>{DAYS[d.getDay()]}</span>
                  <span style={{ fontSize:20, fontWeight:800, color: sel?'#FFF':'#0D0D0D' }}>{d.getDate()}</span>
                </button>
              )
            })}
          </div>
          {selectedDate && <>
            <p style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:12 }}>Horarios disponibles</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {slots.map((slot,i) => {
                const sel = selectedTime===slot
                return <button key={i} onClick={() => setSelectedTime(slot)} style={{ height:46, borderRadius:12, border:'none', background: sel?'#FF6B1A':'#F5F5F5', color: sel?'#FFF':'#0D0D0D', fontSize:13, fontWeight: sel?700:400, cursor:'pointer', transition:'all 150ms' }}>{slot}</button>
              })}
            </div>
          </>}
        </>}

        {/* Paso 3 */}
        {step === 3 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:16, marginTop:0 }}>Confirma tu cita</p>
          <div style={{ background:'#F9F9F9', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
            {[
              { icon:<Scissors size={16} color="#FF6B1A"/>, label:'Servicio', value:`${selectedSvc?.name}` },
              { icon:<Clock size={16} color="#666"/>,       label:'Duración', value:`${selectedSvc?.duration_min} min` },
              { icon:<Calendar size={16} color="#666"/>,    label:'Fecha',    value:new Date(selectedDate).toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'}) },
              { icon:<Clock size={16} color="#666"/>,       label:'Hora',     value:selectedTime },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderBottom: i<3?'1px solid #F0F0F0':'none' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{r.icon}</div>
                <div><p style={{ fontSize:11, color:'#999', margin:'0 0 2px' }}>{r.label}</p><p style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', margin:0 }}>{r.value}</p></div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:8 }}>Notas (opcional)</p>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="¿Alguna indicación especial?" rows={3} style={{ width:'100%', padding:14, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' as const }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F5F5F5', borderRadius:14, padding:'16px 20px' }}>
            <span style={{ fontSize:15, fontWeight:600, color:'#666' }}>Total</span>
            <span style={{ fontSize:24, fontWeight:800, color:'#0D0D0D' }}>${selectedSvc?.price}</span>
          </div>
        </>}
        <div style={{ height:20 }} />
      </div>

      <div style={{ padding:'14px 16px calc(14px + env(safe-area-inset-bottom,0px))', borderTop:'1px solid #F0F0F0', background:'#FFF', flexShrink:0 }}>
        <button onClick={() => { if(step===1&&selectedSvc)setStep(2); else if(step===2&&selectedDate&&selectedTime)setStep(3); else if(step===3)confirm() }} disabled={!canNext||submitting} style={{ width:'100%', height:52, background: (!canNext||submitting)?'#E5E5E5':'#FF6B1A', color: (!canNext||submitting)?'#999':'#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor: (!canNext||submitting)?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {submitting ? 'Confirmando...' : step===3 ? '✓ Confirmar cita' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return <><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></>
}

export default function NuevaCitaPage() {
  return <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><Spinner /></div>}><NuevaCita /></Suspense>
}
