'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, User, Phone, Mail, Calendar, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Scissors } from 'lucide-react'

export default function PerfilPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [stats,   setStats]   = useState({ total:0, completed:0, spent:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: prof }, { data: appts }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('appointments').select('final_price, status').eq('client_id', user.id),
      ])
      setProfile(prof)
      const completed = appts?.filter(a => a.status === 'completed') ?? []
      setStats({
        total:     appts?.length ?? 0,
        completed: completed.length,
        spent:     completed.reduce((s,a) => s + (a.final_price ?? 0), 0),
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = (name: string) => name?.split(' ').map((n:string) => n[0]).join('').toUpperCase().slice(0,2) ?? 'U'

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const menuItems = [
    { icon:<Phone size={18} color="#666"/>,      label:'Teléfono',         value: profile?.phone ?? 'No registrado',   action: undefined },
    { icon:<Mail size={18} color="#666"/>,        label:'Correo',           value: profile?.email ?? '',                action: undefined },
    { icon:<CreditCard size={18} color="#666"/>,  label:'Métodos de pago',  value: '',                                  action: () => {} },
    { icon:<Bell size={18} color="#666"/>,         label:'Notificaciones',   value: '',                                  action: () => router.push('/app/notificaciones') },
    { icon:<HelpCircle size={18} color="#666"/>,   label:'Centro de ayuda',  value: '',                                  action: () => {} },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <ArrowLeft size={22} color="#0D0D0D" />
          </button>
          <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Mi perfil</div>
          <div style={{ width:30 }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 }}>

        {/* Card identidad */}
        <div style={{ background:'#FFF', borderRadius:20, padding:'24px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:'#FFF', boxShadow:'0 4px 16px rgba(255,107,26,0.3)' }}>
            {initials(profile?.full_name ?? 'U')}
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800, color:'#0D0D0D', marginBottom:4 }}>{profile?.full_name}</div>
            <div style={{ fontSize:13, color:'#999' }}>{profile?.phone ?? profile?.email}</div>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:0, width:'100%', borderTop:'1px solid #F5F5F5', marginTop:8, paddingTop:16 }}>
            {[
              { label:'Citas totales', value: stats.total },
              { label:'Completadas',   value: stats.completed },
              { label:'Total gastado', value: `$${stats.spent}` },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? '1px solid #F5F5F5' : 'none' }}>
                <div style={{ fontSize:18, fontWeight:800, color:'#0D0D0D' }}>{s.value}</div>
                <div style={{ fontSize:11, color:'#999', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Opciones */}
        <div style={{ background:'#FFF', borderRadius:16, overflow:'hidden' }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} style={{
              display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
              background:'none', border:'none', borderBottom: i < menuItems.length-1 ? '1px solid #F5F5F5' : 'none',
              cursor: item.action ? 'pointer' : 'default', textAlign:'left', width:'100%',
            }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {item.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#0D0D0D' }}>{item.label}</div>
                {item.value && <div style={{ fontSize:12, color:'#999', marginTop:2 }}>{item.value}</div>}
              </div>
              {item.action && <ChevronRight size={16} color="#CCC" />}
            </button>
          ))}
        </div>

        {/* Cerrar sesión */}
        <div style={{ background:'#FFF', borderRadius:16, overflow:'hidden' }}>
          <button onClick={handleSignOut} style={{
            display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
            background:'none', border:'none', cursor:'pointer', textAlign:'left', width:'100%',
          }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <LogOut size={18} color="#DC2626" />
            </div>
            <span style={{ fontSize:15, fontWeight:500, color:'#DC2626' }}>Cerrar sesión</span>
          </button>
        </div>

        <div style={{ height:100 }} />
      </div>
    </div>
  )
}
