// AMADOBOOK — ClienteCard.tsx
// Tarjeta individual de cliente en la lista
// Muestra: avatar, nombre, teléfono, total de citas y menú de opciones

'use client'

import { useState } from 'react'

export interface ClienteCardProps {
  id: string
  name: string
  phone: string
  avatar?: string
  appointmentCount: number
  status: 'active' | 'inactive'
  onView?: (id: string) => void
  onNewCita?: (id: string) => void
  onHistorial?: (id: string) => void
  onEdit?: (id: string) => void
  onCall?: (phone: string) => void
  onMessage?: (phone: string) => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ClienteCard({
  id, name, phone, avatar, appointmentCount, status,
  onView, onNewCita, onHistorial, onEdit, onCall, onMessage,
}: ClienteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: '1px solid #F0F0F0',
      position: 'relative',
    }}>
      {/* Avatar */}
      <button
        onClick={() => onView?.(id)}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: avatar ? 'transparent' : '#FF6B1A',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 16 }}>
            {getInitials(name)}
          </span>
        )}
      </button>

      {/* Info */}
      <button
        onClick={() => onView?.(id)}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
        }}
      >
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#0D0D0D',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{phone}</div>
      </button>

      {/* Citas count */}
      <div style={{
        fontSize: 12,
        color: '#666',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {appointmentCount} cita{appointmentCount !== 1 ? 's' : ''}
      </div>

      {/* Menú */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 2px', color: '#999', fontSize: 18, lineHeight: 1, flexShrink: 0,
        }}
        aria-label="Opciones"
      >
        ⋯
      </button>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4,
            background: '#FFF', borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '1px solid #F0F0F0',
            zIndex: 20, minWidth: 180, overflow: 'hidden',
          }}>
            {[
              { label: '👁 Ver perfil',    action: () => { onView?.(id); setMenuOpen(false) } },
              { label: '📅 Nueva cita',    action: () => { onNewCita?.(id); setMenuOpen(false) } },
              { label: '📋 Historial',     action: () => { onHistorial?.(id); setMenuOpen(false) } },
              { label: '✏️ Editar',        action: () => { onEdit?.(id); setMenuOpen(false) } },
              { label: '📞 Llamar',        action: () => { onCall?.(phone); setMenuOpen(false) } },
              { label: '💬 Mensaje',       action: () => { onMessage?.(phone); setMenuOpen(false) } },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                style={{
                  display: 'block', width: '100%', padding: '12px 16px',
                  background: 'none', border: 'none', textAlign: 'left',
                  fontSize: 14, cursor: 'pointer', color: '#0D0D0D',
                  borderBottom: '1px solid #F5F5F5',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
