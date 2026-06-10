// AMADOBOOK — NuevaCitaDesdeCliente.tsx
// Stepper de nueva cita iniciado desde el perfil de un cliente
// El cliente ya está pre-seleccionado — salta el paso 2 directamente
// Ruta: /admin/clientes/[id]/nueva-cita

'use client'

import { useState } from 'react'

export interface Servicio {
  id: string
  name: string
  duration: number
  price: number
  icon?: string
}

export interface DateOption {
  dayShort: string
  dayNum: number
  dateISO: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface NuevaCitaDesdClienteProps {
  // Cliente pre-cargado
  clientId: string
  clientName: string
  clientPhone: string
  clientAvatar?: string
  // Catálogo
  services: Servicio[]
  dates: DateOption[]
  slots: TimeSlot[]
  barber?: string
  // Callbacks
  onConfirm: (data: {
    serviceId: string
    date: string
    time: string
    notes: string
  }) => void
  onBack?: () => void
  loading?: boolean
}

type Step = 1 | 2 | 3

function StepIndicator({ current }: { current: Step }) {
  const steps = ['Servicio', 'Fecha y Hora', 'Confirmar']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((label, i) => {
        const n = (i + 1) as Step, done = n < current, active = n === current
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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function NuevaCitaDesdeCliente({
  clientId, clientName, clientPhone, clientAvatar,
  services, dates, slots,
  barber = 'Alex The Barber',
  onConfirm, onBack, loading = false,
}: NuevaCitaDesdClienteProps) {
  const [step,            setStep]           = useState<Step>(1)
  const [selectedService, setSelectedService]= useState<string | null>(null)
  const [selectedDate,    setSelectedDate]   = useState<string>(dates[0]?.dateISO ?? '')
  const [selectedTime,    setSelectedTime]   = useState<string | null>(null)
  const [notes,           setNotes]          = useState('')

  const service = services.find(s => s.id === selectedService)
  const dateObj = dates.find(d => d.dateISO === selectedDate)
  const dateLabel = dateObj ? `${dateObj.dayShort} ${dateObj.dayNum} de Mayo 2024` : ''

  // Agrupar slots de 3 en 3
  const slotRows: TimeSlot[][] = []
  for (let i = 0; i < slots.length; i += 3) slotRows.push(slots.slice(i, i + 3))

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button
            onClick={() => step > 1 ? setStep((step - 1) as Step) : onBack?.()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}
          >←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nueva Cita</div>
          <div style={{ width: 22 }} />
        </div>

        {/* Cliente pre-seleccionado (banner fijo) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', background: '#F9F9F9',
          borderTop: '1px solid #F0F0F0',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: clientAvatar ? 'transparent' : '#FF6B1A',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {clientAvatar
              ? <img src={clientAvatar} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 13 }}>{getInitials(clientName)}</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{clientName}</div>
            <div style={{ fontSize: 11, color: '#999' }}>{clientPhone}</div>
          </div>
          <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, background: '#F0FDF4', padding: '3px 10px', borderRadius: 999 }}>
            ✓ Seleccionado
          </span>
        </div>

        <div style={{ paddingTop: 14, paddingBottom: 20 }}>
          <StepIndicator current={step} />
        </div>
      </div>

      {/* ── Paso 1: Servicio ── */}
      {step === 1 && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>Selecciona un servicio</div>
            {services.map(srv => {
              const isSel = selectedService === srv.id
              return (
                <button
                  key={srv.id}
                  onClick={() => setSelectedService(srv.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 0', background: 'none', border: 'none',
                    borderBottom: '1px solid #F5F5F5', cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isSel ? '#FF6B1A' : '#F5F5F5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>
                    {srv.icon ?? '✂️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0D0D0D' }}>{srv.name}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{srv.duration} min</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginRight: 8 }}>${srv.price}</div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: isSel ? 'none' : '2px solid #E5E5E5',
                    background: isSel ? '#FF6B1A' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFF' }} />}
                  </div>
                </button>
              )
            })}
          </div>
          <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => selectedService && setStep(2)}
              disabled={!selectedService}
              style={{
                width: '100%', height: 52,
                background: selectedService ? '#0D0D0D' : '#E5E5E5',
                color: selectedService ? '#FFF' : '#999',
                border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
                cursor: selectedService ? 'pointer' : 'not-allowed',
              }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* ── Paso 2: Fecha y Hora ── */}
      {step === 2 && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 14 }}>Selecciona fecha</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {dates.map(d => {
                const isA = d.dateISO === selectedDate
                return (
                  <button key={d.dateISO} onClick={() => { setSelectedDate(d.dateISO); setSelectedTime(null) }} style={{
                    flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 14px', borderRadius: 12,
                    border: isA ? 'none' : '1px solid #E5E5E5',
                    background: isA ? '#0D0D0D' : 'transparent', cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: isA ? '#888' : '#999' }}>{d.dayShort}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: isA ? '#FFF' : '#0D0D0D' }}>{d.dayNum}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>Selecciona hora</div>
            {service && <div style={{ fontSize: 12, color: '#999', marginBottom: 14 }}>Duración: {service.duration} min</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {slotRows.map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {row.map((slot, si) => {
                    const isSel = selectedTime === slot.time
                    return (
                      <button key={si} onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        style={{
                          height: 48, borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600,
                          background: isSel ? '#FF6B1A' : slot.available ? '#F5F5F5' : '#FAFAFA',
                          color: isSel ? '#FFF' : slot.available ? '#0D0D0D' : '#CCC',
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          textDecoration: !slot.available ? 'line-through' : 'none',
                        }}
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => selectedDate && selectedTime && setStep(3)}
              disabled={!selectedDate || !selectedTime}
              style={{
                width: '100%', height: 52,
                background: selectedDate && selectedTime ? '#0D0D0D' : '#E5E5E5',
                color: selectedDate && selectedTime ? '#FFF' : '#999',
                border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
                cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
              }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* ── Paso 3: Confirmar ── */}
      {step === 3 && service && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Resumen de la cita</div>

            <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '0 16px' }}>
              {[
                { icon: '✂️', label: 'Servicio', value: `${service.name}  ·  ${service.duration} min` },
                { icon: '📅', label: 'Fecha',    value: dateLabel },
                { icon: '🕐', label: 'Hora',     value: selectedTime! },
                { icon: '👤', label: 'Barbero',  value: barber },
                { icon: '💰', label: 'Total',    value: `$${service.price}` },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 0',
                  borderBottom: i < 4 ? '1px solid #F0F0F0' : 'none',
                }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: 14, fontWeight: i === 4 ? 800 : 600, color: '#0D0D0D' }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', marginBottom: 8 }}>Notas (opcional)</div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Agregar notas para esta cita..."
                rows={3}
                style={{
                  width: '100%', padding: '14px', background: '#F5F5F5',
                  border: 'none', borderRadius: 12, fontSize: 14, color: '#0D0D0D',
                  outline: 'none', resize: 'none', fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.6, boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => !loading && selectedService && selectedDate && selectedTime &&
                onConfirm({ serviceId: selectedService, date: selectedDate, time: selectedTime, notes })
              }
              disabled={loading}
              style={{
                width: '100%', height: 52,
                background: loading ? '#E5E5E5' : '#FF6B1A',
                color: loading ? '#999' : '#FFF',
                border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Guardando...' : '✓ Confirmar Cita'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
