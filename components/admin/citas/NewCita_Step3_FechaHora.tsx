// AMADOBOOK — NewCita_Step3_FechaHora.tsx
// Paso 3: Seleccionar fecha (strip) y hora (grid de slots)
// Leyenda: disponible / seleccionado / no disponible

'use client'

import { useState } from 'react'

export interface TimeSlot {
  time: string        // "08:00 AM"
  available: boolean
}

export interface DateOption {
  dayShort: string    // "Mié"
  dayNum: number      // 15
  dateISO: string     // "2024-05-15"
}

export interface Step3FechaHoraProps {
  dates: DateOption[]
  slots: TimeSlot[]
  serviceDuration?: number   // minutos, para mostrar en etiqueta
  onNext: (date: string, time: string) => void
  onBack?: () => void
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

export default function NewCita_Step3_FechaHora({
  dates, slots, serviceDuration = 30, onNext, onBack,
}: Step3FechaHoraProps) {
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]?.dateISO ?? '')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const canContinue = !!selectedDate && !!selectedTime

  // Agrupar slots de 3 en 3 para el grid
  const slotRows: TimeSlot[][] = []
  for (let i = 0; i < slots.length; i += 3) {
    slotRows.push(slots.slice(i, i + 3))
  }

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
          <StepIndicator current={3} />
        </div>
      </div>

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>

        {/* Selecciona fecha */}
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 14 }}>
          Selecciona fecha
        </div>

        {/* Strip de fechas */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 28,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 4,
        }}>
          {dates.map(d => {
            const isActive = d.dateISO === selectedDate
            return (
              <button
                key={d.dateISO}
                onClick={() => { setSelectedDate(d.dateISO); setSelectedTime(null) }}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: isActive ? 'none' : '1px solid #E5E5E5',
                  background: isActive ? '#0D0D0D' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? '#888' : '#999' }}>{d.dayShort}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? '#FFF' : '#0D0D0D' }}>{d.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selecciona hora */}
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>
          Selecciona hora
        </div>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 14 }}>
          Duración del servicio: {serviceDuration} min
        </div>

        {/* Grid de slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slotRows.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {row.map((slot, si) => {
                const isSelected = selectedTime === slot.time
                const isUnavailable = !slot.available

                let bg = '#F5F5F5'
                let color = '#0D0D0D'
                let border = 'none'

                if (isSelected) { bg = '#FF6B1A'; color = '#FFF'; border = 'none' }
                else if (isUnavailable) { bg = '#FAFAFA'; color = '#CCC'; border = 'none' }

                return (
                  <button
                    key={si}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    style={{
                      height: 48,
                      background: bg,
                      color,
                      border,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      transition: 'all 200ms',
                      textDecoration: isUnavailable ? 'line-through' : 'none',
                    }}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div style={{
          display: 'flex', gap: 16, marginTop: 20, justifyContent: 'center',
        }}>
          {[
            { color: '#F5F5F5', textColor: '#0D0D0D', label: 'Disponible' },
            { color: '#FF6B1A', textColor: '#FFF',    label: 'Seleccionado' },
            { color: '#FAFAFA', textColor: '#CCC',    label: 'No disponible' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 20, height: 14, borderRadius: 4,
                background: item.color,
                border: item.color === '#FAFAFA' ? '1px solid #EFEFEF' : 'none',
              }} />
              <span style={{ fontSize: 11, color: '#666' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Siguiente */}
      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => canContinue && onNext(selectedDate, selectedTime!)}
          disabled={!canContinue}
          style={{
            width: '100%', height: 52,
            background: canContinue ? '#0D0D0D' : '#E5E5E5',
            color: canContinue ? '#FFF' : '#999',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: canContinue ? 'pointer' : 'not-allowed', transition: 'background 200ms',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_DATES: DateOption[] = [
  { dayShort: 'Mar', dayNum: 14, dateISO: '2024-05-14' },
  { dayShort: 'Mié', dayNum: 15, dateISO: '2024-05-15' },
  { dayShort: 'Jue', dayNum: 16, dateISO: '2024-05-16' },
  { dayShort: 'Vie', dayNum: 17, dateISO: '2024-05-17' },
  { dayShort: 'Sáb', dayNum: 18, dateISO: '2024-05-18' },
]

export const DEMO_SLOTS: TimeSlot[] = [
  { time: '08:00 AM', available: true  },
  { time: '08:30 AM', available: true  },
  { time: '09:00 AM', available: false },
  { time: '09:30 AM', available: false },
  { time: '10:00 AM', available: true  },
  { time: '10:30 AM', available: true  },
  { time: '11:00 AM', available: true  },
  { time: '11:30 AM', available: false },
  { time: '12:00 PM', available: true  },
  { time: '12:30 PM', available: true  },
  { time: '01:00 PM', available: true  },
  { time: '01:30 PM', available: true  },
  { time: '02:00 PM', available: false },
  { time: '02:30 PM', available: true  },
  { time: '03:00 PM', available: true  },
]
