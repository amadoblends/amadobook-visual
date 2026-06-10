// AMADOBOOK — NuevaOferta_Step3.tsx
// Paso 3: Resumen y confirmación de la nueva oferta

'use client'

export interface NuevaOfertaStep3Props {
  name: string
  appliesTo: 'services' | 'packages' | 'all'
  selectedItems: { name: string; price: number }[]
  discountType: 'percentage' | 'fixed'
  discountValue: number
  startDate: string
  endDate: string
  daysOfWeek: number[]
  allDay: boolean
  startTime?: string
  endTime?: string
  onConfirm: () => void
  onBack?: () => void
  loading?: boolean
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

const DAY_LABELS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '12px 0', borderBottom: '1px solid #F5F5F5', gap: 16,
    }}>
      <span style={{ fontSize: 13, color: '#666', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function NuevaOferta_Step3({
  name, appliesTo, selectedItems,
  discountType, discountValue,
  startDate, endDate,
  daysOfWeek, allDay, startTime, endTime,
  onConfirm, onBack, loading = false,
}: NuevaOfertaStep3Props) {
  const daysLabel = daysOfWeek.map(d => DAY_LABELS[d]).join(' · ')
  const discountLabel = discountType === 'percentage'
    ? `${discountValue}% de descuento`
    : `$${discountValue} de descuento`
  const appliesToLabel = appliesTo === 'all' ? 'Todos los servicios y paquetes'
    : appliesTo === 'services' ? 'Servicios seleccionados'
    : 'Paquetes seleccionados'
  const scheduleLabel = allDay ? 'Todo el día' : `${startTime} – ${endTime}`

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
        <div style={{ paddingBottom: 20 }}><StepIndicator current={3} /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Resumen de la oferta</div>

        {/* Badge preview */}
        <div style={{
          background: '#FFF3EC', borderRadius: 16, padding: 20,
          display: 'flex', alignItems: 'center', gap: 16,
          border: '1.5px solid #FFD4B8',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: '#FF6B1A',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
              {discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {discountType === 'percentage' ? 'OFF' : 'desc.'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>{name}</div>
            <div style={{ fontSize: 13, color: '#FF6B1A', marginTop: 4, fontWeight: 600 }}>
              {discountLabel}
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '4px 16px' }}>
          <SummaryRow label="Aplica a"      value={appliesToLabel} />
          {selectedItems.length > 0 && (
            <SummaryRow label="Items"       value={selectedItems.map(i => i.name).join(', ')} />
          )}
          <SummaryRow label="Descuento"     value={discountLabel} />
          <SummaryRow label="Período"       value={`${startDate} → ${endDate}`} />
          <SummaryRow label="Días"          value={daysLabel} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', gap: 16 }}>
            <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Horario</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D' }}>{scheduleLabel}</span>
          </div>
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
          {loading ? 'Creando oferta...' : 'Crear oferta'}
        </button>
      </div>
    </div>
  )
}
