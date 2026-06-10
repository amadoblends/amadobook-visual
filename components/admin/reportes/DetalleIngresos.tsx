// AMADOBOOK — DetalleIngresos.tsx
// Desglose completo de ingresos del período
// Muestra: monto total, filas por categoría, nota de impuestos, botón exportar

'use client'

export interface DetalleIngresosProps {
  netRevenue: number
  revenueChangePct: number
  breakdown: {
    label: string      // "Servicios" / "Productos" / "Propinas" / "Descuentos" / "Impuestos"
    amount: number
    isDeduction?: boolean  // true = rojo y con signo negativo
  }[]
  taxNote?: string         // "Recuerda separar el 25-30% para impuestos."
  onExport?: () => void
  onBack?: () => void
}

export default function DetalleIngresos({
  netRevenue, revenueChangaPct, breakdown, taxNote,
  onExport, onBack,
}: DetalleIngresosProps & { revenueChangaPct?: number }) {
  const isPos = (revenueChangaPct ?? 0) >= 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
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
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Detalle de ingresos</div>
          <div style={{ width: 22 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Total destacado */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 8 }}>Ingresos netos</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0D0D0D', lineHeight: 1 }}>
            ${netRevenue.toLocaleString()}.00
          </div>
          {revenueChangaPct !== undefined && (
            <div style={{
              fontSize: 13, fontWeight: 600, marginTop: 8,
              color: isPos ? '#22C55E' : '#EF4444',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {isPos ? '↑' : '↓'} {Math.abs(revenueChangaPct)}% vs mes anterior
            </div>
          )}
        </div>

        {/* Filas de desglose */}
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
          {breakdown.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < breakdown.length - 1 ? '1px solid #F5F5F5' : 'none',
              }}
            >
              <span style={{ fontSize: 14, color: '#0D0D0D', fontWeight: 500 }}>{row.label}</span>
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: row.isDeduction ? '#DC2626' : '#0D0D0D',
              }}>
                {row.isDeduction ? '-' : ''}${Math.abs(row.amount).toLocaleString()}.00
              </span>
            </div>
          ))}
        </div>

        {/* Nota de impuestos */}
        {taxNote && (
          <div style={{
            background: '#FFFBEB',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            border: '1px solid #FDE68A',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>{taxNote}</span>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* Botón exportar */}
      <div style={{
        padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #F0F0F0', background: '#FFF',
      }}>
        <button
          onClick={onExport}
          style={{
            width: '100%', height: 52,
            background: '#FF6B1A', color: '#FFF',
            border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          📥 Exportar reporte
        </button>
      </div>
    </div>
  )
}
