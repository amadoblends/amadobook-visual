// AMADOBOOK — NuevoCliente_Step2.tsx
// Paso 2: Detalles adicionales (tags, referencia, preferencias)

'use client'

import { useState } from 'react'

export interface Step2Data {
  referredBy?: string
  preferredTime?: string
  tags: string[]
}

export interface NuevoClienteStep2Props {
  onNext: (data: Step2Data) => void
  onBack?: () => void
}

const AVAILABLE_TAGS = [
  'VIP', 'Frecuente', 'Referido', 'Corporativo', 'Nuevo', 'Joven', 'Familia',
]

const TIME_OPTIONS = [
  'Mañanas (8–12)',
  'Mediodía (12–15)',
  'Tardes (15–18)',
  'Noches (18–20)',
  'Sin preferencia',
]

function StepIndicator({ current }: { current: number }) {
  const steps = ['Información', 'Detalles', 'Notas', 'Confirmar']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((label, i) => {
        const n = i + 1, done = n < current, active = n === current
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

export default function NuevoCliente_Step2({ onNext, onBack }: NuevoClienteStep2Props) {
  const [referredBy,    setReferredBy]    = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [tags,          setTags]          = useState<string[]>([])

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px',
    background: '#F5F5F5', border: '1.5px solid transparent',
    borderRadius: 12, fontSize: 14, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nuevo Cliente</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={2} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Detalles</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Referido por */}
          <div>
            <label style={labelStyle}>Referido por (opcional)</label>
            <input type="text" value={referredBy} onChange={e => setReferredBy(e.target.value)}
              placeholder="Nombre de quien lo refirió" style={inputStyle} />
          </div>

          {/* Horario preferido */}
          <div>
            <label style={labelStyle}>Horario preferido</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setPreferredTime(opt === preferredTime ? '' : opt)}
                  style={{
                    height: 44, textAlign: 'left', padding: '0 14px',
                    background: preferredTime === opt ? '#0D0D0D' : '#F5F5F5',
                    color: preferredTime === opt ? '#FFF' : '#0D0D0D',
                    border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: preferredTime === opt ? 600 : 400,
                    cursor: 'pointer', transition: 'all 200ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  {opt}
                  {preferredTime === opt && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Tags / etiquetas */}
          <div>
            <label style={labelStyle}>Etiquetas (opcional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {AVAILABLE_TAGS.map(tag => {
                const selected = tags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: selected ? 'none' : '1px solid #E5E5E5',
                      background: selected ? '#FF6B1A' : 'transparent',
                      color: selected ? '#FFF' : '#666',
                      fontSize: 13, fontWeight: selected ? 600 : 400,
                      cursor: 'pointer', transition: 'all 200ms',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => onNext({ referredBy, preferredTime, tags })}
          style={{
            width: '100%', height: 52,
            background: '#0D0D0D', color: '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
