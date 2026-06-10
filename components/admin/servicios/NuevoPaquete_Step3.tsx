// AMADOBOOK — NuevoPaquete_Step3.tsx
// Paso 3: Precio regular y precio con descuento del paquete

'use client'

import { useState } from 'react'

export interface NuevoPaqueteStep3Props {
  basePrice: number          // Suma auto-calculada de los servicios
  onNext: (data: { regularPrice: number; discountPrice?: number }) => void
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

export default function NuevoPaquete_Step3({ basePrice, onNext, onBack }: NuevoPaqueteStep3Props) {
  const [regularPrice,  setRegularPrice]  = useState(basePrice)
  const [discountPrice, setDiscountPrice] = useState<string>('')

  const discountNum = discountPrice ? Number(discountPrice) : undefined
  const savings     = discountNum && discountNum < regularPrice ? regularPrice - discountNum : 0
  const savingsPct  = savings > 0 ? Math.round((savings / regularPrice) * 100) : 0

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 52, padding: '0 14px 0 28px',
    background: '#F5F5F5', border: 'none', borderRadius: 12,
    fontSize: 18, fontWeight: 700, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
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
        <div style={{ paddingBottom: 20 }}><StepIndicator current={3} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Precio del paquete</div>

        {/* Precio regular */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>Precio regular</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 700, color: '#666' }}>$</span>
            <input
              type="number"
              value={regularPrice}
              onChange={e => setRegularPrice(Number(e.target.value))}
              min={0}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Precio con descuento */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>
            Precio con descuento (opcional)
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 700, color: '#666' }}>$</span>
            <input
              type="number"
              value={discountPrice}
              onChange={e => setDiscountPrice(e.target.value)}
              placeholder={String(Math.round(regularPrice * 0.85))}
              min={0}
              max={regularPrice}
              style={{ ...inputStyle, color: discountPrice ? '#FF6B1A' : '#999' }}
            />
          </div>
        </div>

        {/* Preview del ahorro */}
        {savings > 0 && (
          <div style={{
            background: '#FFF3EC', borderRadius: 14, padding: 16,
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid #FFD4B8',
          }}>
            <span style={{ fontSize: 24 }}>🏷️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FF6B1A' }}>
                Ahorro para el cliente: ${savings} ({savingsPct}% OFF)
              </div>
              <div style={{ fontSize: 12, color: '#C4500E', marginTop: 3, lineHeight: 1.4 }}>
                Los clientes verán el precio con descuento cuando la oferta esté activa.
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div style={{
          background: '#F5F5F5', borderRadius: 12, padding: 14,
          display: 'flex', gap: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <span style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            El precio con descuento es opcional. Puedes añadir una oferta en el siguiente paso para activarlo automáticamente.
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button
          onClick={() => onNext({ regularPrice, discountPrice: discountNum })}
          disabled={regularPrice <= 0}
          style={{
            width: '100%', height: 52,
            background: regularPrice > 0 ? '#0D0D0D' : '#E5E5E5',
            color: regularPrice > 0 ? '#FFF' : '#999',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: regularPrice > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
