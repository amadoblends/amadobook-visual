'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Scissors, Clock, Search, Calendar } from 'lucide-react'

export default function NuevaCitaAdmin() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [selSvc, setSelSvc] = useState<any>(null)
  const [selClient, setSelClient] = useState<any>(null)
  const [selDate, setSelDate] = useState('')
  const [selTime, setSelTime] = useState('')
  const [notes, setNotes] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate()+i); return d })
  const slots = Array.from({ length: 24 }, (_, i) => { const h=8+Math.floor(i/2), m=i%2===0?'00':'30'; return `${h.toString().padStart(2,'0')}:${m}` })
  const DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*').eq('is_active', true).order('display_order'),
      supabase.from('profiles').select('id,full_name,phone').eq('role','client').order('full_name'),
    ]).then(([{data:s},{data:c}]) => { setServices(s??[]); setClients(c??[]); setLoading(false) })
  }, [])

  async function confirm() {
    setSubmitting(true)
    const { error } = await supabase.from('appointments').insert({
      client_id: selClient.id, service_id: selSvc.id,
      scheduled_at: new Date(`${selDate}T${selTime}:00`).toISOString(),
      duration_min: selSvc.duration_min, status: 'confirmed',
      price: selSvc.price, final_price: selSvc.price, notes,
    })
    if (error) { alert(error.message); setSubmitting(false); return }
    router.push('/admin/citas')
  }

  const STEPS = ['Servicio','Cliente','Fecha y hora','Confirmar']
  const filtClients = clients.filter(c => !query || c.full_name?.toLowerCase().includes(query.toLowerCase()) || c.phone?.includes(query))
  const canNext = (step===1&&selSvc)||(step===2&&selClient)||(step===3&&selDate&&selTime)||step===4

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#FFF', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => step>1?setStep(s=>s-1):router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ArrowLeft size={22} color="#0D0D0D" /></button>
          <span style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Nueva cita</span>
          <div style={{ width:30 }} />
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', padding:'0 20px 18px', gap:0 }}>
          {STEPS.map((label,i) => {
            const n=i+1,done=n<step,active=n===step
            return (
              <div key={n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, position:'relative' }}>
                {i<STEPS.length-1&&<div style={{ position:'absolute', top:13, left:'50%', right:'-50%', height:2, background:done?'#FF6B1A':'#E5E5E5', zIndex:0 }} />}
                <div style={{ width:26, height:26, borderRadius:'50%', zIndex:1, background:done?'#FF6B1A':active?'#0D0D0D':'#E5E5E5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {done?<Check size={13} color="#FFF"/>:<span style={{ color:active?'#FFF':'#999', fontSize:11, fontWeight:700 }}>{n}</span>}
                </div>
                <span style={{ fontSize:9, color:active?'#0D0D0D':'#999', fontWeight:active?700:400, textAlign:'center', lineHeight:1.2 }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {step===1 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:'0 0 16px' }}>Selecciona un servicio</p>
          {services.map((s:any) => {
            const sel=selSvc?.id===s.id
            return <button key={s.id} onClick={()=>setSelSvc(s)} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', padding:'14px 0', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left' }}>
              <div style={{ width:48, height:48, borderRadius:12, background:sel?'#FF6B1A':'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Scissors size={20} color={sel?'#FFF':'#666'} /></div>
              <div style={{ flex:1 }}><p style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', margin:'0 0 2px' }}>{s.name}</p><p style={{ fontSize:12, color:'#999', margin:0 }}>{s.duration_min} min</p></div>
              <p style={{ fontSize:15, fontWeight:800, color:sel?'#FF6B1A':'#0D0D0D', margin:0 }}>${s.price}</p>
              <div style={{ width:22, height:22, borderRadius:'50%', border:sel?'none':'2px solid #E5E5E5', background:sel?'#FF6B1A':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{sel&&<Check size={12} color="#FFF"/>}</div>
            </button>
          })}
        </>}

        {step===2 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:'0 0 12px' }}>Selecciona un cliente</p>
          <div style={{ position:'relative', marginBottom:16 }}>
            <Search size={15} color="#999" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' } as any} />
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar cliente..." style={{ width:'100%', height:44, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
          </div>
          {filtClients.map((c:any) => {
            const sel=selClient?.id===c.id
            return <button key={c.id} onClick={()=>setSelClient(c)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'12px 0', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', textAlign:'left' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:sel?'#FF6B1A':'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:sel?'#FFF':'#666', flexShrink:0 }}>{c.full_name?.charAt(0)??'U'}</div>
              <div style={{ flex:1 }}><p style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', margin:'0 0 2px' }}>{c.full_name}</p><p style={{ fontSize:12, color:'#999', margin:0 }}>{c.phone??'Sin teléfono'}</p></div>
              <div style={{ width:22, height:22, borderRadius:'50%', border:sel?'none':'2px solid #E5E5E5', background:sel?'#FF6B1A':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{sel&&<Check size={12} color="#FFF"/>}</div>
            </button>
          })}
          {filtClients.length===0&&<p style={{ textAlign:'center', color:'#999', paddingTop:32 }}>No se encontraron clientes</p>}
        </>}

        {step===3 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:'0 0 16px' }}>Selecciona fecha y hora</p>
          <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', marginBottom:24 }}>
            {dates.map((d,i) => {
              const iso=d.toISOString().split('T')[0], sel=selDate===iso
              return <button key={i} onClick={()=>{setSelDate(iso);setSelTime('')}} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 14px', borderRadius:14, background:sel?'#0D0D0D':'#F5F5F5', border:'none', cursor:'pointer', gap:4, minWidth:52 }}>
                <span style={{ fontSize:10, color:sel?'#777':'#999' }}>{DAYS[d.getDay()]}</span>
                <span style={{ fontSize:20, fontWeight:800, color:sel?'#FFF':'#0D0D0D' }}>{d.getDate()}</span>
              </button>
            })}
          </div>
          {selDate&&<><p style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:12 }}>Horarios</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {slots.map((slot,i) => { const sel=selTime===slot; return <button key={i} onClick={()=>setSelTime(slot)} style={{ height:44, borderRadius:12, border:'none', background:sel?'#FF6B1A':'#F5F5F5', color:sel?'#FFF':'#0D0D0D', fontSize:13, fontWeight:sel?700:400, cursor:'pointer' }}>{slot}</button> })}
          </div></>}
        </>}

        {step===4 && <>
          <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:'0 0 16px' }}>Resumen de la cita</p>
          <div style={{ background:'#F9F9F9', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
            {[
              {label:'Servicio', value:`${selSvc?.name} — $${selSvc?.price}`},
              {label:'Cliente',  value:`${selClient?.full_name} · ${selClient?.phone??''}`},
              {label:'Fecha',    value:new Date(selDate).toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})},
              {label:'Hora',     value:selTime},
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom:i<3?'1px solid #F0F0F0':'none' }}>
                <span style={{ fontSize:13, color:'#666' }}>{r.label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', textAlign:'right', maxWidth:'60%' }}>{r.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', marginBottom:8 }}>Notas</p>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Indicaciones especiales..." rows={3} style={{ width:'100%', padding:14, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' as const, marginBottom:16 }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F5F5F5', borderRadius:14, padding:'16px 20px' }}>
            <span style={{ fontSize:15, fontWeight:600, color:'#666' }}>Total</span>
            <span style={{ fontSize:24, fontWeight:800, color:'#0D0D0D' }}>${selSvc?.price}</span>
          </div>
        </>}
        <div style={{ height:20 }} />
      </div>

      <div style={{ padding:'14px 16px calc(14px + env(safe-area-inset-bottom,0px))', borderTop:'1px solid #F0F0F0', background:'#FFF', flexShrink:0 }}>
        <button onClick={() => { if(step===1&&selSvc)setStep(2); else if(step===2&&selClient)setStep(3); else if(step===3&&selDate&&selTime)setStep(4); else if(step===4)confirm() }} disabled={!canNext||submitting} style={{ width:'100%', height:52, background:(!canNext||submitting)?'#E5E5E5':'#FF6B1A', color:(!canNext||submitting)?'#999':'#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:(!canNext||submitting)?'not-allowed':'pointer' }}>
          {submitting?'Creando...':step===4?'✓ Confirmar cita':'Siguiente'}
        </button>
      </div>
    </div>
  )
}
