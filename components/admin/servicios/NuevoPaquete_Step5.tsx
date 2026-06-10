// AMADOBOOK — NuevoPaquete_Step5.tsx
// Paso 5: Resumen completo del paquete y botón de confirmación

'use client'

export interface ServicioResumen {
  name: string
  duration: number
  price: number
}

export interface NuevoPaqueteStep5Props {
  packageName: string
  packageDescription?: string
  imagePreview?: string
  services: ServicioResumen[]
  regularPrice: number
  discountPrice?: number
  discountPct?: number
  offerActive: boolean
  offerDays?: string           // "Lun–Vie"
  offerPeriod?: string         // "20 May – 20 Jun"
  onConfirm: () => void
  onBack?: () => void
  loading?: boolean
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

export default function NuevoPaquete_Step5({
  packageName, packageDescription, imagePreview,
  services, regularPrice, discountPrice, discountPct,
  offerActive, offerDays, offerPeriod,
  onConfirm, onBack, loading = false,
}: NuevoPaqueteStep5Props) {
  const savings = discountPrice ? regularPrice - discountPrice : 0

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
        <div style={{ paddingBottom: 20 }}><StepIndicator current={5} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Resumen del paquete</div>

        {/* Card resumen */}
        <div style={{ background: '#F9F9F9', borderRadius: 16, overflow: 'hidden' }}>

          {/* Header con imagen y nombre */}
          <div style={{ display: 'flex', gap: 14, padding: '16px 16px 14px', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: imagePreview ? 'transparent' : '#F0F0F0',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>
              {imagePreview
                ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : '📦'
              }
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>{packageName}</div>
              {packageDescription && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 4, lineHeight: 1.5 }}>
                  {packageDescription}
                </div>
              )}
            </div>
          </div>

          {/* Servicios incluidos */}
          <div style={{ padding: '12px 16px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 10 }}>
              Servicios incluidos ({services.length})
            </div>
            {services.map((srv, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < services.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>✂️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0D0D0D' }}>{srv.name}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{srv.duration} min</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>${srv.price}</div>
              </div>
            ))}
          </div>

          {/* Precios */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid #F0F0F0', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Precio regular</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: discountPrice ? '#CCC' : '#0D0D0D', textDecoration: discountPrice ? 'line-through' : 'none' }}>
                ${regularPrice}
              </span>
            </div>
            {discountPrice && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#666' }}>
                    Descuento {discountPct ? `(${discountPct}%)` : ''}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FF6B1A' }}>-${savings}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Precio final</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0D0D0D' }}>${discountPrice}</span>
                </div>
              </>
            )}
          </div>

          {/* Oferta activa */}
          {offerActive && (offerDays || offerPeriod) && (
            <div style={{
              padding: '12px 16px', background: '#FFF3EC',
              borderTop: '1px solid #FFD4B8',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#C4500E', marginBottom: 4 }}>Oferta activa</div>
              <div style={{ fontSize: 12, color: '#C4500E', lineHeight: 1.5 }}>
                {[offerDays, offerPeriod].filter(Boolean).join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0 }}>
        <button
          onClick={() => !loading && onConfirm()}
          disabled={loading}
          style={{
            width: '100%', height: 52,
            background: loading ? '#E5E5E5' : '#FF6B1A',
            color: loading ? '#999' : '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creando paquete...' : 'Crear paquete'}
        </button>
      </div>
    </div>
  )
}
