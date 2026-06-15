'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, ChevronRight, Calendar, Scissors, Clock, Plus, Tag, Star } from 'lucide-react'
import ClientBottomNav from '@/components/client/BottomNav'

export default function ClientHome({ userId }: { userId: string }) {
  const router   = useRouter()
  const supabase = createClient()
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: profile }, { data: services }, { data: appointments }, { data: offers }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('services').select('*').eq('is_active', true).order('display_order').limit(4),
          supabase.from('appointments')
            .select('*, services(name, duration_min)')
            .eq('client_id', userId)
            .in('status', ['pending', 'confirmed'])
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at').limit(1),
          supabase.from('offers').select('*').eq('status', 'active').limit(2),
        ])
      setData({ profile, services: services ?? [], nextAppt: appointments?.[0] ?? null, offers: offers ?? [] })
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) return <Loader />

  const { profile, services, nextAppt, offers } = data
  const name = profile?.full_name?.split(' ')[0] ?? 'Cliente'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <p style={S.greeting}>{greeting}, {name} 👋</p>
            <p style={S.subGreeting}>¿Listo para tu próximo corte?</p>
          </div>
        </div>
        <button onClick={() => router.push('/app/notificaciones')} style={S.iconBtn}>
          <Bell size={20} color="#0D0D0D" />
        </button>
      </div>

      {/* Scroll */}
      <div style={S.scroll}>

        {/* Banner oferta */}
        {offers.length > 0 && (
          <button onClick={() => router.push('/app/explorar')} style={S.offerBanner}>
            <div style={S.offerBadge}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                {offers[0].discount_value}{offers[0].discount_type === 'percentage' ? '%' : '$'}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>OFF</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#FFF', margin: 0 }}>{offers[0].name}</p>
              <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0' }}>Ver oferta →</p>
            </div>
          </button>
        )}

        {/* Próxima cita */}
        <Section title="Próxima cita" link="Ver todas" onLink={() => router.push('/app/citas')}>
          {nextAppt ? (
            <button onClick={() => router.push('/app/citas')} style={S.apptCard}>
              <div style={S.apptDateBadge}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                  {new Date(nextAppt.scheduled_at).getDate()}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>
                  {new Date(nextAppt.scheduled_at).toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', margin: '0 0 4px' }}>
                  {nextAppt.services?.name}
                </p>
                <p style={{ fontSize: 12, color: '#999', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} />
                  {new Date(nextAppt.scheduled_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span style={{ ...S.badge, background: nextAppt.status === 'confirmed' ? '#F0FDF4' : '#FFFBEB', color: nextAppt.status === 'confirmed' ? '#16A34A' : '#D97706' }}>
                {nextAppt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
              </span>
            </button>
          ) : (
            <button onClick={() => router.push('/app/citas/nueva')} style={S.emptyAppt}>
              <div style={S.emptyApptIcon}><Plus size={22} color="#FF6B1A" /></div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', margin: '0 0 4px' }}>Reserva tu primera cita</p>
                <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Toca aquí para empezar</p>
              </div>
            </button>
          )}
        </Section>

        {/* Accesos rápidos */}
        <div style={S.quickGrid}>
          {[
            { emoji: '📅', label: 'Reservar', bg: '#FFF3EC', color: '#FF6B1A', action: () => router.push('/app/citas/nueva') },
            { emoji: '✂️', label: 'Servicios', bg: '#F5F5F5', color: '#0D0D0D', action: () => router.push('/app/explorar') },
            { emoji: '🗓', label: 'Mis citas', bg: '#F5F5F5', color: '#0D0D0D', action: () => router.push('/app/citas') },
            { emoji: '🏷️', label: 'Ofertas',   bg: '#F5F5F5', color: '#0D0D0D', action: () => router.push('/app/explorar?tab=ofertas') },
          ].map((q, i) => (
            <button key={i} onClick={q.action} style={S.quickBtn}>
              <div style={{ ...S.quickIcon, background: q.bg }}>
                <span style={{ fontSize: 22 }}>{q.emoji}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: q.color }}>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Servicios */}
        {services.length > 0 && (
          <Section title="Nuestros servicios" link="Ver todos" onLink={() => router.push('/app/explorar')}>
            {services.map((s: any) => (
              <button key={s.id} onClick={() => router.push(`/app/citas/nueva?serviceId=${s.id}`)} style={S.serviceRow}>
                <div style={S.serviceIcon}><Scissors size={20} color="#FF6B1A" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D', margin: '0 0 3px' }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{s.duration_min} min</p>
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D', margin: 0 }}>${s.price}</p>
              </button>
            ))}
          </Section>
        )}

        <div style={{ height: 100 }} />
      </div>

      <ClientBottomNav />
    </div>
  )
}

function Section({ title, link, onLink, children }: any) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>{title}</span>
        {link && <button onClick={onLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#FF6B1A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'inherit' }}>
          {link} <ChevronRight size={14} />
        </button>}
      </div>
      {children}
    </div>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#F5F5F5' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #F0F0F0', borderTopColor: '#FF6B1A', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page:         { display: 'flex', flexDirection: 'column', height: '100dvh', background: '#F5F5F5', fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 430, margin: '0 auto' },
  header:       { background: '#FFF', paddingTop: 'env(safe-area-inset-top, 16px)', padding: '16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  avatar:       { width: 44, height: 44, borderRadius: '50%', background: '#FF6B1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#FFF', flexShrink: 0 },
  greeting:     { fontSize: 16, fontWeight: 700, color: '#0D0D0D', margin: 0 },
  subGreeting:  { fontSize: 12, color: '#999', margin: '2px 0 0' },
  iconBtn:      { background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%' },
  scroll:       { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 },
  offerBanner:  { background: '#0D0D0D', borderRadius: 16, padding: '18px 20px', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 14 },
  offerBadge:   { width: 52, height: 52, borderRadius: 14, background: '#FF6B1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 2 },
  apptCard:     { display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: '#FFF', borderRadius: 16, padding: 16, border: '1px solid #F0F0F0', cursor: 'pointer', textAlign: 'left' },
  apptDateBadge:{ width: 52, height: 56, borderRadius: 12, background: '#FF6B1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 2 },
  badge:        { fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, flexShrink: 0, whiteSpace: 'nowrap' },
  emptyAppt:    { display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: '#FFF', borderRadius: 16, padding: 20, border: '2px dashed #E5E5E5', cursor: 'pointer', textAlign: 'left' },
  emptyApptIcon:{ width: 48, height: 48, borderRadius: '50%', background: '#FFF3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  quickGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  quickBtn:     { display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#FFF', borderRadius: 14, border: '1px solid #F0F0F0', cursor: 'pointer', textAlign: 'left' },
  quickIcon:    { width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  serviceRow:   { display: 'flex', alignItems: 'center', gap: 14, background: '#FFF', borderRadius: 14, padding: '14px 16px', border: '1px solid #F0F0F0', cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: 10 },
  serviceIcon:  { width: 48, height: 48, borderRadius: 12, background: '#FFF3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
}
