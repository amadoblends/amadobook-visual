'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, Plus, ChevronLeft, ChevronRight, Check, X, Clock, MoreVertical } from 'lucide-react'
import AdminBottomNav from '@/components/admin/BottomNav'

const DAYS_SHORT = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const STATUS_CONFIG: Record<string,{label:string;bg:string;color:string}> = {
  pending:   { label:'Pendiente',  bg:'#FFFBEB', color:'#D97706' },
  confirmed: { label:'Confirmada', bg:'#F0FDF4', color:'#16A34A' },
  completed: { label:'Completada', bg:'#F9FAFB', color:'#6B7280' },
  cancelled: { label:'Cancelada',  bg:'#FEF2F2', color:'#DC2626' },
}

export default function CitasAdminClient() {
  const router = useRouter()
  const supabase = createClient()
  const [activeDate, setActiveDate] = useState(new Date())
  const [filter, setFilter] = useState<'all'|'pending'|'confirmed'|'cancelled'>('all')
  const [citas, setCitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMenu, setActionMenu] = useState<string|null>(null)

  // Generar 7 días centrados en hoy
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 3 + i)
    return d
  })

  useEffect(() => {
    loadCitas()
  }, [activeDate])

  async function loadCitas() {
    setLoading(true)
    const start = new Date(activeDate); start.setHours(0,0,0,0)
    const end   = new Date(activeDate); end.setHours(23,59,59,999)
    const { data } = await supabase
      .from('appointments')
      .select('*, profiles!appointments_client_id_fkey(full_name, phone, avatar_url), services(name, duration_min, price)')
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString())
      .order('scheduled_at')
    setCitas(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({
      status,
      ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
      ...(status === 'cancelled'  ? { cancelled_at: new Date().toISOString() } : {}),
    }).eq('id', id)
    setActionMenu(null)
    loadCitas()
  }

  const filtered = filter === 'all' ? citas : citas.filter(c => c.status === filter)
  const counts = {
    all:       citas.length,
    pending:   citas.filter(c => c.status === 'pending').length,
    confirmed: citas.filter(c => c.status === 'confirmed').length,
    cancelled: citas.filter(c => c.status === 'cancelled').length,
  }

  const dateLabel = activeDate.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 12px' }}>
          <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round"/></svg>
          </button>
          <p style={{ fontSize:18, fontWeight:700, color:'#0D0D0D', margin:0 }}>Citas</p>
          <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Bell size={22} color="#0D0D0D" /></button>
        </div>

        {/* Strip de días */}
        <div style={{ display:'flex', gap:4, padding:'0 12px 12px', overflowX:'auto', scrollbarWidth:'none' }}>
          {weekDays.map((d, i) => {
            const isActive = d.toDateString() === activeDate.toDateString()
            const isToday  = d.toDateString() === new Date().toDateString()
            return (
              <button key={i} onClick={() => setActiveDate(new Date(d))} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 10px', borderRadius:12, background: isActive?'#0D0D0D':'transparent', border:'none', cursor:'pointer', gap:4, minWidth:46 }}>
                <span style={{ fontSize:11, color: isActive?'#888':isToday?'#FF6B1A':'#999', fontWeight:500 }}>{DAYS_SHORT[(d.getDay()+6)%7]}</span>
                <span style={{ fontSize:17, fontWeight:800, color: isActive?'#FFF':isToday?'#FF6B1A':'#0D0D0D' }}>{d.getDate()}</span>
              </button>
            )
          })}
        </div>

        {/* Filtros */}
        <div style={{ display:'flex', gap:8, padding:'0 16px 14px', overflowX:'auto', scrollbarWidth:'none' }}>
          {(['all','pending','confirmed','cancelled'] as const).map(f => {
            const labels = { all:'Todos', pending:'Pendientes', confirmed:'Confirmadas', cancelled:'Canceladas' }
            const isActive = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:999, border: isActive?'none':'1px solid #E5E5E5', background: isActive?'#0D0D0D':'transparent', color: isActive?'#FFF':'#666', fontSize:13, fontWeight: isActive?600:400, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
                {labels[f]}
                <span style={{ background: isActive?'rgba(255,255,255,0.2)':'#F0F0F0', color: isActive?'#FFF':'#666', fontSize:11, fontWeight:700, borderRadius:999, padding:'1px 7px' }}>{counts[f]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {!loading && <p style={{ fontSize:13, fontWeight:600, color:'#666', margin:'0 0 14px', textTransform:'capitalize' }}>{dateLabel}</p>}

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:14 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>📅</div>
            <p style={{ fontSize:16, fontWeight:700, color:'#0D0D0D', margin:0 }}>Sin citas</p>
            <p style={{ fontSize:14, color:'#999', textAlign:'center', margin:0 }}>No hay citas para este día con los filtros seleccionados.</p>
          </div>
        ) : filtered.map((cita:any) => {
          const d = new Date(cita.scheduled_at)
          const cfg = STATUS_CONFIG[cita.status] ?? STATUS_CONFIG.pending
          const initials = (cita.profiles?.full_name ?? 'C').split(' ').map((n:string)=>n[0]).join('').slice(0,2)
          return (
            <div key={cita.id} style={{ background:'#FFF', borderRadius:16, padding:'14px 16px', marginBottom:10, border:'1px solid #F0F0F0', display:'flex', alignItems:'center', gap:14, position:'relative' }}>
              {/* Hora */}
              <div style={{ flexShrink:0, minWidth:52 }}>
                <p style={{ fontSize:14, fontWeight:800, color:'#0D0D0D', margin:0 }}>{d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</p>
              </div>

              {/* Avatar */}
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#666', flexShrink:0 }}>
                {initials}
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{cita.profiles?.full_name}</p>
                <p style={{ fontSize:12, color:'#999', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{cita.services?.name}</p>
              </div>

              {/* Status badge */}
              <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:999, flexShrink:0 }}>{cfg.label}</span>

              {/* Menú */}
              <button onClick={() => setActionMenu(actionMenu === cita.id ? null : cita.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, flexShrink:0 }}>
                <MoreVertical size={16} color="#CCC" />
              </button>

              {actionMenu === cita.id && (
                <>
                  <div onClick={() => setActionMenu(null)} style={{ position:'fixed', inset:0, zIndex:10 }} />
                  <div style={{ position:'absolute', right:12, top:44, background:'#FFF', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', border:'1px solid #F0F0F0', zIndex:20, overflow:'hidden', minWidth:170 }}>
                    {cita.status !== 'confirmed' && <button onClick={() => updateStatus(cita.id,'confirmed')} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', width:'100%', fontSize:14, color:'#16A34A', fontFamily:'inherit' }}><Check size={15}/> Confirmar</button>}
                    {cita.status !== 'completed' && <button onClick={() => updateStatus(cita.id,'completed')} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', width:'100%', fontSize:14, color:'#6B7280', fontFamily:'inherit' }}><Check size={15}/> Completar</button>}
                    <button onClick={() => updateStatus(cita.id,'cancelled')} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'none', border:'none', cursor:'pointer', width:'100%', fontSize:14, color:'#DC2626', fontFamily:'inherit' }}><X size={15}/> Cancelar</button>
                  </div>
                </>
              )}
            </div>
          )
        })}
        <div style={{ height:100 }} />
      </div>

      {/* FAB */}
      <button onClick={() => router.push('/admin/citas/nueva')} style={{ position:'fixed', bottom:84, right:20, height:50, padding:'0 20px', borderRadius:999, background:'#FF6B1A', color:'#FFF', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(255,107,26,0.4)', zIndex:10, fontFamily:'inherit' }}>
        <Plus size={18} color="#FFF" /> Nueva Cita
      </button>

      <AdminBottomNav />
    </div>
  )
}
