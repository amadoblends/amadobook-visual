'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle } from 'lucide-react'
import ClientBottomNav from '@/components/client/BottomNav'

function MisCitas() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [tab, setTab] = useState<'proximas'|'historial'>('proximas')
  const [citas, setCitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(params.get('booked') === '1')

  useEffect(() => { if (toast) setTimeout(() => setToast(false), 3000) }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const now = new Date().toISOString()
      let query = supabase.from('appointments').select('*, services(name, duration_min, price)').eq('client_id', user.id).order('scheduled_at', { ascending: tab === 'proximas' })
      if (tab === 'proximas') query = query.gte('scheduled_at', now).in('status', ['pending','confirmed'])
      else query = query.or(`scheduled_at.lt.${now},status.in.(completed,cancelled)`)
      const { data } = await query.limit(20)
      setCitas(data ?? [])
      setLoading(false)
    }
    load()
  }, [tab])

  const STATUS: Record<string,{label:string;bg:string;color:string}> = {
    pending:   { label:'Pendiente',  bg:'#FFFBEB', color:'#D97706' },
    confirmed: { label:'Confirmada', bg:'#F0FDF4', color:'#16A34A' },
    completed: { label:'Completada', bg:'#F9FAFB', color:'#6B7280' },
    cancelled: { label:'Cancelada',  bg:'#FEF2F2', color:'#DC2626' },
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      {toast && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#22C55E', color:'#FFF', padding:'12px 20px', borderRadius:14, fontSize:14, fontWeight:600, zIndex:999, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }}>
          <CheckCircle size={16} /> ¡Cita reservada con éxito!
        </div>
      )}

      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 12px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ArrowLeft size={22} color="#0D0D0D" /></button>
          <span style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Mis citas</span>
          <div style={{ width:30 }} />
        </div>
        <div style={{ display:'flex', margin:'0 16px 14px', background:'#F5F5F5', borderRadius:12, padding:3, gap:2 }}>
          {[{k:'proximas',l:'Próximas'},{k:'historial',l:'Historial'}].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', background: tab===t.k ? '#FFF' : 'transparent', color: tab===t.k ? '#0D0D0D' : '#999', fontSize:14, fontWeight: tab===t.k ? 700 : 400, boxShadow: tab===t.k ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', fontFamily:'inherit' }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {loading ? <Spinner /> : citas.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:14 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center' }}><Calendar size={32} color="#CCC" /></div>
            <p style={{ fontSize:17, fontWeight:700, color:'#0D0D0D', margin:0 }}>{tab==='proximas' ? 'Sin citas próximas' : 'Sin historial'}</p>
            <p style={{ fontSize:14, color:'#999', textAlign:'center', maxWidth:220, lineHeight:1.6, margin:0 }}>{tab==='proximas' ? 'Reserva tu primera cita y aparecerá aquí.' : 'Tus citas pasadas aparecerán aquí.'}</p>
            {tab==='proximas' && <button onClick={() => router.push('/app/citas/nueva')} style={{ marginTop:8, height:48, padding:'0 28px', background:'#FF6B1A', color:'#FFF', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Reservar cita</button>}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {citas.map((c:any) => {
              const d = new Date(c.scheduled_at)
              const cfg = STATUS[c.status] ?? STATUS.pending
              return (
                <div key={c.id} style={{ background:'#FFF', borderRadius:16, padding:16, border:'1px solid #F0F0F0', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:52, height:56, borderRadius:12, background: tab==='proximas' ? '#FF6B1A' : '#F5F5F5', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, gap:1 }}>
                    <span style={{ fontSize:20, fontWeight:800, color: tab==='proximas' ? '#FFF' : '#0D0D0D', lineHeight:1 }}>{d.getDate()}</span>
                    <span style={{ fontSize:10, fontWeight:600, color: tab==='proximas' ? 'rgba(255,255,255,0.8)' : '#999', letterSpacing:'0.04em' }}>{d.toLocaleDateString('es-MX',{month:'short'}).toUpperCase()}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.services?.name}</p>
                    <p style={{ fontSize:12, color:'#999', margin:'0 0 6px', display:'flex', alignItems:'center', gap:4 }}><Clock size={11} /> {d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</p>
                    <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999 }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontSize:16, fontWeight:800, color:'#0D0D0D', margin:0, flexShrink:0 }}>${c.final_price}</p>
                </div>
              )
            })}
          </div>
        )}
        <div style={{ height:100 }} />
      </div>

      <button onClick={() => router.push('/app/citas/nueva')} style={{ position:'fixed', bottom:84, right:20, height:50, padding:'0 20px', borderRadius:999, background:'#FF6B1A', color:'#FFF', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(255,107,26,0.38)', zIndex:10 }}>
        <Plus size={18} color="#FFF" /> Nueva cita
      </button>

      <ClientBottomNav />
    </div>
  )
}

function Spinner() {
  return <div style={{ display:'flex', justifyContent:'center', paddingTop:48 }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
}

export default function MisCitasPage() {
  return <Suspense fallback={<Spinner />}><MisCitas /></Suspense>
}
