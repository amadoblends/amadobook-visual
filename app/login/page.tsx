'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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

  const handleEmail = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/'); router.refresh() }
  }

  const s = { width: '100%', padding: 12, boxSizing: 'border-box' as const, marginBottom: 10, fontSize: 15 }

  return (
    <div style={{ maxWidth: 430, margin: '60px auto', padding: 32, fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48 }}>✂️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>AmadoBook</h1>
        <p style={{ color: '#666', margin: 0 }}>Tu barbería en tu bolsillo</p>
      </div>

      {error && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</p>}

      <button onClick={handleGoogle} style={{ ...s, background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 20 }}>G</span> Continuar con Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
        <span style={{ color: '#ccc', fontSize: 13 }}>o</span>
        <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
      </div>

      <input type="email"    placeholder="Correo electrónico" value={email}    onChange={e => setEmail(e.target.value)}    style={{ ...s, borderRadius: 12, border: '1.5px solid #e5e5e5', background: '#f5f5f5' }} />
      <input type="password" placeholder="Contraseña"         value={password} onChange={e => setPassword(e.target.value)} style={{ ...s, borderRadius: 12, border: '1.5px solid #e5e5e5', background: '#f5f5f5', marginBottom: 20 }} />

      <button onClick={handleEmail} disabled={loading} style={{ ...s, background: loading ? '#e5e5e5' : '#0d0d0d', color: loading ? '#999' : '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700, marginBottom: 0 }}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
        ¿No tienes cuenta?{' '}
        <a href="/register" style={{ color: '#FF6B1A', fontWeight: 700 }}>Regístrate</a>
      </p>
    </div>
  )
}
