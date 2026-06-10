// AMADOBOOK — NuevoPaquete_Step4.tsx
// Paso 4: Crear oferta opcional para el paquete

'use client'

import { useState } from 'react'

export interface OfertaOpcionalData {
  enabled: boolean
  discountType: 'percentage' | 'fixed'
  discountValue: number
  daysOfWeek: number[]    // 0=Dom, 1=Lun...6=Sab
  startDate: string
  endDate: string
  allDay: boolean
}

export interface NuevoPaqueteStep4Props {
  onNext: (oferta: OfertaOpcionalData) => void
  onBack?: () => void
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0 }}>
      {[1,2,3,4,5].map((n, i) => {
        const done = n < current, active = n === current
        return (
          <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: done || active ? '#0D0D0D' : '#E5E5E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none', zIndex: 1,
            }}>
              {done
                ? <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>
                : <span style={{ color: active ? '#FFF' : '#999', fontSize: 12, fontWeight: 700 }}>{n}</span>
              }
            </div>
            {n < 5 && <div style={{ flex: 1, height: 2, background: done ? '#0D0D0D' : '#E5E5E5' }} />}
          </div>
        )
      })}
    </div>
  )
}

const DAY_LABELS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

export default function NuevoPaquete_Step4({ onNext, onBack }: NuevoPaqueteStep4Props) {
  const [enabled,       setEnabled]       = useState(false)
  const [discountType,  setDiscountType]  = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [daysOfWeek,    setDaysOfWeek]    = useState<number[]>([1,2,3,4,5])
  const [startDate,     setStartDate]     = useState('')
  const [endDate,       setEndDate]       = useState('')
  const [allDay,        setAllDay]        = useState(true)

  const toggleDay = (d: number) =>
    setDaysOfWeek(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px',
    background: '#F5F5F5', border: 'none', borderRadius: 12,
    fontSize: 14, color: '#0D0D0D', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nuevo paquete</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}><StepIndicator current={4} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Toggle crear oferta */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 0',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Crear oferta (opcional)</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
              Activa un descuento automático para este paquete
            </div>
          </div>
          <button
            onClick={() => setEnabled(v => !v)}
            style={{
              width: 52, height: 28, borderRadius: 999,
              background: enabled ? '#FF6B1A' : '#E5E5E5',
              border: 'none', cursor: 'pointer',
              position: 'relative', transition: 'background 250ms', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: enabled ? 26 : 3,
              width: 22, height: 22, borderRadius: '50%', background: '#FFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 250ms',
            }} />
          </button>
        </div>

        {enabled && (
          <>
            {/* Tipo de descuento */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Tipo de descuento</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { key: 'percentage' as const, label: 'Porcentaje' },
                  { key: 'fixed'      as const, label: 'Monto fijo' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setDiscountType(opt.key)}
                    style={{
                      flex: 1, height: 44, borderRadius: 12,
                      border: discountType === opt.key ? 'none' : '1px solid #E5E5E5',
                      background: discountType === opt.key ? '#0D0D0D' : 'transparent',
                      color: discountType === opt.key ? '#FFF' : '#666',
                      fontSize: 14, fontWeight: discountType === opt.key ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Valor del descuento */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>Descuento</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  value={discountValue || ''}
                  onChange={e => setDiscountValue(Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  style={{ ...inputStyle, width: '70%' }}
                />
                <div style={{
                  height: 48, padding: '0 14px', background: '#F5F5F5', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: '#666',
                }}>
                  {discountType === 'percentage' ? '%' : '$'}
                </div>
              </div>
            </div>

            {/* Días de la semana */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Días de la semana</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {DAY_LABELS.map((label, idx) => {
                  const isOn = daysOfWeek.includes(idx)
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDay(idx)}
                      style={{
                        flex: 1, height: 40, borderRadius: 10,
                        border: 'none',
                        background: isOn ? '#FF6B1A' : '#F5F5F5',
                        color: isOn ? '#FFF' : '#999',
                        fontSize: 12, fontWeight: isOn ? 700 : 400,
                        cursor: 'pointer', transition: 'all 200ms',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fechas */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Fecha inicio</div>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Fecha fin</div>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Horario */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Horario (opcional)</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { val: true,  label: 'Todo el día'     },
                  { val: false, label: 'Horario específico' },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setAllDay(opt.val)}
                    style={{
                      flex: 1, height: 44, borderRadius: 12,
                      border: allDay === opt.val ? 'none' : '1px solid #E5E5E5',
                      background: allDay === opt.val ? '#0D0D0D' : 'transparent',
                      color: allDay === opt.val ? '#FFF' : '#666',
                      fontSize: 13, fontWeight: allDay === opt.val ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nota informativa */}
            <div style={{
              background: '#F0FDF4', borderRadius: 12, padding: 14,
              display: 'flex', gap: 10, border: '1px solid #BBF7D0',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <span style={{ fontSize: 12, color: '#14532D', lineHeight: 1.5 }}>
                La oferta estará activa los días seleccionados durante el período establecido.
              </span>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button
          onClick={() => onNext({ enabled, discountType, discountValue, daysOfWeek, startDate, endDate, allDay })}
          style={{
            width: '100%', height: 52, background: '#0D0D0D', color: '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
