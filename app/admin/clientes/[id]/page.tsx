'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Phone, MessageCircle, Edit, MoreVertical, Calendar, Clock, ChevronRight } from 'lucide-react'

export default function ClienteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const [client, setClient] = useState<any>(null)
  const [appts, setAppts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: a }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('appointments').select('*, services(name, price)').eq('client_id', id).order('scheduled_at', { ascending: false }).limit(20),
      ])
      setClient(c)
      setAppts(a ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
  if (!client) return null

  const completed  = appts.filter(a => a.status === 'completed')
  const cancelled  = appts.filter(a => a.status === 'cancelled')
  const totalSpent = completed.reduce((s,a) => s+(a.final_price??0), 0)
  const nextAppt   = appts.find(a => new Date(a.scheduled_at) > new Date() && ['pending','confirmed'].includes(a.status))
  const initials   = client.full_name?.split(' ').map((n:string)=>n[0]).join('').slice(0,2) ?? 'C'

  const STATUS_CONFIG: Record<string,{label:string;color:string}> = {
    pending:   { label:'Pendiente',  color:'#D97706' },
    confirmed: { label:'Confirmada', color:'#16A34A' },
    completed: { label:'Completada', color:'#6B7280' },
    cancelled: { label:'Cancelada',  color:'#DC2626' },
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ArrowLeft size={22} color="#0D0D0D" /></button>
          <div style={{ width:30 }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 }}>
        {/* Perfil */}
        <div style={{ background:'#FFF', borderRadius:20, padding:'24px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ position:'relative' }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:'#FFF', boxShadow:'0 4px 16px rgba(255,107,26,0.3)' }}>{initials}</div>
            <button style={{ position:'absolute', bottom:0, right:0, width:28, height:28, borderRadius:'50%', background:'#0D0D0D', border:'2px solid #FFF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <Edit size={12} color="#FFF" />
            </button>
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:20, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>{client.full_name}</p>
            <span style={{ background:'#F0FDF4', color:'#16A34A', fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:999 }}>Cliente activo</span>
          </div>

          {/* Acciones */}
          <div style={{ display:'flex', gap:12, width:'100%', justifyContent:'center' }}>
            {[
              { icon:<Phone size={18}/>, label:'Llamar', action:() => client.phone && window.open(`tel:${client.phone}`) },
              { icon:<MessageCircle size={18}/>, label:'Mensaje', action:() => client.phone && window.open(`sms:${client.phone}`) },
              { icon:<Edit size={18}/>, label:'Editar', action:() => {} },
              { icon:<MoreVertical size={18}/>, label:'Más', action:() => {} },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', flex:1 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center' }}>{btn.icon}</div>
                <span style={{ fontSize:11, color:'#666' }}>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info de contacto */}
        <div style={{ background:'#FFF', borderRadius:16, padding:'4px 20px' }}>
          {[
            { icon:'📞', label:'Teléfono', value: client.phone ?? 'No registrado' },
            { icon:'✉️', label:'Correo',   value: client.email ?? 'No registrado' },
            { icon:'📅', label:'Desde',    value: new Date(client.created_at).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) },
          ].map((row, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom: i<2?'1px solid #F5F5F5':'none' }}>
              <span style={{ fontSize:20 }}>{row.icon}</span>
              <div>
                <p style={{ fontSize:11, color:'#999', margin:'0 0 2px' }}>{row.label}</p>
                <p style={{ fontSize:14, fontWeight:500, color:'#0D0D0D', margin:0 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats resumen */}
        <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px' }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 16px' }}>Resumen</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'Citas totales',  value: String(appts.length) },
              { label:'Total gastado',  value: `$${totalSpent.toLocaleString()}` },
              { label:'No asistió',     value: String(cancelled.length) },
              { label:'Asistencia',     value: appts.length > 0 ? `${Math.round((completed.length/appts.length)*100)}%` : '0%' },
            ].map((s, i) => (
              <div key={i} style={{ background:'#F9F9F9', borderRadius:12, padding:'12px 14px' }}>
                <p style={{ fontSize:11, color:'#999', margin:'0 0 4px' }}>{s.label}</p>
                <p style={{ fontSize:20, fontWeight:800, color:'#0D0D0D', margin:0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Próxima cita */}
        {nextAppt && (
          <div style={{ background:'#0D0D0D', borderRadius:16, padding:'16px 20px' }}>
            <p style={{ fontSize:12, color:'#888', margin:'0 0 8px' }}>Próxima cita</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:'#FFF', margin:'0 0 4px' }}>
                  {new Date(nextAppt.scheduled_at).toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}
                </p>
                <p style={{ fontSize:13, color:'#888', margin:0 }}>
                  {new Date(nextAppt.scheduled_at).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})} — {nextAppt.services?.name}
                </p>
              </div>
              <ChevronRight size={20} color="#888" />
            </div>
          </div>
        )}

        {/* Historial */}
        <div style={{ background:'#FFF', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px 8px' }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:0 }}>Historial de citas</p>
          </div>
          {appts.slice(0,6).map((a:any, i:number) => {
            const d = new Date(a.scheduled_at)
            const cfg = STATUS_CONFIG[a.status]
            return (
              <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 20px', borderTop:'1px solid #F5F5F5' }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#0D0D0D', margin:'0 0 3px' }}>{d.toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})}</p>
                  <p style={{ fontSize:12, color:'#999', margin:0 }}>{d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})} — {a.services?.name}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#0D0D0D', margin:'0 0 4px' }}>${a.final_price ?? 0}</p>
                  <span style={{ fontSize:11, fontWeight:600, color:cfg?.color??'#666' }}>{cfg?.label??a.status}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botón nueva cita */}
        <button onClick={() => router.push(`/admin/citas/nueva`)} style={{ width:'100%', height:52, background:'#FF6B1A', color:'#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit' }}>
          <Calendar size={18} /> Nueva cita con {client.full_name?.split(' ')[0]}
        </button>

        <div style={{ height:20 }} />
      </div>
    </div>
  )
}
