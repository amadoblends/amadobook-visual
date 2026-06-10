// AMADOBOOK — NuevaOferta_Step2.tsx
// Paso 2: Días de la semana y horario de la oferta

'use client'

import { useState } from 'react'

export interface NuevaOfertaStep2Props {
  onNext: (data: {
    daysOfWeek: number[]
    allDay: boolean
    startTime?: string
    endTime?: string
  }) => void
  onBack?: () => void
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0 }}>
      {[1,2,3].map((n, i) => {
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
            {n < 3 && <div style={{ flex: 1, height: 2, background: done ? '#0D0D0D' : '#E5E5E5' }} />}
          </div>
        )
      })}
    </div>
  )
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function NuevaOferta_Step2({ onNext, onBack }: NuevaOfertaStep2Props) {
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1,2,3,4,5])
  const [allDay,     setAllDay]     = useState(true)
  const [startTime,  setStartTime]  = useState('08:00')
  const [endTime,    setEndTime]    = useState('20:00')

  const toggleDay = (d: number) =>
    setDaysOfWeek(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const canContinue = daysOfWeek.length > 0

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
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nueva oferta</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}><StepIndicator current={2} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Días de la semana */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 4 }}>Días de la semana</div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 14 }}>Selecciona los días en que aplicará la oferta</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DAY_LABELS.map((label, idx) => {
              const isOn = daysOfWeek.includes(idx)
              return (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  style={{
                    flex: 1, height: 44, borderRadius: 10,
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
          {daysOfWeek.length === 0 && (
            <div style={{ fontSize: 12, color: '#EF4444', marginTop: 8 }}>
              Selecciona al menos un día
            </div>
          )}
        </div>

        {/* Horario */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 14 }}>Horario</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {[
              { val: true,  label: 'Todo el día'       },
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
                  fontSize: 13, fontWeight: allDay === opt.val ? 600 : 400, cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!allDay && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Hora inicio</div>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Hora fin</div>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}
        </div>

        {/* Nota */}
        <div style={{
          background: '#F0FDF4', borderRadius: 12, padding: 14,
          display: 'flex', gap: 10, border: '1px solid #BBF7D0',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <span style={{ fontSize: 13, color: '#14532D', lineHeight: 1.5 }}>
            La oferta estará activa los días seleccionados durante el período establecido.
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button
          onClick={() => canContinue && onNext({ daysOfWeek, allDay, startTime: allDay ? undefined : startTime, endTime: allDay ? undefined : endTime })}
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
