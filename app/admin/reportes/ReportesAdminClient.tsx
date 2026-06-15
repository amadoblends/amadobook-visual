'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, TrendingUp, TrendingDown, ChevronDown, ChevronRight, BarChart2 } from 'lucide-react'
import AdminBottomNav from '@/components/admin/BottomNav'

function MiniBar({ values, highlight }: { values: number[], highlight?: number }) {
  const max = Math.max(...values) || 1
  const today = highlight ?? values.length - 1
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:60 }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex:1, background: i===today?'#FF6B1A':'#E5E5E5', borderRadius:'3px 3px 0 0', height:`${Math.max((v/max)*100, 4)}%`, transition:'height 400ms' }} />
      ))}
    </div>
  )
}

function DonutChart({ segments, size=100 }: { segments:{label:string;pct:number;color:string}[], size?:number }) {
  const r = (size - 16) / 2, circ = 2 * Math.PI * r
  let offset = 0
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={10} />
        {segments.map((s, i) => {
          const dash = (s.pct/100) * circ
          const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={10} strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size/2} ${size/2})`} />
          offset += dash
          return el
        })}
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }} />
            <span style={{ fontSize:12, color:'#666' }}>{s.label}</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#0D0D0D', marginLeft:'auto' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportesAdminClient() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('Este mes')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const startMonth = new Date(); startMonth.setDate(1); startMonth.setHours(0,0,0,0)

    const [{ data: appts }, { data: clients }] = await Promise.all([
      supabase.from('appointments').select('*, services(name, price)').gte('scheduled_at', startMonth.toISOString()),
      supabase.from('profiles').select('id').eq('role','client').gte('created_at', startMonth.toISOString()),
    ])

    const completed  = (appts??[]).filter(a=>a.status==='completed')
    const cancelled  = (appts??[]).filter(a=>a.status==='cancelled')
    const revenue    = completed.reduce((s,a)=>s+(a.final_price??0),0)

    // Servicios más vendidos
    const svcMap: Record<string,{name:string;count:number;revenue:number}> = {}
    completed.forEach((a:any) => {
      const name = a.services?.name ?? 'Otros'
      if (!svcMap[name]) svcMap[name] = { name, count:0, revenue:0 }
      svcMap[name].count++
      svcMap[name].revenue += a.final_price??0
    })
    const topServices = Object.values(svcMap).sort((a,b)=>b.count-a.count).slice(0,4)

    // Ingresos últimos 7 días
    const dailyRevenue = Array.from({length:7}, (_,i) => {
      const d = new Date(); d.setDate(d.getDate()-6+i)
      const dayStr = d.toISOString().split('T')[0]
      return completed.filter((a:any)=>a.scheduled_at.startsWith(dayStr)).reduce((s,a)=>s+(a.final_price??0),0)
    })

    const totalPct = completed.length > 0 ? 100 : 0
    const donut = topServices.length > 0
      ? topServices.map((s,i) => ({
          label: s.name,
          pct:   Math.round((s.count / completed.length) * 100),
          color: ['#FF6B1A','#0D0D0D','#22C55E','#3B82F6'][i],
        }))
      : [{ label:'Sin datos', pct:100, color:'#F0F0F0' }]

    setData({
      revenue, completed: completed.length, cancelled: cancelled.length,
      newClients: clients?.length ?? 0, totalAppts: appts?.length ?? 0,
      avgTicket: completed.length > 0 ? Math.round(revenue / completed.length) : 0,
      dailyRevenue, topServices, donut,
      stats: [
        { label:'Citas realizadas',  value: String(completed.length), change:'+12%', up:true },
        { label:'Clientes únicos',   value: String(clients?.length??0), change:'+8%', up:true },
        { label:'Servicios vendidos',value: String(completed.length), change:'+18%', up:true },
        { label:'Ticket promedio',   value: `$${Math.round(revenue/Math.max(completed.length,1))}`, change:'+7%', up:true },
        { label:'Canceladas',        value: String(cancelled.length), change:'-20%', up:false },
      ],
    })
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
            <div>
              <p style={{ fontSize:18, fontWeight:700, color:'#0D0D0D', margin:0 }}>Reportes</p>
              <p style={{ fontSize:12, color:'#999', margin:'2px 0 0' }}>Tu rendimiento como barbero independiente</p>
            </div>
          </div>
          <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Bell size={22} color="#0D0D0D" /></button>
        </div>
        <div style={{ padding:'0 16px 14px' }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#F5F5F5', border:'none', borderRadius:10, padding:'8px 14px', cursor:'pointer', fontFamily:'inherit' }}>
            <span style={{ fontSize:13, color:'#0D0D0D', fontWeight:500 }}>📅 {period}</span>
            <ChevronDown size={14} color="#666" />
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* Hero revenue */}
        <div style={{ background:'#0D0D0D', borderRadius:18, padding:'20px', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <p style={{ fontSize:12, color:'#888', margin:'0 0 4px' }}>Ingresos netos</p>
          <p style={{ fontSize:32, fontWeight:800, color:'#FFF', margin:'0 0 4px' }}>${data.revenue.toLocaleString()}.00</p>
          <p style={{ fontSize:13, color:'#22C55E', margin:'0 0 16px', display:'flex', alignItems:'center', gap:4 }}><TrendingUp size={13} /> +18% vs mes anterior</p>
          <MiniBar values={data.dailyRevenue} highlight={6} />
          <div style={{ position:'absolute', top:20, right:20, width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <BarChart2 size={20} color="#FFF" />
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
          {data.stats.slice(0,3).map((s:any, i:number) => (
            <div key={i} style={{ background:'#FFF', borderRadius:14, padding:'12px 14px', border:'1px solid #F0F0F0' }}>
              <p style={{ fontSize:10, color:'#999', margin:'0 0 6px', lineHeight:1.3 }}>{s.label}</p>
              <p style={{ fontSize:18, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize:11, color: s.up?'#22C55E':'#EF4444', margin:0, display:'flex', alignItems:'center', gap:2 }}>
                {s.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {s.change}
              </p>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {data.stats.slice(3).map((s:any, i:number) => (
            <div key={i} style={{ background:'#FFF', borderRadius:14, padding:'12px 14px', border:'1px solid #F0F0F0' }}>
              <p style={{ fontSize:11, color:'#999', margin:'0 0 6px' }}>{s.label}</p>
              <p style={{ fontSize:22, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize:11, color: s.up?'#22C55E':'#EF4444', margin:0, display:'flex', alignItems:'center', gap:2 }}>
                {s.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Resumen rápido con dona */}
        <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:0 }}>Resumen rápido</p>
            <button onClick={() => {}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FF6B1A', fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:2 }}>
              Ver reporte completo <ChevronRight size={13} />
            </button>
          </div>
          <DonutChart segments={data.donut} />
        </div>

        {/* Servicios más vendidos */}
        {data.topServices.length > 0 && (
          <div style={{ background:'#FFF', borderRadius:16, padding:'16px 20px', marginBottom:14 }}>
            <p style={{ fontSize:15, fontWeight:700, color:'#0D0D0D', margin:'0 0 16px' }}>Servicios más vendidos</p>
            {data.topServices.map((s:any, i:number) => {
              const COLORS = ['#FF6B1A','#0D0D0D','#22C55E','#3B82F6']
              const maxCount = data.topServices[0].count
              const pct = Math.round((s.count/Math.max(maxCount,1))*100)
              return (
                <div key={i} style={{ marginBottom: i < data.topServices.length-1 ? 14 : 0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#0D0D0D', margin:0 }}>{s.name}</p>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0D0D0D', margin:0 }}>${s.revenue.toLocaleString()}</p>
                  </div>
                  <div style={{ height:6, background:'#F0F0F0', borderRadius:999 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:COLORS[i], borderRadius:999, transition:'width 600ms' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ height:80 }} />
      </div>

      <AdminBottomNav />
    </div>
  )
}
