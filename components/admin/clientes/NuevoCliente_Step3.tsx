// AMADOBOOK — NuevoCliente_Step3.tsx
// Paso 3: Notas privadas del barbero sobre el cliente

'use client'

import { useState } from 'react'

export interface Step3Data {
  notes: string
}

export interface NuevoClienteStep3Props {
  onNext: (data: Step3Data) => void
  onBack?: () => void
}

const NOTE_SUGGESTIONS = [
  'Prefiere degradado bajo',
  'Usa producto para barba',
  'Alérgico a ciertos productos',
  'Piel sensible',
  'Le gusta el corte muy corto',
  'Prefiere que no se hable mucho',
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

export default function NuevoCliente_Step3({ onNext, onBack }: NuevoClienteStep3Props) {
  const [notes, setNotes] = useState('')

  const addSuggestion = (s: string) => {
    setNotes(prev => prev ? `${prev}. ${s}` : s)
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
          <StepIndicator current={3} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 4 }}>Notas privadas</div>
          <div style={{ fontSize: 13, color: '#999', lineHeight: 1.5 }}>
            Estas notas solo las verás tú. Anota preferencias, alergias o cualquier detalle útil para el servicio.
          </div>
        </div>

        {/* Textarea de notas */}
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Escribe aquí las notas del cliente..."
          rows={6}
          style={{
            width: '100%', padding: '14px',
            background: '#F5F5F5', border: '1.5px solid transparent',
            borderRadius: 12, fontSize: 14, color: '#0D0D0D',
            outline: 'none', resize: 'none',
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
            boxSizing: 'border-box',
          }}
        />

        {/* Sugerencias rápidas */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 10 }}>
            Sugerencias rápidas:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {NOTE_SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => addSuggestion(s)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: '1px solid #E5E5E5',
                  background: 'transparent',
                  color: '#666', fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => onNext({ notes })}
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
