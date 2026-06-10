// AMADOBOOK — NuevoCliente_Step1.tsx
// Paso 1: Información personal del nuevo cliente
// Ruta: /admin/clientes/nuevo (step 1)

'use client'

import { useState } from 'react'

export interface Step1Data {
  name: string
  phone: string
  email: string
  birthDate: string
  avatarFile?: File
}

export interface NuevoClienteStep1Props {
  onNext: (data: Step1Data) => void
  onBack?: () => void
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Información', 'Detalles', 'Notas', 'Confirmar']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current, active = n === current
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, background: done ? '#0D0D0D' : '#E5E5E5', zIndex: 0 }} />
            )}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', zIndex: 1, flexShrink: 0,
              background: done || active ? '#0D0D0D' : '#E5E5E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none',
            }}>
              {done ? <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>
                    : <span style={{ color: active ? '#FFF' : '#999', fontSize: 12, fontWeight: 700 }}>{n}</span>}
            </div>
            <span style={{ fontSize: 10, color: active ? '#0D0D0D' : '#999', fontWeight: active ? 700 : 400, textAlign: 'center', lineHeight: 1.2 }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function NuevoCliente_Step1({ onNext, onBack }: NuevoClienteStep1Props) {
  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [email,        setEmail]        = useState('')
  const [birthDate,    setBirthDate]    = useState('')
  const [avatarFile,   setAvatarFile]   = useState<File | undefined>()
  const [avatarPreview,setAvatarPreview]= useState<string | undefined>()

  const canContinue = name.trim().length > 0 && phone.trim().length > 0

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px',
    background: '#F5F5F5', border: '1.5px solid transparent',
    borderRadius: 12, fontSize: 14, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#666',
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nuevo Cliente</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={1} />
        </div>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Información personal</div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: avatarPreview ? 'transparent' : '#F5F5F5',
              border: '2px dashed #E5E5E5',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '📷'
              }
            </div>
            <span style={{ fontSize: 12, color: '#999' }}>Agregar foto (opcional)</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </label>
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nombre completo *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Escribe el nombre completo" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Teléfono *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="(555) 000-0000" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Fecha de nacimiento</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
              style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Siguiente */}
      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => canContinue && onNext({ name, phone, email, birthDate, avatarFile })}
          disabled={!canContinue}
          style={{
            width: '100%', height: 52,
            background: canContinue ? '#0D0D0D' : '#E5E5E5',
            color: canContinue ? '#FFF' : '#999',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
