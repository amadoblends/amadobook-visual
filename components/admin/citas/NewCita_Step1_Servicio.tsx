// AMADOBOOK — NewCita_Step1_Servicio.tsx
// Paso 1 del stepper "Nueva Cita" (admin)
// Seleccionar servicio de la lista

'use client'

import { useState } from 'react'

export interface Servicio {
  id: string
  name: string
  duration: number    // minutos
  price: number
  icon?: string       // emoji o URL
}

export interface Step1ServicioProps {
  services: Servicio[]
  onNext: (serviceId: string) => void
  onBack?: () => void
}

// ─── Stepper indicator ────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Servicio' },
    { n: 2, label: 'Cliente'  },
    { n: 3, label: 'Fecha y Hora' },
    { n: 4, label: 'Confirmar' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((step, i) => {
        const done    = step.n < current
        const active  = step.n === current
        const pending = step.n > current
        return (
          <div key={step.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                top: 14,
                left: '50%',
                right: '-50%',
                height: 2,
                background: done ? '#0D0D0D' : '#E5E5E5',
                zIndex: 0,
              }} />
            )}
            {/* Circle */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: done ? '#0D0D0D' : active ? '#0D0D0D' : '#E5E5E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              flexShrink: 0,
              border: active ? '3px solid #0D0D0D' : 'none',
              boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none',
            }}>
              {done ? (
                <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>
              ) : (
                <span style={{ color: active ? '#FFF' : '#999', fontSize: 12, fontWeight: 700 }}>{step.n}</span>
              )}
            </div>
            {/* Label */}
            <span style={{
              fontSize: 10,
              color: active ? '#0D0D0D' : '#999',
              fontWeight: active ? 700 : 400,
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function NewCita_Step1_Servicio({ services, onNext, onBack }: Step1ServicioProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: '#FFF',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430,
      margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 16px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nueva Cita</div>
          <div style={{ width: 22 }} />
        </div>

        {/* Stepper */}
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={1} />
        </div>
      </div>

      {/* ── Lista de servicios ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Selecciona un servicio
        </div>

        {services.map(srv => {
          const isSelected = selected === srv.id
          return (
            <button
              key={srv.id}
              onClick={() => setSelected(srv.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #F5F5F5',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {/* Ícono del servicio */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: isSelected ? '#FF6B1A' : '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
                transition: 'background 200ms',
              }}>
                {srv.icon ?? '✂️'}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0D0D0D' }}>{srv.name}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{srv.duration} min</div>
              </div>

              {/* Precio */}
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginRight: 8 }}>
                ${srv.price}
              </div>

              {/* Radio button */}
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: isSelected ? 'none' : '2px solid #E5E5E5',
                background: isSelected ? '#FF6B1A' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 200ms',
              }}>
                {isSelected && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFF' }} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Botón Siguiente ── */}
      <div style={{
        padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #F0F0F0',
        background: '#FFF',
      }}>
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          style={{
            width: '100%',
            height: 52,
            background: selected ? '#0D0D0D' : '#E5E5E5',
            color: selected ? '#FFF' : '#999',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'background 200ms',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_SERVICES: Servicio[] = [
  { id: 's1', name: 'Corte clásico',     duration: 30, price: 200, icon: '✂️' },
  { id: 's2', name: 'Degradado',          duration: 40, price: 250, icon: '💈' },
  { id: 's3', name: 'Corte + Barba',      duration: 45, price: 300, icon: '✂️' },
  { id: 's4', name: 'Degradado + Barba',  duration: 60, price: 350, icon: '💈' },
  { id: 's5', name: 'Diseño de Barba',    duration: 20, price: 150, icon: '🪒' },
  { id: 's6', name: 'Corte Niños',        duration: 30, price: 180, icon: '✂️' },
]
