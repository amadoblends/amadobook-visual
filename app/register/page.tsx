'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router   = useRouter()
  const supabase = createClient()

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const handleRegister = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: 'client' } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/app'); router.refresh() }
  }

  const s = { width: '100%', padding: 12, boxSizing: 'border-box' as const, marginBottom: 10, fontSize: 15, borderRadius: 12, border: '1.5px solid #e5e5e5', background: '#f5f5f5' }

  return (
    <div style={{ maxWidth: 430, margin: '60px auto', padding: 32, fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48 }}>✂️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Crea tu cuenta</h1>
        <p style={{ color: '#666', margin: 0 }}>Accede a tu barbería favorita</p>
      </div>

      {error && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8 }}>{error}</p>}

      <button onClick={handleGoogle} style={{ width: '100%', padding: 12, background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 12, cursor: 'pointer', marginBottom: 20, fontSize: 15 }}>
        G  Registrarse con Google
      </button>

      <input type="text"     placeholder="Nombre completo"    value={name}     onChange={e => setName(e.target.value)}     style={s} />
      <input type="email"    placeholder="Correo electrónico" value={email}    onChange={e => setEmail(e.target.value)}    style={s} />
      <input type="password" placeholder="Contraseña"         value={password} onChange={e => setPassword(e.target.value)} style={{ ...s, marginBottom: 20 }} />

      <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: 14, background: loading ? '#e5e5e5' : '#FF6B1A', color: loading ? '#999' : '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700 }}>
        {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
        ¿Ya tienes cuenta?{' '}
        <a href="/login" style={{ color: '#FF6B1A', fontWeight: 700 }}>Inicia sesión</a>
      </p>
    </div>
  )
}
