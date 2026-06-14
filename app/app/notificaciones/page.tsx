'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Bell, Check } from 'lucide-react'

export default function NotificacionesPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [notifs,  setNotifs]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('sent_at', { ascending: false }).limit(30)
      setNotifs(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const TYPE_ICONS: Record<string, { bg:string; icon:string }> = {
    appointment_confirmed:  { bg:'#F0FDF4', icon:'✓'  },
    appointment_reminder:   { bg:'#FFFBEB', icon:'🔔' },
    appointment_cancelled:  { bg:'#FEF2F2', icon:'✕'  },
    appointment_completed:  { bg:'#F9FAFB', icon:'✂️'  },
    new_offer:              { bg:'#FFF3EC', icon:'🏷️' },
    pending_review:         { bg:'#FFFBEB', icon:'⭐' },
  }

  const unread = notifs.filter(n => !n.is_read).length

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <ArrowLeft size={22} color="#0D0D0D" />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Notificaciones</span>
            {unread > 0 && <span style={{ background:'#FF6B1A', color:'#FFF', fontSize:11, fontWeight:700, borderRadius:999, padding:'2px 8px' }}>{unread}</span>}
          </div>
          {unread > 0 ? (
            <button onClick={markAllRead} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#FF6B1A', fontWeight:600 }}>Leer todas</button>
          ) : <div style={{ width:60 }} />}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10 }}>
        {notifs.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:64, gap:14 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bell size={32} color="#CCC" />
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Sin notificaciones</div>
            <div style={{ fontSize:14, color:'#999', textAlign:'center', maxWidth:240, lineHeight:1.6 }}>Aquí aparecerán tus recordatorios y confirmaciones.</div>
          </div>
        ) : notifs.map((notif: any) => {
          const cfg = TYPE_ICONS[notif.type] ?? { bg:'#F5F5F5', icon:'🔔' }
          const time = new Date(notif.sent_at)
          const diff = Date.now() - time.getTime()
          const mins = Math.floor(diff/60000)
          const timeLabel = mins < 60 ? `${mins} min` : mins < 1440 ? `${Math.floor(mins/60)} h` : 'Ayer'
          return (
            <div key={notif.id} style={{
              display:'flex', alignItems:'flex-start', gap:14,
              background: notif.is_read ? '#FFF' : '#FFFAF7',
              borderRadius:14, padding:'14px 16px',
              border: notif.is_read ? '1px solid #F0F0F0' : '1px solid #FFD4B8',
            }}>
              <div style={{ width:44, height:44, borderRadius:12, background:cfg.bg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                {cfg.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight: notif.is_read ? 500 : 700, color:'#0D0D0D', marginBottom:4, lineHeight:1.4 }}>{notif.title}</div>
                <div style={{ fontSize:13, color:'#666', lineHeight:1.5, marginBottom:6 }}>{notif.body}</div>
                <div style={{ fontSize:11, color:'#CCC' }}>{timeLabel}</div>
              </div>
              {!notif.is_read && <div style={{ width:8, height:8, borderRadius:'50%', background:'#FF6B1A', flexShrink:0, marginTop:6 }} />}
            </div>
          )
        })}
        <div style={{ height:40 }} />
      </div>
    </div>
  )
}
