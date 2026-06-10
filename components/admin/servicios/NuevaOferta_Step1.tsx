// AMADOBOOK — NuevaOferta_Step1.tsx
// Paso 1 de nueva oferta: info básica — nombre, aplica a, servicios/paquetes, tipo descuento, fechas

'use client'

import { useState } from 'react'

export interface ItemSeleccionable {
  id: string
  name: string
  price: number
}

export interface NuevaOfertaStep1Props {
  services: ItemSeleccionable[]
  packages: ItemSeleccionable[]
  onNext: (data: {
    name: string
    appliesTo: 'services' | 'packages' | 'all'
    selectedIds: string[]
    discountType: 'percentage' | 'fixed'
    discountValue: number
    startDate: string
    endDate: string
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

export default function NuevaOferta_Step1({ services, packages, onNext, onBack }: NuevaOfertaStep1Props) {
  const [name,          setName]          = useState('')
  const [appliesTo,     setAppliesTo]     = useState<'services' | 'packages' | 'all'>('packages')
  const [selectedIds,   setSelectedIds]   = useState<string[]>([])
  const [discountType,  setDiscountType]  = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [startDate,     setStartDate]     = useState('')
  const [endDate,       setEndDate]       = useState('')

  const items = appliesTo === 'services' ? services : appliesTo === 'packages' ? packages : []
  const toggleItem = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const canContinue = name.trim() && discountValue > 0 && startDate && endDate &&
    (appliesTo === 'all' || selectedIds.length > 0)

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
        <div style={{ paddingBottom: 20 }}><StepIndicator current={1} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Nombre de la oferta *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="15% OFF Paquete Premium" style={inputStyle} />
        </div>

        {/* Aplica a */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10 }}>Aplica a</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { key: 'services' as const, label: 'Servicios' },
              { key: 'packages' as const, label: 'Paquetes'  },
              { key: 'all'      as const, label: 'Todos'     },
            ]).map(opt => (
              <button
                key={opt.key}
                onClick={() => { setAppliesTo(opt.key); setSelectedIds([]) }}
                style={{
                  flex: 1, height: 44, borderRadius: 12,
                  border: appliesTo === opt.key ? 'none' : '1px solid #E5E5E5',
                  background: appliesTo === opt.key ? '#0D0D0D' : 'transparent',
                  color: appliesTo === opt.key ? '#FFF' : '#666',
                  fontSize: 13, fontWeight: appliesTo === opt.key ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de items seleccionables */}
        {appliesTo !== 'all' && items.length > 0 && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10 }}>
              Selecciona {appliesTo === 'services' ? 'servicios' : 'paquetes'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(item => {
                const isSel = selectedIds.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: isSel ? '#FFF3EC' : '#F5F5F5',
                      border: isSel ? '1.5px solid #FFD4B8' : '1.5px solid transparent',
                      borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>${item.price}</div>
                    </div>
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
          </div>
        )}

        {/* Tipo de descuento */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10 }}>Tipo de descuento</label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'percentage' as const, label: 'Porcentaje' },
              { key: 'fixed'      as const, label: 'Monto fijo' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setDiscountType(opt.key)} style={{
                flex: 1, height: 44, borderRadius: 12,
                border: discountType === opt.key ? 'none' : '1px solid #E5E5E5',
                background: discountType === opt.key ? '#0D0D0D' : 'transparent',
                color: discountType === opt.key ? '#FFF' : '#666',
                fontSize: 13, fontWeight: discountType === opt.key ? 600 : 400, cursor: 'pointer',
              }}>
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="number" value={discountValue || ''}
              onChange={e => setDiscountValue(Number(e.target.value))}
              placeholder="0" min={0}
              style={{ ...inputStyle, flex: 1 }}
            />
            <div style={{
              height: 48, padding: '0 16px', background: '#F5F5F5', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#666', flexShrink: 0,
            }}>
              {discountType === 'percentage' ? '%' : '$'}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Fecha inicio *</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Fecha fin *</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button
          onClick={() => canContinue && onNext({ name, appliesTo, selectedIds, discountType, discountValue, startDate, endDate })}
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
