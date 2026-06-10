// AMADOBOOK — CitaCard.tsx
// Tarjeta individual de cita en la lista diaria del admin
// Muestra: hora, avatar, nombre, servicio, estado badge y menú de opciones

'use client'

import { useState } from 'react'

export type CitaStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface CitaCardProps {
  id: string
  time: string                 // "09:00 AM"
  clientName: string
  clientPhone: string
  clientAvatar?: string        // URL o undefined → iniciales
  service: string              // "Corte clásico"
  status: CitaStatus
  price?: number
  onView?: (id: string) => void
  onConfirm?: (id: string) => void
  onComplete?: (id: string) => void
  onReschedule?: (id: string) => void
  onCancel?: (id: string) => void
  onCall?: (phone: string) => void
}

const STATUS_CONFIG: Record<CitaStatus, { label: string; bg: string; text: string }> = {
  pending:   { label: 'Pendiente',   bg: '#FFFBEB', text: '#D97706' },
  confirmed: { label: 'Confirmada',  bg: '#F0FDF4', text: '#16A34A' },
  completed: { label: 'Completada',  bg: '#F9FAFB', text: '#6B7280' },
  cancelled: { label: 'Cancelada',   bg: '#FEF2F2', text: '#DC2626' },
  no_show:   { label: 'No asistió',  bg: '#F5F3FF', text: '#7C3AED' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CitaCard({
  id, time, clientName, clientPhone, clientAvatar,
  service, status, price,
  onView, onConfirm, onComplete, onReschedule, onCancel, onCall,
}: CitaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cfg = STATUS_CONFIG[status]

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #F0F0F0',
      position: 'relative',
    }}>
      {/* Hora */}
      <div style={{
        minWidth: 56,
        fontSize: 12,
        fontWeight: 600,
        color: '#0D0D0D',
        lineHeight: 1.3,
      }}>
        {time.replace(' ', '\n')}
      </div>

      {/* Avatar */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: clientAvatar ? 'transparent' : '#FF6B1A',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {clientAvatar ? (
          <img src={clientAvatar} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 14 }}>
            {getInitials(clientName)}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#0D0D0D',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {clientName}
        </div>
        <div style={{
          fontSize: 12,
          color: '#666',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {service}
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        background: cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {cfg.label}
      </div>

      {/* Menú opciones */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 2px',
          color: '#999',
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Opciones"
      >
        ⋯
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          {/* overlay para cerrar */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#FFF',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '1px solid #F0F0F0',
            zIndex: 20,
            minWidth: 180,
            overflow: 'hidden',
          }}>
            {[
              { label: '👁 Ver detalle',   show: true,                         action: () => { onView?.(id); setMenuOpen(false) } },
              { label: '✓ Confirmar',      show: status === 'pending',          action: () => { onConfirm?.(id); setMenuOpen(false) } },
              { label: '✓✓ Completar',    show: status === 'confirmed',        action: () => { onComplete?.(id); setMenuOpen(false) } },
              { label: '↺ Reagendar',      show: status !== 'completed',        action: () => { onReschedule?.(id); setMenuOpen(false) } },
              { label: '📞 Llamar',        show: true,                          action: () => { onCall?.(clientPhone); setMenuOpen(false) } },
              { label: '✕ Cancelar',       show: !['completed','cancelled'].includes(status), action: () => { onCancel?.(id); setMenuOpen(false) }, danger: true },
            ].filter(i => i.show).map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 14,
                  cursor: 'pointer',
                  color: item.danger ? '#DC2626' : '#0D0D0D',
                  fontWeight: 400,
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
