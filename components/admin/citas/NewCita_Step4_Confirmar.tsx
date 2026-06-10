// AMADOBOOK — NewCita_Step4_Confirmar.tsx
// Paso 4: Resumen completo + notas opcionales + botón Confirmar Cita

'use client'

import { useState } from 'react'

export interface Step4ConfirmarProps {
  service: { name: string; price: number; duration: number }
  client:  { name: string; phone: string; avatar?: string }
  date: string         // "Miércoles, 15 de Mayo 2024"
  time: string         // "10:00 AM"
  barber?: string      // "Alex The Barber"
  onConfirm: (notes: string) => void
  onBack?: () => void
  loading?: boolean
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Servicio', 'Cliente', 'Fecha y Hora', 'Confirmar']
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

function SummaryRow({ icon, label, value, valueStyle }: {
  icon: string; label: string; value: string; valueStyle?: React.CSSProperties
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0', borderBottom: '1px solid #F5F5F5',
    }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D', ...valueStyle }}>{value}</div>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function NewCita_Step4_Confirmar({
  service, client, date, time, barber = 'Alex The Barber',
  onConfirm, onBack, loading = false,
}: Step4ConfirmarProps) {
  const [notes, setNotes] = useState('')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif", maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nueva Cita</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={4} />
        </div>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Resumen de la cita</div>

        {/* Card resumen */}
        <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '0 16px' }}>

          {/* Cliente (destacado arriba) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 0', borderBottom: '1px solid #F0F0F0',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: client.avatar ? 'transparent' : '#FF6B1A',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {client.avatar
                ? <img src={client.avatar} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 14 }}>{getInitials(client.name)}</span>
              }
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>{client.name}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{client.phone}</div>
            </div>
          </div>

          <SummaryRow icon="✂️" label="Servicio" value={`${service.name}    ${service.duration} min`} />
          <SummaryRow icon="📅" label="Fecha"    value={date} />
          <SummaryRow icon="🕐" label="Hora"     value={time} />
          <SummaryRow icon="👤" label="Barbero"  value={barber} />

          {/* Total */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 0',
          }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>💰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 2 }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0D0D0D' }}>${service.price}</div>
            </div>
          </div>
        </div>

        {/* Notas opcionales */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D', marginBottom: 10 }}>
            Notas (opcional)
          </div>
          <textarea
            placeholder="Agregar notas para esta cita..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '14px',
              background: '#F5F5F5',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              color: '#0D0D0D',
              outline: 'none',
              resize: 'none',
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: 'border-box',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      {/* Botón Confirmar */}
      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => !loading && onConfirm(notes)}
          disabled={loading}
          style={{
            width: '100%', height: 52,
            background: loading ? '#E5E5E5' : '#FF6B1A',
            color: loading ? '#999' : '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading ? 'Guardando...' : '✓ Confirmar Cita'}
        </button>
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────
export const DEMO_STEP4: Step4ConfirmarProps = {
  service: { name: 'Corte clásico', price: 200, duration: 30 },
  client:  { name: 'Carlos Mendoza', phone: '555 123 4567' },
  date:    'Miércoles, 15 de Mayo 2024',
  time:    '10:00 AM',
  barber:  'Alex The Barber',
  onConfirm: (notes) => console.log('Confirmed', notes),
}
