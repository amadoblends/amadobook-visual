// AMADOBOOK — EditarCliente.tsx
// Formulario de edición de cliente pre-poblado con sus datos actuales
// Ruta: /admin/clientes/[id]/editar

'use client'

import { useState } from 'react'

export interface EditarClienteProps {
  id: string
  initialData: {
    name: string
    phone: string
    email?: string
    birthDate?: string      // "YYYY-MM-DD"
    avatar?: string
    status: 'active' | 'inactive'
    notes?: string
  }
  onSave: (data: {
    name: string
    phone: string
    email: string
    birthDate: string
    status: 'active' | 'inactive'
    notes: string
    avatarFile?: File
  }) => void
  onDelete?: (id: string) => void
  onBack?: () => void
  loading?: boolean
}

export default function EditarCliente({
  id, initialData, onSave, onDelete, onBack, loading = false,
}: EditarClienteProps) {
  const [name,      setName]      = useState(initialData.name)
  const [phone,     setPhone]     = useState(initialData.phone)
  const [email,     setEmail]     = useState(initialData.email ?? '')
  const [birthDate, setBirthDate] = useState(initialData.birthDate ?? '')
  const [status,    setStatus]    = useState<'active' | 'inactive'>(initialData.status)
  const [notes,     setNotes]     = useState(initialData.notes ?? '')
  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData.avatar)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) return
    onSave({ name, phone, email, birthDate, status, notes, avatarFile })
  }

  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48,
    padding: '0 14px',
    background: '#F5F5F5',
    border: '1.5px solid transparent',
    borderRadius: 12, fontSize: 14, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 200ms',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#666',
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Editar Cliente</div>
          {/* Botón eliminar */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#DC2626', padding: 0 }}
          >
            🗑
          </button>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: avatarPreview ? 'transparent' : '#FF6B1A',
              overflow: 'hidden', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 28 }}>{getInitials(name || 'NA')}</span>
              }
              {/* Overlay de cámara */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                📷
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#999' }}>Toca la foto para cambiar</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </label>
        </div>

        {/* Campos */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label style={labelStyle}>Nombre completo *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Carlos Mendoza"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Teléfono *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="555 123 4567"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Fecha de nacimiento</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Estado</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Notas (privadas)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Prefiere degradado bajo. Usa producto para barba."
              rows={3}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '12px 14px',
                resize: 'none',
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* Confirm eliminar */}
        {showDeleteConfirm && (
          <div style={{
            background: '#FEF2F2', borderRadius: 16, padding: 20,
            border: '1px solid #FECACA',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>
              ¿Eliminar este cliente?
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
              Esta acción no se puede deshacer. Se eliminarán todos los datos del cliente.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1, height: 44, background: '#FFF',
                  border: '1px solid #E5E5E5', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#0D0D0D',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => { onDelete?.(id); setShowDeleteConfirm(false) }}
                style={{
                  flex: 1, height: 44, background: '#DC2626',
                  border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#FFF',
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* ── Botón guardar ── */}
      <div style={{
        padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #F0F0F0', background: '#FFF',
      }}>
        <button
          onClick={handleSave}
          disabled={loading || !name.trim() || !phone.trim()}
          style={{
            width: '100%', height: 52,
            background: loading || !name.trim() || !phone.trim() ? '#E5E5E5' : '#0D0D0D',
            color: loading || !name.trim() || !phone.trim() ? '#999' : '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: loading || !name.trim() || !phone.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
