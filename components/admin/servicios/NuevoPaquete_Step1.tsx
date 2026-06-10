// AMADOBOOK — NuevoPaquete_Step1.tsx
// Paso 1: Seleccionar servicios que incluirá el paquete

'use client'

import { useState } from 'react'

export interface ServicioItem {
  id: string
  name: string
  duration: number
  price: number
  icon?: string
}

export interface NuevoPaqueteStep1Props {
  services: ServicioItem[]
  onNext: (selectedIds: string[]) => void
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

export default function NuevoPaquete_Step1({ services, onNext, onBack }: NuevoPaqueteStep1Props) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const totalPrice = services
    .filter(s => selected.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0)

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
        <div style={{ paddingBottom: 20 }}><StepIndicator current={1} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Selecciona los servicios que incluirás
        </div>
        {services.map(srv => {
          const isSel = selected.includes(srv.id)
          return (
            <button
              key={srv.id}
              onClick={() => toggle(srv.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0', background: 'none', border: 'none',
                borderBottom: '1px solid #F5F5F5', cursor: 'pointer',
                textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: isSel ? '#FF6B1A' : '#F5F5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0, transition: 'background 200ms',
              }}>
                {srv.icon ?? '✂️'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{srv.name}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{srv.duration} min</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginRight: 8 }}>${srv.price}</div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: isSel ? 'none' : '2px solid #E5E5E5',
                background: isSel ? '#FF6B1A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isSel && <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ padding: '12px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: '#999' }}>Total seleccionado: {selected.length} servicios</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D' }}>${totalPrice}</span>
        </div>
        <button
          onClick={() => selected.length > 0 && onNext(selected)}
          disabled={selected.length === 0}
          style={{
            width: '100%', height: 52,
            background: selected.length > 0 ? '#0D0D0D' : '#E5E5E5',
            color: selected.length > 0 ? '#FFF' : '#999',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
