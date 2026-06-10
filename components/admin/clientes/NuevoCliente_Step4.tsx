// AMADOBOOK — NuevoCliente_Step4.tsx
// Paso 4: Confirmar y crear el nuevo cliente — resumen de todos los datos

'use client'

function StepIndicator({ current }: { current: number }) {
  const steps = ['Información', 'Detalles', 'Notas', 'Confirmar']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((label, i) => {
        const n = i + 1, done = n < current, active = n === current
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, background: done ? '#0D0D0D' : '#E5E5E5', zIndex: 0 }} />
            )}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', zIndex: 1, flexShrink: 0,
              background: done || active ? '#0D0D0D' : '#E5E5E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none',
            }}>
              {done ? <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>
                    : <span style={{ color: active ? '#FFF' : '#999', fontSize: 12, fontWeight: 700 }}>{n}</span>}
            </div>
            <span style={{ fontSize: 10, color: active ? '#0D0D0D' : '#999', fontWeight: active ? 700 : 400, textAlign: 'center', lineHeight: 1.2 }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export interface NuevoClienteStep4Props {
  data: {
    name: string
    phone: string
    email?: string
    birthDate?: string
    avatarPreview?: string
    referredBy?: string
    preferredTime?: string
    tags?: string[]
    notes?: string
  }
  onConfirm: () => void
  onBack?: () => void
  onEditStep?: (step: 1 | 2 | 3) => void
  loading?: boolean
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 0',
      borderBottom: '1px solid #F5F5F5',
    }}>
      <div style={{ minWidth: 120, fontSize: 12, color: '#999', fontWeight: 600, paddingTop: 1 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 14, color: '#0D0D0D', fontWeight: 500, lineHeight: 1.5 }}>{value}</div>
    </div>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function NuevoCliente_Step4({ data, onConfirm, onBack, onEditStep, loading = false }: NuevoClienteStep4Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nuevo Cliente</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={4} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Avatar + nombre preview */}
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: data.avatarPreview ? 'transparent' : '#FF6B1A',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {data.avatarPreview
              ? <img src={data.avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 24 }}>{getInitials(data.name)}</span>
            }
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D' }}>{data.name}</div>
        </div>

        {/* Sección: Información personal */}
        <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '4px 16px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0 6px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>Información personal</div>
            <button onClick={() => onEditStep?.(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#FF6B1A', fontWeight: 600 }}>
              Editar
            </button>
          </div>
          <SummaryRow label="Teléfono"      value={data.phone} />
          <SummaryRow label="Correo"        value={data.email} />
          <SummaryRow label="Nacimiento"    value={data.birthDate} />
          <div style={{ paddingBottom: 8 }} />
        </div>

        {/* Sección: Detalles */}
        {(data.referredBy || data.preferredTime || (data.tags && data.tags.length > 0)) && (
          <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '4px 16px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0 6px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>Detalles</div>
              <button onClick={() => onEditStep?.(2)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#FF6B1A', fontWeight: 600 }}>
                Editar
              </button>
            </div>
            <SummaryRow label="Referido por"    value={data.referredBy} />
            <SummaryRow label="Horario prefdo." value={data.preferredTime} />
            <SummaryRow label="Etiquetas"       value={data.tags?.join(', ')} />
            <div style={{ paddingBottom: 8 }} />
          </div>
        )}

        {/* Sección: Notas */}
        {data.notes && (
          <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '4px 16px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0 6px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>Notas</div>
              <button onClick={() => onEditStep?.(3)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#FF6B1A', fontWeight: 600 }}>
                Editar
              </button>
            </div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6, padding: '6px 0 14px' }}>
              {data.notes}
            </div>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => !loading && onConfirm()}
          disabled={loading}
          style={{
            width: '100%', height: 52,
            background: loading ? '#E5E5E5' : '#FF6B1A',
            color: loading ? '#999' : '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading ? 'Creando cliente...' : '✓ Crear cliente'}
        </button>
      </div>
    </div>
  )
}
