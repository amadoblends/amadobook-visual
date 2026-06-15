'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Search, Scissors, Clock, Tag } from 'lucide-react'
import ClientBottomNav from '@/components/client/BottomNav'

function Explorar() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [tab, setTab] = useState<'servicios'|'ofertas'>(params.get('tab') === 'ofertas' ? 'ofertas' : 'servicios')
  const [services, setServices] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*').eq('is_active', true).order('display_order'),
      supabase.from('offers').select('*').in('status', ['active','scheduled']).order('start_date'),
    ]).then(([{ data: s }, { data: o }]) => { setServices(s ?? []); setOffers(o ?? []); setLoading(false) })
  }, [])

  const filtered = services.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ padding:'16px 16px 12px' }}>
          <p style={{ fontSize:20, fontWeight:700, color:'#0D0D0D', margin:'0 0 2px' }}>Explorar</p>
          <p style={{ fontSize:13, color:'#999', margin:0 }}>Descubre nuestros servicios y ofertas</p>
        </div>
        <div style={{ padding:'0 16px 12px', position:'relative' }}>
          <Search size={16} color="#999" style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' } as any} />
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar servicios..." style={{ width:'100%', height:44, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
        </div>
        <div style={{ display:'flex', margin:'0 16px 14px', background:'#F5F5F5', borderRadius:12, padding:3, gap:2 }}>
          {[{k:'servicios',l:'Servicios'},{k:'ofertas',l:'Ofertas'}].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', background: tab===t.k?'#FFF':'transparent', color: tab===t.k?'#0D0D0D':'#999', fontSize:14, fontWeight: tab===t.k?700:400, boxShadow: tab===t.k?'0 1px 4px rgba(0,0,0,0.08)':'none', fontFamily:'inherit' }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {tab === 'servicios' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign:'center', color:'#999', paddingTop:48 }}>No se encontraron servicios</p>
            ) : filtered.map((s:any) => (
              <button key={s.id} onClick={() => router.push(`/app/citas/nueva?serviceId=${s.id}`)} style={{ display:'flex', alignItems:'center', gap:14, background:'#FFF', borderRadius:14, padding:'14px 16px', border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left', width:'100%' }}>
                <div style={{ width:52, height:52, borderRadius:12, background:'#FFF3EC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Scissors size={22} color="#FF6B1A" />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:600, color:'#0D0D0D', margin:'0 0 4px' }}>{s.name}</p>
                  <p style={{ fontSize:12, color:'#999', margin:0, display:'flex', alignItems:'center', gap:4 }}><Clock size={11} />{s.duration_min} min</p>
                  {s.description && <p style={{ fontSize:12, color:'#CCC', margin:'4px 0 0' }}>{s.description}</p>}
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:17, fontWeight:800, color:'#0D0D0D', margin:'0 0 4px' }}>${s.price}</p>
                  <p style={{ fontSize:11, color:'#FF6B1A', fontWeight:600, margin:0 }}>Reservar →</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {tab === 'ofertas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {offers.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:14 }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center' }}><Tag size={32} color="#CCC" /></div>
                <p style={{ fontSize:16, fontWeight:600, color:'#0D0D0D', margin:0 }}>Sin ofertas activas</p>
                <p style={{ fontSize:14, color:'#999', textAlign:'center', maxWidth:220, lineHeight:1.6, margin:0 }}>Las ofertas aparecerán aquí cuando estén disponibles.</p>
              </div>
            ) : offers.map((o:any) => (
              <div key={o.id} style={{ background:'#FFF', borderRadius:14, padding:16, border:'1px solid #F0F0F0', display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ width:60, height:60, borderRadius:14, background:'#FF6B1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, gap:1 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:'#FFF', lineHeight:1 }}>{o.discount_value}{o.discount_type==='percentage'?'%':'$'}</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.8)' }}>OFF</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 4px' }}>{o.name}</p>
                  <p style={{ fontSize:12, color:'#999', margin:'0 0 8px' }}>{new Date(o.start_date).toLocaleDateString('es-MX',{day:'numeric',month:'short'})} – {new Date(o.end_date).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}</p>
                  <span style={{ background: o.status==='active'?'#F0FDF4':'#EFF6FF', color: o.status==='active'?'#16A34A':'#2563EB', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999 }}>
                    {o.status==='active'?'Activa':'Próximamente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height:100 }} />
      </div>
      <ClientBottomNav />
    </div>
  )
}

export default function ExplorarPage() {
  return <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}><Explorar /></Suspense>
}
