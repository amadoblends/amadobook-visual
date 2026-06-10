// AMADOBOOK — OfertaCard.tsx
// Tarjeta de una oferta con badge de descuento, estado y período

'use client'

export type OfertaStatus = 'active' | 'scheduled' | 'finished'

export interface OfertaCardProps {
  id: string
  name: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  appliesTo: string          // "Paquete Premium · Paquete Deluxe"
  period: string             // "20 May – 20 Jun"
  daysLabel: string          // "Lun – Vie"
  status: OfertaStatus
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const STATUS_CONFIG: Record<OfertaStatus, { label: string; bg: string; text: string }> = {
  active:    { label: 'Activa',     bg: '#F0FDF4', text: '#16A34A' },
  scheduled: { label: 'Programada', bg: '#EFF6FF', text: '#2563EB' },
  finished:  { label: 'Finalizada', bg: '#F9FAFB', text: '#6B7280' },
}

export default function OfertaCard({
  id, name, discountType, discountValue, appliesTo,
  period, daysLabel, status, onEdit, onDelete,
}: OfertaCardProps) {
  const cfg         = STATUS_CONFIG[status]
  const badgeLabel  = discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`

  return (
    <div style={{
      background: '#FFF',
      borderRadius: 14,
      padding: '14px 16px',
      border: '1px solid #F0F0F0',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      {/* Badge de descuento */}
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: status === 'finished' ? '#F5F5F5' : '#FFF3EC',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        border: status === 'finished' ? '1px solid #E5E5E5' : '1px solid #FFD4B8',
      }}>
        <div style={{
          fontSize: 14, fontWeight: 800,
          color: status === 'finished' ? '#999' : '#FF6B1A',
          lineHeight: 1,
        }}>
          {badgeLabel}
        </div>
        <div style={{
          fontSize: 10, color: status === 'finished' ? '#CCC' : '#FF6B1A',
          fontWeight: 500, marginTop: 2,
        }}>
          {discountType === 'percentage' ? 'OFF' : 'desc.'}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#0D0D0D',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 6, lineHeight: 1.4 }}>
          {appliesTo}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status badge */}
          <span style={{
            background: cfg.bg, color: cfg.text,
            fontSize: 11, fontWeight: 600,
            padding: '3px 10px', borderRadius: 999,
          }}>
            {cfg.label}
          </span>
          {/* Período */}
          <span style={{ fontSize: 11, color: '#999' }}>{period}</span>
          {/* Días */}
          <span style={{ fontSize: 11, color: '#999' }}>{daysLabel}</span>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onEdit?.(id)}
          style={{
            background: '#F5F5F5', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete?.(id)}
          style={{
            background: '#FEF2F2', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}
        >
          🗑
        </button>
      </div>
    </div>
  )
}
