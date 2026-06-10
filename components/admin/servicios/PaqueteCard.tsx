// AMADOBOOK — PaqueteCard.tsx
// Tarjeta individual de paquete con imagen, precio, descuento y toggle activo/inactivo

'use client'

export interface PaqueteCardProps {
  id: string
  name: string
  servicesIncluded: string[]    // ["Corte clásico", "Barba"]
  regularPrice: number
  discountPrice?: number
  discountPct?: number          // 10, 20, etc.
  imageUrl?: string
  isActive: boolean
  onEdit?: (id: string) => void
  onToggleActive?: (id: string, active: boolean) => void
  onDelete?: (id: string) => void
}

export default function PaqueteCard({
  id, name, servicesIncluded, regularPrice, discountPrice, discountPct,
  imageUrl, isActive, onEdit, onToggleActive, onDelete,
}: PaqueteCardProps) {
  const hasDiscount = discountPrice !== undefined && discountPrice < regularPrice

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
    }}>
      {/* Imagen */}
      <div style={{
        width: 60, height: 60, borderRadius: 12,
        background: imageUrl ? 'transparent' : '#F5F5F5',
        overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
      }}>
        {imageUrl
          ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '📦'
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#0D0D0D',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 12, color: '#999', marginTop: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {servicesIncluded.join(' + ')}
        </div>
        {/* Precios */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
          {hasDiscount ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>
                ${discountPrice}
              </span>
              <span style={{ fontSize: 12, color: '#CCC', textDecoration: 'line-through' }}>
                ${regularPrice}
              </span>
              {discountPct && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#FF6B1A',
                  background: '#FFF3EC', padding: '2px 7px', borderRadius: 999,
                }}>
                  {discountPct}% OFF
                </span>
              )}
            </>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>
              ${regularPrice}
            </span>
          )}
        </div>
      </div>

      {/* Toggle activo */}
      <button
        onClick={() => onToggleActive?.(id, !isActive)}
        style={{
          width: 46, height: 26, borderRadius: 999,
          background: isActive ? '#22C55E' : '#E5E5E5',
          border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 250ms', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: isActive ? 22 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#FFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          transition: 'left 250ms',
        }} />
      </button>
    </div>
  )
}
