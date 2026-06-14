'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Search, Scissors, Clock, Tag, Package } from 'lucide-react'

export default function ExplorarPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [tab,      setTab]      = useState<'servicios'|'ofertas'>('servicios')
  const [services, setServices] = useState<any[]>([])
  const [offers,   setOffers]   = useState<any[]>([])
  const [query,    setQuery]    = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: svcs }, { data: offs }] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('offers').select('*').in('status', ['active','scheduled']).order('start_date'),
      ])
      setServices(svcs ?? [])
      setOffers(offs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = services.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#F5F5F5' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top, 16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 16px 12px' }}>
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <ArrowLeft size={22} color="#0D0D0D" />
          </button>
          <div style={{ fontSize:17, fontWeight:700, color:'#0D0D0D' }}>Explorar</div>
        </div>

        {/* Buscador */}
        <div style={{ padding:'0 16px 12px', position:'relative' }}>
          <Search size={16} color="#999" style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-58%)', pointerEvents:'none' }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar servicios..." style={{ width:'100%', height:44, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', margin:'0 16px 14px', background:'#F5F5F5', borderRadius:12, padding:3, gap:2 }}>
          {[{key:'servicios' as const,label:'Servicios',icon:<Scissors size={14}/>},{key:'ofertas' as const,label:'Ofertas',icon:<Tag size={14}/>}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer',
              background: tab === t.key ? '#FFF' : 'transparent',
              color: tab === t.key ? '#0D0D0D' : '#999',
              fontSize:14, fontWeight: tab === t.key ? 700 : 400,
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>{t.icon}{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {tab === 'servicios' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', paddingTop:48, color:'#999' }}>No se encontraron servicios</div>
            ) : filtered.map((srv: any) => (
              <button key={srv.id} onClick={() => router.push(`/app/citas/nueva?serviceId=${srv.id}`)} style={{
                display:'flex', alignItems:'center', gap:14, background:'#FFF', borderRadius:14, padding:'14px 16px', border:'1px solid #F0F0F0', cursor:'pointer', textAlign:'left', width:'100%',
              }}>
                <div style={{ width:52, height:52, borderRadius:12, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Scissors size={22} color="#FF6B1A" />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:'#0D0D0D', marginBottom:3 }}>{srv.name}</div>
                  <div style={{ fontSize:12, color:'#999', display:'flex', alignItems:'center', gap:4 }}><Clock size={11} /> {srv.duration_min} min</div>
                  {srv.description && <div style={{ fontSize:12, color:'#CCC', marginTop:3 }}>{srv.description}</div>}
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:'#0D0D0D', textAlign:'right' }}>${srv.price}</div>
                  <div style={{ fontSize:11, color:'#FF6B1A', fontWeight:600, textAlign:'right', marginTop:4 }}>Reservar →</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'ofertas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {offers.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:64, gap:12 }}>
                <Tag size={48} color="#CCC" />
                <div style={{ fontSize:16, fontWeight:600, color:'#0D0D0D' }}>Sin ofertas activas</div>
                <div style={{ fontSize:14, color:'#999', textAlign:'center' }}>Las ofertas aparecerán aquí cuando estén disponibles.</div>
              </div>
            ) : offers.map((offer: any) => (
              <div key={offer.id} style={{ background:'#FFF', borderRadius:14, padding:16, border:'1px solid #F0F0F0', display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ width:60, height:60, borderRadius:14, background:'#FF6B1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:'#FFF', lineHeight:1 }}>{offer.discount_value}{offer.discount_type === 'percentage' ? '%' : '$'}</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.8)' }}>OFF</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', marginBottom:4 }}>{offer.name}</div>
                  <div style={{ fontSize:12, color:'#999' }}>
                    {new Date(offer.start_date).toLocaleDateString('es-MX', { day:'numeric', month:'short' })} – {new Date(offer.end_date).toLocaleDateString('es-MX', { day:'numeric', month:'short' })}
                  </div>
                  <span style={{ background: offer.status === 'active' ? '#F0FDF4' : '#EFF6FF', color: offer.status === 'active' ? '#16A34A' : '#2563EB', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999, display:'inline-block', marginTop:6 }}>
                    {offer.status === 'active' ? 'Activa' : 'Próximamente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height:100 }} />
      </div>
    </div>
  )
}
