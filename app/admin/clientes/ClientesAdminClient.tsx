'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, MoreVertical, Phone, MessageCircle, TrendingUp } from 'lucide-react'
import AdminBottomNav from '@/components/admin/BottomNav'

export default function ClientesAdminClient() {
  const router = useRouter()
  const supabase = createClient()
  const [clients, setClients] = useState<any[]>([])
  const [counts, setCounts]   = useState<Record<string,number>>({})
  const [filter, setFilter]   = useState<'all'|'active'|'new'|'inactive'>('all')
  const [query,  setQuery]    = useState('')
  const [loading, setLoading] = useState(true)
  const [totals, setTotals]   = useState({ total:0, active:0, newMonth:0 })

  useEffect(() => { loadClients() }, [])

  async function loadClients() {
    setLoading(true)
    const [{ data: cls }, { data: appts }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role','client').order('full_name'),
      supabase.from('appointments').select('client_id, status, final_price'),
    ])
    
    const cMap: Record<string,{total:number,completed:number,spent:number}> = {}
    appts?.forEach((a:any) => {
      if (!cMap[a.client_id]) cMap[a.client_id] = { total:0, completed:0, spent:0 }
      cMap[a.client_id].total++
      if (a.status === 'completed') { cMap[a.client_id].completed++; cMap[a.client_id].spent += a.final_price??0 }
    })

    const startMonth = new Date(); startMonth.setDate(1); startMonth.setHours(0,0,0,0)
    const enriched = (cls??[]).map((c:any) => ({
      ...c,
      apptCount: cMap[c.id]?.total ?? 0,
      spent: cMap[c.id]?.spent ?? 0,
      isNew: new Date(c.created_at) >= startMonth,
    }))
    
    setClients(enriched)
    setTotals({
      total:    enriched.length,
      active:   enriched.filter(c=>c.status==='active').length,
      newMonth: enriched.filter(c=>c.isNew).length,
    })
    setLoading(false)
  }

  const filtered = clients.filter(c => {
    const matchQ = !query || c.full_name?.toLowerCase().includes(query.toLowerCase()) || c.phone?.includes(query)
    const matchF = filter==='all' || (filter==='active'&&c.status==='active') || (filter==='new'&&c.isNew) || (filter==='inactive'&&c.status==='inactive')
    return matchQ && matchF
  })

  const filterTabs = [
    { key:'all' as const,      label:`Todos ${totals.total}` },
    { key:'active' as const,   label:`Activos ${totals.active}` },
    { key:'new' as const,      label:`Nuevos ${totals.newMonth}` },
    { key:'inactive' as const, label:'Inactivos 0' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
            <p style={{ fontSize:18, fontWeight:700, color:'#0D0D0D', margin:0 }}>Clientes</p>
          </div>
          <button onClick={() => router.push('/admin/clientes/nuevo')} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Plus size={22} color="#0D0D0D" /></button>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:10, padding:'0 16px 12px' }}>
          <div style={{ flex:1, background:'#F9F9F9', borderRadius:12, padding:'10px 14px' }}>
            <p style={{ fontSize:11, color:'#999', margin:'0 0 2px' }}>Total clientes</p>
            <p style={{ fontSize:18, fontWeight:800, color:'#0D0D0D', margin:0 }}>{totals.total}</p>
          </div>
          <div style={{ flex:1, background:'#F9F9F9', borderRadius:12, padding:'10px 14px' }}>
            <p style={{ fontSize:11, color:'#999', margin:'0 0 2px' }}>Clientes activos</p>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <p style={{ fontSize:18, fontWeight:800, color:'#0D0D0D', margin:0 }}>{totals.active}</p>
              <TrendingUp size={12} color="#22C55E" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding:'0 16px 12px', position:'relative' }}>
          <Search size={16} color="#999" style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' } as any} />
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar cliente..." style={{ width:'100%', height:44, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
        </div>

        {/* Filtros */}
        <div style={{ display:'flex', gap:6, padding:'0 16px 14px', overflowX:'auto', scrollbarWidth:'none' }}>
          {filterTabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:999, border:'none', background: filter===t.key?'#0D0D0D':'#F5F5F5', color: filter===t.key?'#FFF':'#666', fontSize:13, fontWeight: filter===t.key?600:400, cursor:'pointer', fontFamily:'inherit' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : filtered.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:12 }}>
            <div style={{ fontSize:48 }}>👥</div>
            <p style={{ fontSize:16, fontWeight:700, color:'#0D0D0D', margin:0 }}>Sin clientes</p>
          </div>
        ) : filtered.map((c:any) => (
          <button key={c.id} onClick={() => router.push(`/admin/clientes/${c.id}`)} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', background:'#FFF', borderRadius:16, padding:'14px 16px', marginBottom:10, border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#FFF', flexShrink:0 }}>
              {c.full_name?.split(' ').map((n:string)=>n[0]).join('').slice(0,2) ?? 'C'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.full_name}</p>
              <p style={{ fontSize:12, color:'#999', margin:0 }}>{c.phone ?? c.email ?? 'Sin contacto'}</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 2px' }}>{c.apptCount} citas</p>
              <p style={{ fontSize:11, color:'#999', margin:0 }}>⋯</p>
            </div>
          </button>
        ))}
        <div style={{ height:100 }} />
      </div>

      <AdminBottomNav />
    </div>
  )
}
