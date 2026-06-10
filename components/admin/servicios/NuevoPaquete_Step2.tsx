// AMADOBOOK — NuevoPaquete_Step2.tsx
// Paso 2: Detalles del nuevo paquete

'use client'

import React from 'react'

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


export interface NuevoPaqueteStep2Props {
  onNext: (data: {
    name: string
    description: string
    category: string
    isActive: boolean
    imageFiles: File[]
  }) => void
  onBack?: () => void
}

const CATEGORIES = ['Básico', 'Clásico', 'Premium', 'Deluxe', 'VIP']

export default function NuevoPaquete_Step2({ onNext, onBack }: NuevoPaqueteStep2Props) {
  const [name,        setName]        = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category,    setCategory]    = React.useState('')
  const [isActive,    setIsActive]    = React.useState(true)
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [imageFiles,    setImageFiles]    = React.useState<File[]>([])

  const canContinue = name.trim().length > 0

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles(prev => [...prev, ...files])
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (idx: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px',
    background: '#F5F5F5', border: 'none', borderRadius: 12,
    fontSize: 14, color: '#0D0D0D', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFF', fontFamily: "'DM Sans', sans-serif", maxWidth: 430, margin: '0 auto' }}>
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nuevo paquete</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}><StepIndicator current={2} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Detalles</div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Nombre del paquete *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Paquete Premium" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>
            Descripción (opcional) <span style={{ color: '#CCC', fontWeight: 400 }}>{description.length}/100</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, 100))}
            placeholder="El paquete completo para lucir tu mejor versión."
            rows={3}
            style={{ ...inputStyle, height: 'auto', padding: '12px 14px', resize: 'none', lineHeight: 1.6 }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10 }}>Imagen del paquete</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {imagePreviews.map((src, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <button onClick={() => removeImage(idx)} style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#DC2626', border: 'none', cursor: 'pointer',
                  color: '#FFF', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </div>
            ))}
            <label style={{
              width: 64, height: 64, borderRadius: 10,
              border: '2px dashed #E5E5E5', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              +
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImages} />
            </label>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10 }}>Categoría</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat === category ? '' : cat)} style={{
                padding: '8px 16px', borderRadius: 999,
                border: category === cat ? 'none' : '1px solid #E5E5E5',
                background: category === cat ? '#0D0D0D' : 'transparent',
                color: category === cat ? '#FFF' : '#666',
                fontSize: 13, cursor: 'pointer', transition: 'all 200ms',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #F5F5F5' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>Estado</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{isActive ? 'Activo' : 'Inactivo'}</div>
          </div>
          <button onClick={() => setIsActive(v => !v)} style={{
            width: 52, height: 28, borderRadius: 999,
            background: isActive ? '#22C55E' : '#E5E5E5',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 250ms',
          }}>
            <div style={{ position: 'absolute', top: 3, left: isActive ? 26 : 3, width: 22, height: 22, borderRadius: '50%', background: '#FFF', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 250ms' }} />
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button onClick={() => canContinue && onNext({ name, description, category, isActive, imageFiles })} disabled={!canContinue} style={{
          width: '100%', height: 52,
          background: canContinue ? '#0D0D0D' : '#E5E5E5',
          color: canContinue ? '#FFF' : '#999',
          border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
          cursor: canContinue ? 'pointer' : 'not-allowed',
        }}>Siguiente</button>
      </div>
    </div>
  )
}
