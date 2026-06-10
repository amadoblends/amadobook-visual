// AMADOBOOK — NuevoServicioModal.tsx
// Bottom sheet / modal para crear o editar un servicio
// Campos: nombre, duración, precio, descripción, imagen, estado

'use client'

import { useState } from 'react'

export interface ServicioFormData {
  name: string
  duration: number
  price: number
  description: string
  isActive: boolean
  imageFile?: File
}

export interface NuevoServicioModalProps {
  mode: 'create' | 'edit'
  initialData?: Partial<ServicioFormData> & { imageUrl?: string }
  onSave: (data: ServicioFormData) => void
  onClose: () => void
  loading?: boolean
}

export default function NuevoServicioModal({
  mode, initialData, onSave, onClose, loading = false,
}: NuevoServicioModalProps) {
  const [name,        setName]        = useState(initialData?.name        ?? '')
  const [duration,    setDuration]    = useState(initialData?.duration    ?? 30)
  const [price,       setPrice]       = useState(initialData?.price       ?? 0)
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [isActive,    setIsActive]    = useState(initialData?.isActive    ?? true)
  const [imageFile,   setImageFile]   = useState<File | undefined>()
  const [imagePreview,setImagePreview]= useState<string | undefined>(initialData?.imageUrl)

  const canSave = name.trim().length > 0 && duration > 0 && price > 0

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px',
    background: '#F5F5F5', border: 'none',
    borderRadius: 12, fontSize: 14, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#666',
    display: 'block', marginBottom: 6,
  }

  const DURATION_OPTIONS = [15, 20, 30, 45, 60, 75, 90, 120]

  return (
    <div style={{
      background: '#FFF',
      borderRadius: '20px 20px 0 0',
      padding: '0 0 env(safe-area-inset-bottom, 16px)',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, width: '100%',
      maxHeight: '90dvh',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: '#E5E5E5' }} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '12px 20px 16px', flexShrink: 0,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>
          {mode === 'create' ? 'Nuevo servicio' : 'Editar servicio'}
        </div>
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#F5F5F5', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#666',
          }}
        >✕</button>
      </div>

      {/* Scroll content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Imagen */}
        <div>
          <label style={labelStyle}>Imagen del servicio</label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px', background: '#F5F5F5', borderRadius: 12,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12,
              background: imagePreview ? 'transparent' : '#E5E5E5',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '📷'
              }
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>
                {imagePreview ? 'Cambiar imagen' : 'Agregar imagen'}
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>JPG, PNG · Máx. 5MB</div>
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </label>
        </div>

        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre del servicio *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Corte clásico"
            style={inputStyle}
          />
        </div>

        {/* Duración */}
        <div>
          <label style={labelStyle}>Duración *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DURATION_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: duration === d ? 'none' : '1px solid #E5E5E5',
                  background: duration === d ? '#0D0D0D' : 'transparent',
                  color: duration === d ? '#FFF' : '#666',
                  fontSize: 13, fontWeight: duration === d ? 600 : 400,
                  cursor: 'pointer', transition: 'all 200ms',
                }}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          <label style={labelStyle}>Precio *</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', fontSize: 15,
              fontWeight: 600, color: '#666',
            }}>$</span>
            <input
              type="number"
              value={price || ''}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="0"
              min={0}
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label style={labelStyle}>Descripción (opcional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe brevemente el servicio..."
            rows={3}
            style={{
              width: '100%', padding: '12px 14px',
              background: '#F5F5F5', border: 'none',
              borderRadius: 12, fontSize: 14, color: '#0D0D0D',
              outline: 'none', resize: 'none',
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Estado */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          borderTop: '1px solid #F5F5F5',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>Estado</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
              {isActive ? 'Activo — visible para clientes' : 'Inactivo — oculto para clientes'}
            </div>
          </div>
          {/* Toggle */}
          <button
            onClick={() => setIsActive(v => !v)}
            style={{
              width: 52, height: 28, borderRadius: 999,
              background: isActive ? '#22C55E' : '#E5E5E5',
              border: 'none', cursor: 'pointer',
              position: 'relative', transition: 'background 250ms', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              top: 3, left: isActive ? 26 : 3,
              width: 22, height: 22, borderRadius: '50%',
              background: '#FFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              transition: 'left 250ms',
            }} />
          </button>
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* Botón guardar */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <button
          onClick={() => canSave && !loading && onSave({ name, duration, price, description, isActive, imageFile })}
          disabled={!canSave || loading}
          style={{
            width: '100%', height: 52,
            background: canSave && !loading ? '#0D0D0D' : '#E5E5E5',
            color: canSave && !loading ? '#FFF' : '#999',
            border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700,
            cursor: canSave && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear servicio' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
