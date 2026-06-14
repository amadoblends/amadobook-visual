'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Calendar, Clock, Scissors, Check, ChevronRight } from 'lucide-react'

function MisCitasContent() {
  const router   = useRouter()
  const params   = useSearchParams()
  const supabase = createClient()
  const [tab,    setTab]    = useState<'proximas'|'historial'>('proximas')
  const [citas,  setCitas]  = useState<any[]>([])
  const [loading,setLoading]= useState(true)
  const [showSuccess, setShowSuccess] = useState(params.get('booked') === '1')

  useEffect(() => {
    if (showSuccess) setTimeout(() => setShowSuccess(false), 3000)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const now = new Date().toISOString()
      const query = supabase.from('appointments')
        .select('*, services(name, duration_min, price)')
        .eq('client_id', user.id)
        .order('scheduled_at', { ascending: tab === 'proximas' })

      if (tab === 'proximas') {
        query.gte('scheduled_at', now).in('status', ['pending','confirmed'])
      } else {
        query.or(`scheduled_at.lt.${now},status.in.(completed,cancelled,no_show)`)
      }

      const { data } = await query.limit(20)
      setCitas(data ?? [])
      setLoading(false)
    }
    load()
  }, [tab])

  const STATUS_MAP: Record<string,{label:string;bg:string;color:string}> = {
    pending:   { label:'Pendiente',  bg:'#FFFBEB', color:'#D97706' },
    confirmed: { label:'Confirmada', bg:'#F0FDF4', color:'#16A34A' },
    completed: { label:'Completada', bg:'#F9FAFB', color:'#6B7280' },
    cancelled: { label:'Cancelada',  bg:'#FEF2F2', color:'#DC2626' },
    no_show:   { label:'No asistió', bg:'#F5F3FF', color:'#7C3AED' },
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>

      {/* Success toast */}
      {showSuccess && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#22C55E', color:'#FFF', padding:'12px 20px', borderRadius:12, fontSize:14, fontWeight:600, zIndex:999, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
          <Check size={16} /> ¡Cita reservada con éxito!
        </div>
      )}

      {/* Header */}
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 12px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <ArrowLeft size={22} color="#0D0D0D" />
          </button>
          <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Mis citas</div>
          <div style={{ width:30 }} />
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', margin:'0 16px 14px', background:'#F5F5F5', borderRadius:12, padding:3, gap:2 }}>
          {[{key:'proximas' as const,label:'Próximas'},{key:'historial' as const,label:'Historial'}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer',
              background: tab === t.key ? '#FFF' : 'transparent',
              color: tab === t.key ? '#0D0D0D' : '#999',
              fontSize:14, fontWeight: tab === t.key ? 700 : 400,
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              fontFamily:'inherit',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : citas.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:64, gap:14 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Calendar size={32} color="#CCC" />
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>{tab === 'proximas' ? 'Sin citas próximas' : 'Sin historial'}</div>
            <div style={{ fontSize:14, color:'#999', textAlign:'center', maxWidth:240, lineHeight:1.6 }}>
              {tab === 'proximas' ? 'Reserva tu primera cita y aparecerá aquí.' : 'Tus citas pasadas aparecerán aquí.'}
            </div>
            {tab === 'proximas' && (
              <button onClick={() => router.push('/app/citas/nueva')} style={{ marginTop:8, height:48, padding:'0 28px', background:'#FF6B1A', color:'#FFF', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                + Reservar cita
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {citas.map((cita: any) => {
              const date = new Date(cita.scheduled_at)
              const cfg  = STATUS_MAP[cita.status] ?? STATUS_MAP.pending
              return (
                <div key={cita.id} style={{ background:'#FFF', borderRadius:16, padding:16, border:'1px solid #F0F0F0', display:'flex', alignItems:'center', gap:14 }}>
                  {/* Fecha badge */}
                  <div style={{ width:52, height:56, borderRadius:12, background: tab === 'proximas' ? '#FF6B1A' : '#F5F5F5', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, gap:1 }}>
                    <span style={{ fontSize:20, fontWeight:800, color: tab === 'proximas' ? '#FFF' : '#0D0D0D', lineHeight:1 }}>{date.getDate()}</span>
                    <span style={{ fontSize:10, fontWeight:600, color: tab === 'proximas' ? 'rgba(255,255,255,0.8)' : '#999', letterSpacing:'0.04em' }}>
                      {date.toLocaleDateString('es-MX', { month:'short' }).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{cita.services?.name}</div>
                    <div style={{ fontSize:12, color:'#999', marginBottom:6, display:'flex', alignItems:'center', gap:4 }}>
                      <Clock size={11} /> {date.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}
                    </div>
                    <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999 }}>{cfg.label}</span>
                  </div>

                  {/* Precio */}
                  <div style={{ fontSize:16, fontWeight:800, color:'#0D0D0D', flexShrink:0 }}>${cita.final_price}</div>
                </div>
              )
            })}
          </div>
        )}
        <div style={{ height:100 }} />
      </div>

      {/* FAB */}
      <button onClick={() => router.push('/app/citas/nueva')} style={{
        position:'fixed', bottom:24, right:24,
        height:52, padding:'0 20px', borderRadius:999,
        background:'#FF6B1A', color:'#FFF', border:'none',
        cursor:'pointer', fontSize:14, fontWeight:700,
        display:'flex', alignItems:'center', gap:8,
        boxShadow:'0 4px 16px rgba(255,107,26,0.38)', zIndex:10,
      }}>
        <Plus size={18} color="#FFF" /> Nueva cita
      </button>
    </div>
  )
}

export default function MisCitasPage() {
  return (
    <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <MisCitasContent />
    </Suspense>
  )
}
