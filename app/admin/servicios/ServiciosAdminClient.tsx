'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, Search, Plus, MoreVertical, Check, X } from 'lucide-react'
import AdminBottomNav from '@/components/admin/BottomNav'

export default function ServiciosAdminClient() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'servicios'|'paquetes'|'ofertas'>('servicios')
  const [services, setServices] = useState<any[]>([])
  const [offers,   setOffers]   = useState<any[]>([])
  const [query,    setQuery]    = useState('')
  const [loading,  setLoading]  = useState(true)
  const [menu,     setMenu]     = useState<string|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', duration_min:30, price:0, description:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [{ data: s }, { data: o }] = await Promise.all([
      supabase.from('services').select('*').order('display_order'),
      supabase.from('offers').select('*').order('start_date', { ascending: false }),
    ])
    setServices(s ?? [])
    setOffers(o ?? [])
    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('services').update({ is_active: !current }).eq('id', id)
    setServices(prev => prev.map(s => s.id===id ? {...s, is_active:!current} : s))
    setMenu(null)
  }

  async function deleteService(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return
    await supabase.from('services').delete().eq('id', id)
    setServices(prev => prev.filter(s => s.id!==id))
    setMenu(null)
  }

  async function saveService() {
    if (!form.name || !form.price) return
    setSaving(true)
    const { error } = await supabase.from('services').insert({ ...form, is_active: true, display_order: services.length + 1 })
    if (!error) { await load(); setShowModal(false); setForm({ name:'', duration_min:30, price:0, description:'' }) }
    setSaving(false)
  }

  const filtered = services.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))
  const active   = services.filter(s => s.is_active).length

  const STATUS_OFFER: Record<string,{label:string;bg:string;color:string}> = {
    active:    { label:'Activa',     bg:'#F0FDF4', color:'#16A34A' },
    scheduled: { label:'Programada', bg:'#EFF6FF', color:'#2563EB' },
    finished:  { label:'Finalizada', bg:'#F9FAFB', color:'#6B7280' },
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'#F5F5F5', fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:'#FFF', paddingTop:'env(safe-area-inset-top,16px)', borderBottom:'1px solid #F0F0F0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
            <div>
              <p style={{ fontSize:18, fontWeight:700, color:'#0D0D0D', margin:0 }}>Servicios</p>
              <p style={{ fontSize:12, color:'#999', margin:'2px 0 0' }}>Gestiona todos los servicios de tu barbería</p>
            </div>
          </div>
          <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><Bell size={22} color="#0D0D0D" /></button>
        </div>

        {/* Search */}
        <div style={{ padding:'0 16px 10px', position:'relative' }}>
          <Search size={16} color="#999" style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' } as any} />
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar servicio..." style={{ width:'100%', height:42, paddingLeft:40, background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:10, padding:'0 16px 12px' }}>
          {[
            { emoji:'✂️', label:'Servicios', value: services.length, color:'#0D0D0D' },
            { emoji:'✓',  label:'Activos',   value: active,          color:'#16A34A' },
            { emoji:'📦', label:'Paquetes',  value: 0,               color:'#3B82F6' },
            { emoji:'🏷️', label:'Ofertas',   value: offers.length,   color:'#FF6B1A' },
          ].map((s,i) => (
            <div key={i} style={{ background:'#F9F9F9', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
              <span style={{ fontSize:14 }}>{s.emoji}</span>
              <div>
                <p style={{ fontSize:16, fontWeight:800, color:s.color, margin:0, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:10, color:'#999', margin:'2px 0 0' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderTop:'1px solid #F0F0F0' }}>
          {(['servicios','paquetes','ofertas'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'12px 0', background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight: tab===t?700:400, color: tab===t?'#0D0D0D':'#999', borderBottom: tab===t?'2px solid #0D0D0D':'2px solid transparent', fontFamily:'inherit', textTransform:'capitalize' }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}><div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F0F0F0', borderTopColor:'#FF6B1A', animation:'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : (
          <>
            {tab==='servicios' && <>
              {filtered.length===0 ? (
                <p style={{ textAlign:'center', color:'#CCC', paddingTop:48 }}>No hay servicios</p>
              ) : filtered.map((s:any) => (
                <div key={s.id} style={{ background:'#FFF', borderRadius:14, padding:'14px 16px', marginBottom:10, border:'1px solid #F0F0F0', display:'flex', alignItems:'center', gap:14, opacity: s.is_active?1:0.5, position:'relative' }}>
                  <div style={{ width:52, height:52, borderRadius:12, background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>✂️</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</p>
                    <p style={{ fontSize:12, color:'#999', margin:0 }}>{s.duration_min} min</p>
                  </div>
                  <p style={{ fontSize:16, fontWeight:800, color:'#0D0D0D', margin:0 }}>${s.price}</p>
                  <button onClick={() => setMenu(menu===s.id?null:s.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><MoreVertical size={16} color="#CCC" /></button>
                  {menu===s.id && (
                    <>
                      <div onClick={() => setMenu(null)} style={{ position:'fixed', inset:0, zIndex:10 }} />
                      <div style={{ position:'absolute', right:12, top:48, background:'#FFF', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', border:'1px solid #F0F0F0', zIndex:20, overflow:'hidden', minWidth:170 }}>
                        <button onClick={() => toggleActive(s.id, s.is_active)} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'none', border:'none', borderBottom:'1px solid #F5F5F5', cursor:'pointer', width:'100%', fontSize:14, color:'#0D0D0D', fontFamily:'inherit' }}>
                          {s.is_active ? <><X size={14}/> Desactivar</> : <><Check size={14}/> Activar</>}
                        </button>
                        <button onClick={() => deleteService(s.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'none', border:'none', cursor:'pointer', width:'100%', fontSize:14, color:'#DC2626', fontFamily:'inherit' }}>
                          <X size={14}/> Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>}

            {tab==='paquetes' && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:14 }}>
                <div style={{ fontSize:48 }}>📦</div>
                <p style={{ fontSize:16, fontWeight:600, color:'#0D0D0D', margin:0 }}>Sin paquetes</p>
                <p style={{ fontSize:14, color:'#999', textAlign:'center', margin:0 }}>Los paquetes te permitirán combinar servicios.</p>
              </div>
            )}

            {tab==='ofertas' && <>
              {offers.length===0 ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:60, gap:14 }}>
                  <div style={{ fontSize:48 }}>🏷️</div>
                  <p style={{ fontSize:16, fontWeight:600, color:'#0D0D0D', margin:0 }}>Sin ofertas</p>
                </div>
              ) : offers.map((o:any) => {
                const cfg = STATUS_OFFER[o.status] ?? STATUS_OFFER.scheduled
                return (
                  <div key={o.id} style={{ background:'#FFF', borderRadius:14, padding:'14px 16px', marginBottom:10, border:'1px solid #F0F0F0', display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:56, height:56, borderRadius:12, background:'#FF6B1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:14, fontWeight:800, color:'#FFF', lineHeight:1 }}>{o.discount_value}{o.discount_type==='percentage'?'%':'$'}</span>
                      <span style={{ fontSize:10, color:'rgba(255,255,255,0.8)' }}>OFF</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:14, fontWeight:700, color:'#0D0D0D', margin:'0 0 4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{o.name}</p>
                      <p style={{ fontSize:12, color:'#999', margin:'0 0 6px' }}>
                        {new Date(o.start_date).toLocaleDateString('es-MX',{day:'numeric',month:'short'})} – {new Date(o.end_date).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}
                      </p>
                      <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999 }}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </>}
          </>
        )}
        <div style={{ height:100 }} />
      </div>

      {/* Botón agregar */}
      <div style={{ padding:'12px 16px calc(12px + env(safe-area-inset-bottom,0px))', borderTop:'1px solid #F0F0F0', background:'#FFF', flexShrink:0 }}>
        <button onClick={() => setShowModal(true)} style={{ width:'100%', height:52, background:'#FF6B1A', color:'#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit' }}>
          <Plus size={18} /> {tab==='servicios'?'Agregar servicio':tab==='paquetes'?'Crear paquete':'Crear oferta'}
        </button>
      </div>

      {/* Modal agregar servicio */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:'#FFF', borderRadius:'20px 20px 0 0', padding:'20px 20px calc(20px + env(safe-area-inset-bottom,0px))', width:'100%', maxWidth:430 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <p style={{ fontSize:17, fontWeight:700, color:'#0D0D0D', margin:0 }}>Nuevo servicio</p>
              <button onClick={() => setShowModal(false)} style={{ background:'#F5F5F5', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>✕</button>
            </div>
            {[
              { label:'Nombre *', key:'name', type:'text', placeholder:'Ej: Corte clásico' },
              { label:'Duración (min)', key:'duration_min', type:'number', placeholder:'30' },
              { label:'Precio ($)', key:'price', type:'number', placeholder:'200' },
              { label:'Descripción', key:'description', type:'text', placeholder:'Descripción opcional' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#666', margin:'0 0 6px' }}>{f.label}</p>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: f.type==='number' ? Number(e.target.value) : e.target.value}))} style={{ width:'100%', height:48, padding:'0 14px', background:'#F5F5F5', border:'none', borderRadius:12, fontSize:14, color:'#0D0D0D', outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }} />
              </div>
            ))}
            <button onClick={saveService} disabled={saving || !form.name || !form.price} style={{ width:'100%', height:52, background: saving||!form.name||!form.price?'#E5E5E5':'#0D0D0D', color: saving||!form.name||!form.price?'#999':'#FFF', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor: saving||!form.name||!form.price?'not-allowed':'pointer', fontFamily:'inherit' }}>
              {saving ? 'Guardando...' : 'Crear servicio'}
            </button>
          </div>
        </div>
      )}

      <AdminBottomNav />
    </div>
  )
}
