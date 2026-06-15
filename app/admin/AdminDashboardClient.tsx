'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Menu, Bell, Calendar, Users, Scissors, BarChart2, DollarSign,
  Plus, ChevronRight, Clock, TrendingUp, TrendingDown, Check,
  Phone, MessageCircle, Edit, MoreVertical, UserPlus, Lock
} from 'lucide-react'
import AdminBottomNav from '@/components/admin/BottomNav'

function Sparkline({ values, color = '#22C55E' }: { values: number[], color?: string }) {
  if (!values || values.length < 2) return null
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1
  const w = 60, h = 24
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(pts.split(' ').pop()!.split(',')[0])} cy={parseFloat(pts.split(' ').pop()!.split(',')[1])} r={2.5} fill={color} />
    </svg>
  )
}

export default function AdminDashboardClient() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const now = new Date()
      const startDay = new Date(now); startDay.setHours(0,0,0,0)
      const endDay = new Date(now); endDay.setHours(23,59,59,999)
      const startMonth = new Date(now); startMonth.setDate(1); startMonth.setHours(0,0,0,0)

      const [
        { data: profile },
        { data: todayAppts },
        { data: upcomingAppts },
        { data: allAppts },
        { data: clients },
        { data: notifications },
      ] = await Promise.all([
        supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
        supabase.from('appointments').select('*, profiles!appointments_client_id_fkey(full_name, phone, avatar_url), services(name, duration_min, price)').gte('scheduled_at', startDay.toISOString()).lte('scheduled_at', endDay.toISOString()).neq('status', 'cancelled').order('scheduled_at'),
        supabase.from('appointments').select('*, profiles!appointments_client_id_fkey(full_name, avatar_url), services(name)').gt('scheduled_at', now.toISOString()).in('status', ['pending','confirmed']).order('scheduled_at').limit(5),
        supabase.from('appointments').select('final_price, status, scheduled_at').gte('scheduled_at', startMonth.toISOString()),
        supabase.from('profiles').select('id, created_at').eq('role', 'client').gte('created_at', startMonth.toISOString()),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('sent_at', { ascending: false }).limit(5),
      ])

      const completed = allAppts?.filter(a => a.status === 'completed') ?? []
      const revenue = completed.reduce((s, a) => s + (a.final_price ?? 0), 0)
      const nextAppt = todayAppts?.find(a => new Date(a.scheduled_at) > now) ?? upcomingAppts?.[0]

      setData({
        adminName: profile?.full_name?.split(' ')[0] ?? 'Admin',
        adminAvatar: profile?.avatar_url,
        todayCount: todayAppts?.length ?? 0,
        nextAppt,
        revenue,
        completedToday: todayAppts?.filter(a => a.status === 'completed').length ?? 0,
        pendingToday: todayAppts?.filter(a => a.status === 'pending').length ?? 0,
        newClients: clients?.length ?? 0,
        upcomingAppts: upcomingAppts ?? [],
        notifications: notifications ?? [],
        recentActivity: (todayAppts ?? []).slice(0, 4).map((a: any) => ({
          name: a.profiles?.full_name ?? 'Cliente',
          service: a.services?.name ?? 'Servicio',
          time: new Date(a.scheduled_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          status: a.status,
        })),
        quickStats: [
          { label: 'Facturación', value: `$${revenue.toLocaleString()}`, change: 0, color: '#22C55E', spark: [100,200,150,300,250,revenue||100] },
          { label: 'Citas completadas', value: String(completed.length), change: 0, color: '#3B82F6', spark: [2,3,1,4,completed.length||0] },
          { label: 'Nuevos clientes', value: String(clients?.length ?? 0), change: 0, color: '#F59E0B', spark: [1,2,1,3,clients?.length||0] },
        ],
      })
      setLoading(false)
    }
    load()

    const ch = supabase.channel('dash').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, load).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const { adminName, adminAvatar, todayCount, nextAppt, revenue, completedToday, pendingToday, newClients, upcomingAppts, recentActivity, quickStats, notifications } = data
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const initials = (name: string) => name?.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2) ?? 'A'

  const STATUS_COLORS: Record<string,string> = { pending:'#D97706', confirmed:'#16A34A', completed:'#6B7280', cancelled:'#DC2626' }
  const STATUS_LABELS: Record<string,string> = { pending:'Pendiente', confirmed:'Confirmada', completed:'Completada', cancelled:'Cancelada' }
  const STATUS_BG: Record<string,string> = { pending:'#FFFBEB', confirmed:'#F0FDF4', completed:'#F9FAFB', cancelled:'#FEF2F2' }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Menu size={22} color="#0D0D0D" /></button>
            <div>
              <p style={{ fontSize:17, fontWeight:700, color:'#0D0D0D', margin:0 }}>¡{greeting}, {adminName}!</p>
              <p style={{ fontSize:12, color:'#999', margin:'2px 0 0' }}>Bienvenido a tu barbería</p>
            </div>
          </div>
          <button onClick={() => {}} style={{ background:'none', border:'none', cursor:'pointer', position:'relative', padding:4 }}>
            <Bell size={22} color="#0D0D0D" />
            {notifications.filter((n:any) => !n.is_read).length > 0 && (
              <div style={{ position:'absolute', top:0, right:0, width:8, height:8, borderRadius:'50%', background:'#FF6B1A', border:'2px solid #FFF' }} />
            )}
          </button>
        </div>
      </div>

      {/* Scroll */}
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ padding:16, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Próxima cita destacada */}
          {nextAppt && (
            <button onClick={() => router.push(`/admin/citas`)} style={{ background:'#0D0D0D', borderRadius:18, padding:'18px 20px', border:'none', cursor:'pointer', textAlign:'left', width:'100%', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:'#888', margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Próxima cita</p>
                <p style={{ fontSize:18, fontWeight:800, color:'#FFF', margin:'0 0 4px' }}>
                  {new Date(nextAppt.scheduled_at).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}
                </p>
                <p style={{ fontSize:14, fontWeight:600, color:'#FFF', margin:'0 0 3px' }}>
                  {nextAppt.profiles?.full_name ?? 'Cliente'}
                </p>
                <p style={{ fontSize:12, color:'#888', margin:0 }}>{nextAppt.services?.name}</p>
              </div>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#FFF', flexShrink:0 }}>
                {initials(nextAppt.profiles?.full_name ?? 'C')}
              </div>
            </button>
          )}

          {/* Acciones rápidas */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[
              { icon:<Calendar size={20} color="#FF6B1A"/>, label:'Nueva Cita',  bg:'#FFF3EC', action:()=>router.push('/admin/citas/nueva') },
              { icon:<Users size={20} color="#0D0D0D"/>,   label:'Clientes',    bg:'#F5F5F5', action:()=>router.push('/admin/clientes') },
              { icon:<Scissors size={20} color="#0D0D0D"/>,label:'Servicios',   bg:'#F5F5F5', action:()=>router.push('/admin/servicios') },
              { icon:<Calendar size={20} color="#0D0D0D"/>,label:'Calendario',  bg:'#F5F5F5', action:()=>router.push('/admin/citas') },
              { icon:<BarChart2 size={20} color="#0D0D0D"/>,label:'Reportes',   bg:'#F5F5F5', action:()=>router.push('/admin/reportes') },
              { icon:<DollarSign size={20} color="#0D0D0D"/>,label:'Ingresos',  bg:'#F5F5F5', action:()=>router.push('/admin/reportes') },
            ].map((item,i) => (
              <button key={i} onClick={item.action} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'14px 8px', background:'#FFF', borderRadius:14, border:'1px solid #F0F0F0', cursor:'pointer' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{item.icon}</div>
                <span style={{ fontSize:11, fontWeight:600, color:'#0D0D0D', textAlign:'center' }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Resumen de hoy */}
          <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:0 }}>Resumen de hoy</p>
              <button onClick={() => router.push('/admin/reportes')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, fontFamily:'inherit' }}>Ver más</button>
            </div>
            <div style={{ display:'flex', gap:16 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:'#999', margin:'0 0 4px', display:'flex', alignItems:'center', gap:4 }}><DollarSign size={11} /> Ingresos</p>
                <p style={{ fontSize:24, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>${revenue.toLocaleString()}.00</p>
                <p style={{ fontSize:11, color:'#22C55E', margin:0, display:'flex', alignItems:'center', gap:3 }}><TrendingUp size={11} />+0% vs ayer</p>
                <div style={{ marginTop:8 }}><Sparkline values={[100,200,150,300,250,revenue||100]} color="#22C55E" /></div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
                <div style={{ position:'relative', width:72, height:72 }}>
                  <svg width={72} height={72} viewBox="0 0 72 72">
                    <circle cx={36} cy={36} r={28} fill="none" stroke="#F0F0F0" strokeWidth={8} />
                    {todayCount > 0 && <circle cx={36} cy={36} r={28} fill="none" stroke="#FF6B1A" strokeWidth={8} strokeDasharray={`${(completedToday/todayCount)*175.9} 175.9`} strokeDashoffset={43.98} strokeLinecap="round" transform="rotate(-90 36 36)" />}
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:16, fontWeight:800, color:'#0D0D0D' }}>{completedToday}</span>
                  </div>
                </div>
                <p style={{ fontSize:11, color:'#999', margin:0, textAlign:'center' }}>Citas completadas</p>
                <p style={{ fontSize:10, color:'#CCC', margin:0 }}>{todayCount > 0 ? Math.round((completedToday/todayCount)*100) : 0}% del total</p>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:0 }}>Actividad reciente</p>
              <button onClick={() => router.push('/admin/citas')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, fontFamily:'inherit' }}>Ver todas</button>
            </div>
            {recentActivity.length === 0 ? (
              <p style={{ fontSize:13, color:'#CCC', textAlign:'center', padding:'16px 0', margin:0 }}>Sin actividad reciente</p>
            ) : recentActivity.map((a:any, i:number) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, paddingBottom: i<recentActivity.length-1?'12px 0':0, borderBottom: i<recentActivity.length-1?'1px solid #F5F5F5':'none', marginBottom: i<recentActivity.length-1?12:0 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#666', flexShrink:0 }}>
                  {a.name.charAt(0)}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', margin:'0 0 2px' }}>{a.name}</p>
                  <p style={{ fontSize:12, color:'#999', margin:0 }}>{a.service}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:12, color:'#999', margin:'0 0 4px' }}>{a.time}</p>
                  <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:999, background: STATUS_BG[a.status]??'#F5F5F5', color: STATUS_COLORS[a.status]??'#666' }}>
                    {STATUS_LABELS[a.status]??a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Próximas citas */}
          {upcomingAppts.length > 0 && (
            <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:0 }}>Próximas citas</p>
                <button onClick={() => router.push('/admin/citas')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:2 }}>
                  Ver agenda <ChevronRight size={14} />
                </button>
              </div>
              {upcomingAppts.map((a:any, i:number) => {
                const d = new Date(a.scheduled_at)
                const isToday = d.toDateString() === new Date().toDateString()
                const isTomorrow = d.toDateString() === new Date(Date.now()+86400000).toDateString()
                const dateLabel = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : d.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})
                return (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:14, paddingBottom:12, borderBottom: i<upcomingAppts.length-1?'1px solid #F5F5F5':'none', marginBottom: i<upcomingAppts.length-1?12:0 }}>
                    <div style={{ flexShrink:0 }}>
                      <p style={{ fontSize:11, color:'#999', margin:'0 0 2px' }}>{dateLabel}</p>
                      <p style={{ fontSize:16, fontWeight:800, color:'#0D0D0D', margin:0 }}>{d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</p>
                    </div>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#666', flexShrink:0 }}>
                      {(a.profiles?.full_name??'C').charAt(0)}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', margin:'0 0 2px' }}>{a.profiles?.full_name}</p>
                      <p style={{ fontSize:12, color:'#999', margin:0 }}>{a.services?.name}</p>
                    </div>
                    <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><MoreVertical size={16} color="#CCC" /></button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:0 }}>Estadísticas rápidas</p>
              <span style={{ fontSize:12, color:'#999' }}>Este mes</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {quickStats.map((s:any, i:number) => (
                <div key={i} style={{ background:'#FFF', borderRadius:14, padding:'12px 14px', border:'1px solid #F0F0F0' }}>
                  <p style={{ fontSize:11, color:'#999', margin:'0 0 6px' }}>{s.label}</p>
                  <p style={{ fontSize:18, fontWeight:800, color:'#0D0D0D', margin:'0 0 6px' }}>{s.value}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:10, color:s.color, fontWeight:600 }}>+0%</span>
                    <Sparkline values={s.spark} color={s.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner invitar */}
          <div style={{ background:'#0D0D0D', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:16, position:'relative', overflow:'hidden' }}>
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:'#FFF', margin:'0 0 6px' }}>Invita a tus clientes</p>
              <p style={{ fontSize:12, color:'#888', margin:'0 0 14px' }}>Comparte tu enlace y gana descuentos y beneficios.</p>
              <button onClick={() => {}} style={{ background:'#FF6B1A', color:'#FFF', border:'none', borderRadius:10, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                Invitar ahora
              </button>
            </div>
            <div style={{ fontSize:40, flexShrink:0 }}>🎁</div>
          </div>

          <div style={{ height:80 }} />
        </div>
      </div>

      <AdminBottomNav />
    </div>
  )
}
