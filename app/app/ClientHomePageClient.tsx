'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Calendar, Search, User, Plus, Bell, ChevronRight, Scissors, Clock, Star } from 'lucide-react'

interface Props { userId: string }

export default function ClientHomePageClient({ userId }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const [profile,    setProfile]    = useState<any>(null)
  const [services,   setServices]   = useState<any[]>([])
  const [nextAppt,   setNextAppt]   = useState<any>(null)
  const [offers,     setOffers]     = useState<any[]>([])
  const [activeNav,  setActiveNav]  = useState('home')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: prof }, { data: svcs }, { data: appts }, { data: offs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('services').select('*').eq('is_active', true).order('display_order').limit(6),
        supabase.from('appointments')
          .select('*, services(name, duration_min, price)')
          .eq('client_id', userId)
          .in('status', ['pending', 'confirmed'])
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at').limit(1),
        supabase.from('offers').select('*').eq('status', 'active').limit(3),
      ])
      setProfile(prof)
      setServices(svcs ?? [])
      setNextAppt(appts?.[0] ?? null)
      setOffers(offs ?? [])
      setLoading(false)
    }
    load()
  }, [userId])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Cliente'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? '¡Buenos días' : hour < 19 ? '¡Buenas tardes' : '¡Buenas noches'

  const initials = (name: string) => name?.split(' ').map((n:string) => n[0]).join('').toUpperCase().slice(0,2) ?? 'U'

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', paddingBottom:16, paddingLeft:16, paddingRight:16, borderBottom:'1px solid #F0F0F0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:'50%', background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#FFF', flexShrink:0 }}>
              {initials(profile?.full_name ?? 'U')}
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#0D0D0D' }}>{greeting}, {firstName}!</div>
              <div style={{ fontSize:12, color:'#999' }}>¿Listo para tu próximo corte?</div>
            </div>
          </div>
          <button onClick={() => router.push('/app/notificaciones')} style={{ background:'none', border:'none', cursor:'pointer', position:'relative', padding:4 }}>
            <Bell size={22} color="#0D0D0D" />
          </button>
        </div>
      </div>

      {/* Scroll content */}
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ padding:16, display:'flex', flexDirection:'column', gap:20 }}>

          {/* Banner oferta */}
          {offers.length > 0 && (
            <button onClick={() => router.push('/app/explorar')} style={{
              background:'#0D0D0D', borderRadius:16, padding:'18px 20px',
              border:'none', cursor:'pointer', textAlign:'left', width:'100%',
              display:'flex', alignItems:'center', gap:14,
            }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:13, fontWeight:800, color:'#FFF', textAlign:'center', lineHeight:1.2 }}>
                  {offers[0].discount_value}{offers[0].discount_type === 'percentage' ? '%' : '$'}<br/>OFF
                </span>
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#FFF', marginBottom:4 }}>{offers[0].name}</div>
                <div style={{ fontSize:12, color:'#888' }}>Ver oferta →</div>
              </div>
            </button>
          )}

          {/* Próxima cita */}
          {nextAppt ? (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:16, fontWeight:700, color:'#0D0D0D' }}>Próxima cita</span>
                <button onClick={() => router.push('/app/citas')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, display:'flex', alignItems:'center', gap:2 }}>
                  Ver todas <ChevronRight size={14} />
                </button>
              </div>
              <button onClick={() => router.push('/app/citas')} style={{
                display:'flex', alignItems:'center', gap:14, width:'100%',
                background:'#FFF', borderRadius:16, padding:16,
                border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left',
              }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Calendar size={24} color="#FF6B1A" />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:'#999', marginBottom:3 }}>
                    {new Date(nextAppt.scheduled_at).toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })} · {new Date(nextAppt.scheduled_at).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', marginBottom:2 }}>{nextAppt.services?.name}</div>
                  <span style={{ background: nextAppt.status === 'confirmed' ? '#F0FDF4' : '#FFFBEB', color: nextAppt.status === 'confirmed' ? '#16A34A' : '#D97706', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999 }}>
                    {nextAppt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
                <ChevronRight size={18} color="#CCC" />
              </button>
            </div>
          ) : (
            <button onClick={() => router.push('/app/citas/nueva')} style={{
              background:'#FFF', borderRadius:16, padding:20, border:'2px dashed #E5E5E5',
              cursor:'pointer', textAlign:'center', width:'100%',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10,
            }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'#FFF3EC', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Plus size={22} color="#FF6B1A" />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', marginBottom:4 }}>Reserva tu primera cita</div>
                <div style={{ fontSize:12, color:'#999' }}>Toca aquí para empezar</div>
              </div>
            </button>
          )}

          {/* Accesos rápidos */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { icon: <Calendar size={20} color="#FF6B1A" />, label:'Reservar cita', bg:'#FFF3EC', action:() => router.push('/app/citas/nueva') },
              { icon: <Scissors size={20} color="#0D0D0D" />, label:'Servicios',     bg:'#F5F5F5', action:() => router.push('/app/explorar') },
              { icon: <Clock size={20} color="#0D0D0D" />,    label:'Mis citas',     bg:'#F5F5F5', action:() => router.push('/app/citas') },
              { icon: <User size={20} color="#0D0D0D" />,     label:'Mi perfil',     bg:'#F5F5F5', action:() => router.push('/app/perfil') },
            ].map((item, i) => (
              <button key={i} onClick={item.action} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:16, background:'#FFF', borderRadius:14,
                border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left',
              }}>
                <div style={{ width:40, height:40, borderRadius:12, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#0D0D0D' }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Servicios */}
          {services.length > 0 && (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <span style={{ fontSize:16, fontWeight:700, color:'#0D0D0D' }}>Nuestros servicios</span>
                <button onClick={() => router.push('/app/explorar')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, display:'flex', alignItems:'center', gap:2 }}>
                  Ver todos <ChevronRight size={14} />
                </button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {services.map((srv: any) => (
                  <button key={srv.id} onClick={() => router.push(`/app/citas/nueva?serviceId=${srv.id}`)} style={{
                    display:'flex', alignItems:'center', gap:14,
                    background:'#FFF', borderRadius:14, padding:'14px 16px',
                    border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left', width:'100%',
                  }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Scissors size={22} color="#FF6B1A" />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:'#0D0D0D', marginBottom:3 }}>{srv.name}</div>
                      <div style={{ fontSize:12, color:'#999' }}>{srv.duration_min} min</div>
                    </div>
                    <div style={{ fontSize:16, fontWeight:800, color:'#0D0D0D' }}>${srv.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ height:80 }} />
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ height:80, background:'#FFF', borderTop:'1px solid #F0F0F0', display:'flex', alignItems:'center', paddingBottom:'env(safe-area-inset-bottom, 0px)', flexShrink:0, position:'sticky', bottom:0 }}>
        {[
          { key:'home',    icon:<Home size={22} />,     label:'Inicio',   action:() => setActiveNav('home') },
          { key:'explore', icon:<Search size={22} />,   label:'Explorar', action:() => { setActiveNav('explore'); router.push('/app/explorar') } },
          { key:'fab',     icon:null,                   label:'',         action:() => router.push('/app/citas/nueva') },
          { key:'citas',   icon:<Calendar size={22} />, label:'Citas',    action:() => { setActiveNav('citas'); router.push('/app/citas') } },
          { key:'perfil',  icon:<User size={22} />,     label:'Perfil',   action:() => { setActiveNav('perfil'); router.push('/app/perfil') } },
        ].map((item, i) => {
          if (item.key === 'fab') return (
            <div key={i} style={{ flex:1, display:'flex', justifyContent:'center' }}>
              <button onClick={item.action} style={{ width:56, height:56, borderRadius:'50%', background:'#FF6B1A', border:'4px solid #FFF', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(255,107,26,0.40)', marginTop:-20 }}>
                <Plus size={24} color="#FFF" />
              </button>
            </div>
          )
          const isActive = activeNav === item.key
          return (
            <button key={i} onClick={item.action} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, background:'none', border:'none', cursor:'pointer' }}>
              <span style={{ color: isActive ? '#FF6B1A' : '#999' }}>{item.icon}</span>
              <span style={{ fontSize:10, color: isActive ? '#FF6B1A' : '#999', fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
