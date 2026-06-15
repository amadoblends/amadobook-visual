'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Phone, Mail, Bell, HelpCircle, LogOut, ChevronRight, Scissors } from 'lucide-react'
import ClientBottomNav from '@/components/client/BottomNav'

export default function PerfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ total:0, completed:0, spent:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: prof }, { data: appts }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('appointments').select('final_price,status').eq('client_id', user.id),
      ])
      setProfile(prof)
      const done = appts?.filter(a=>a.status==='completed') ?? []
      setStats({ total: appts?.length??0, completed: done.length, spent: done.reduce((s,a)=>s+(a.final_price??0),0) })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  const initials = profile?.full_name?.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2) ?? 'U'

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ArrowLeft size={22} color="#0D0D0D" /></button>
          <span style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Mi perfil</span>
          <div style={{ width:30 }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 }}>
        {/* Card identidad */}
        <div style={{ background:'#FFF', borderRadius:20, padding:'28px 20px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg, #FF6B1A, #FF9A1A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:'#FFF', boxShadow:'0 8px 24px rgba(255,107,26,0.3)' }}>
            {initials}
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:20, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>{profile?.full_name}</p>
            <p style={{ fontSize:13, color:'#999', margin:0 }}>{profile?.phone ?? profile?.email ?? ''}</p>
          </div>
          <div style={{ display:'flex', width:'100%', borderTop:'1px solid #F5F5F5', paddingTop:16, marginTop:4 }}>
            {[
              { label:'Citas', value: stats.total },
              { label:'Completadas', value: stats.completed },
              { label:'Gastado', value: `$${stats.spent}` },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, textAlign:'center', borderRight: i<2?'1px solid #F5F5F5':'none' }}>
                <p style={{ fontSize:18, fontWeight:800, color:'#0D0D0D', margin:'0 0 2px' }}>{s.value}</p>
                <p style={{ fontSize:11, color:'#999', margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info + Opciones */}
        <div style={{ background:'#FFF', borderRadius:16, overflow:'hidden' }}>
          {[
            { icon:<Phone size={16} color="#666"/>, label:'Teléfono', value: profile?.phone ?? 'No registrado', action: undefined },
            { icon:<Mail size={16} color="#666"/>, label:'Correo', value: profile?.email ?? '', action: undefined },
            { icon:<Scissors size={16} color="#666"/>, label:'Mis citas', value: `${stats.total} citas en total`, action: () => router.push('/app/citas') },
            { icon:<Bell size={16} color="#666"/>, label:'Notificaciones', value: '', action: () => router.push('/app/notificaciones') },
            { icon:<HelpCircle size={16} color="#666"/>, label:'Centro de ayuda', value: '', action: () => {} },
          ].map((item, i, arr) => (
            <button key={i} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 20px', background:'none', border:'none', borderBottom: i<arr.length-1?'1px solid #F5F5F5':'none', cursor: item.action?'pointer':'default', textAlign:'left', width:'100%' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:500, color:'#0D0D0D', margin: item.value?'0 0 2px':0 }}>{item.label}</p>
                {item.value && <p style={{ fontSize:12, color:'#999', margin:0 }}>{item.value}</p>}
              </div>
              {item.action && <ChevronRight size={16} color="#CCC" />}
            </button>
          ))}
        </div>

        {/* Cerrar sesión */}
        <div style={{ background:'#FFF', borderRadius:16, overflow:'hidden' }}>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background:'none', border:'none', cursor:'pointer', textAlign:'left', width:'100%' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><LogOut size={16} color="#DC2626" /></div>
            <span style={{ fontSize:14, fontWeight:500, color:'#DC2626' }}>Cerrar sesión</span>
          </button>
        </div>

        <div style={{ height:100 }} />
      </div>
      <ClientBottomNav />
    </div>
  )
}
