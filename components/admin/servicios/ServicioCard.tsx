// AMADOBOOK — ServicioCard.tsx
// Tarjeta individual de servicio en la lista
// Muestra: imagen/icono, nombre, duración, precio y menú de opciones

'use client'

import { useState } from 'react'

export interface ServicioCardProps {
  id: string
  name: string
  duration: number       // minutos
  price: number
  imageUrl?: string
  icon?: string          // emoji fallback
  isActive: boolean
  onEdit?: (id: string) => void
  onToggleActive?: (id: string, active: boolean) => void
  onDelete?: (id: string) => void
}

export default function ServicioCard({
  id, name, duration, price, imageUrl, icon = '✂️',
  isActive, onEdit, onToggleActive, onDelete,
}: ServicioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      background: '#FFF',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      border: '1px solid #F0F0F0',
      opacity: isActive ? 1 : 0.55,
      transition: 'opacity 200ms',
      position: 'relative',
    }}>
      {/* Imagen / ícono */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: imageUrl ? 'transparent' : '#F5F5F5',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}>
        {imageUrl
          ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : icon
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#0D0D0D',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
          {duration} min
        </div>
      </div>

      {/* Precio */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: '#0D0D0D', flexShrink: 0,
      }}>
        ${price}
      </div>

      {/* Menú */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 18, color: '#999', padding: '4px 2px',
          lineHeight: 1, flexShrink: 0,
        }}
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
              {
                label: '✏️ Editar',
                action: () => { onEdit?.(id); setMenuOpen(false) },
              },
              {
                label: isActive ? '⏸ Desactivar' : '▶ Activar',
                action: () => { onToggleActive?.(id, !isActive); setMenuOpen(false) },
              },
              {
                label: '🗑 Eliminar',
                danger: true,
                action: () => { onDelete?.(id); setMenuOpen(false) },
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                style={{
                  display: 'block', width: '100%',
                  padding: '12px 16px',
                  background: 'none', border: 'none',
                  textAlign: 'left', fontSize: 14,
                  cursor: 'pointer',
                  color: item.danger ? '#DC2626' : '#0D0D0D',
                  borderBottom: i < 2 ? '1px solid #F5F5F5' : 'none',
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
