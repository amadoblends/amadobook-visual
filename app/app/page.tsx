import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClientHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: services } = await supabase.from('services').select('*').eq('is_active', true).order('display_order')

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 430, margin: '0 auto' }}>
      <h1>¡Hola, {profile?.full_name}! ✂️</h1>
      <p style={{ color: '#666' }}>Bienvenido a AmadoBook</p>
      <h2>Nuestros servicios</h2>
      {services?.map((s: any) => (
        <div key={s.id} style={{ padding: 14, border: '1px solid #eee', borderRadius: 12, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{s.name}</strong>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>{s.duration_min} min</p>
          </div>
          <strong style={{ color: '#FF6B1A' }}>${s.price}</strong>
        </div>
      ))}
    </div>
  )
}
