// AMADOBOOK — ImpuestosAnual.tsx
// Reporte anual de impuestos y gastos deducibles
// Muestra: resumen fiscal + desglose de gastos deducibles

'use client'

import { useState } from 'react'

export interface GastoDeducible {
  label: string     // "Productos y suministros"
  amount: number
}

export interface ImpuestosAnualProps {
  availableYears: number[]
  selectedYear: number
  onYearChange?: (year: number) => void
  netRevenue: number
  totalDeductible: number
  netProfit: number
  estimatedTaxPct: number
  estimatedTax: number
  deductibleBreakdown: GastoDeducible[]
  onBack?: () => void
  onViewDeductibleDetail?: () => void
}

export default function ImpuestosAnual({
  availableYears,
  selectedYear,
  onYearChange,
  netRevenue,
  totalDeductible,
  netProfit,
  estimatedTaxPct,
  estimatedTax,
  deductibleBreakdown,
  onBack,
  onViewDeductibleDetail,
}: ImpuestosAnualProps) {
  const [year, setYear] = useState(selectedYear)

  const handleYearChange = (y: number) => {
    setYear(y)
    onYearChange?.(y)
  }

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
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Impuestos (Anual)</div>
          <div style={{ width: 22 }} />
        </div>

        {/* Selector de año */}
        <div style={{ padding: '0 16px 14px' }}>
          <select
            value={year}
            onChange={e => handleYearChange(Number(e.target.value))}
            style={{
              height: 40, padding: '0 14px',
              background: '#F5F5F5', border: 'none',
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: '#0D0D0D', outline: 'none', appearance: 'none',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Resumen fiscal */}
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 8px', fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>
            Resumen para impuestos
          </div>

          {[
            { label: 'Ingresos netos',    value: netRevenue,     color: '#0D0D0D', prefix: '$'  },
            { label: 'Gastos deducibles', value: totalDeductible, color: '#DC2626', prefix: '-$' },
            { label: 'Beneficio neto',    value: netProfit,       color: '#0D0D0D', prefix: '$'  },
            {
              label: `Impuestos estimados (${estimatedTaxPct}%)`,
              value: estimatedTax,
              color: '#EF4444',
              prefix: '$',
              highlight: true,
            },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderTop: '1px solid #F5F5F5',
                background: row.highlight ? '#FEF9F9' : 'transparent',
              }}
            >
              <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>{row.label}</span>
              <span style={{
                fontSize: 16, fontWeight: 800, color: row.color,
              }}>
                {row.prefix}{row.value.toLocaleString()}.00
              </span>
            </div>
          ))}
        </div>

        {/* Gastos deducibles */}
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '16px 20px 8px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Gastos deducibles</div>
            <button
              onClick={onViewDeductibleDetail}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#FF6B1A', fontWeight: 600,
              }}
            >
              Ver detalle
            </button>
          </div>

          {deductibleBreakdown.map((gasto, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderTop: '1px solid #F5F5F5',
              }}
            >
              <span style={{ fontSize: 14, color: '#0D0D0D', fontWeight: 500 }}>{gasto.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>
                ${gasto.amount.toLocaleString()}.00
              </span>
            </div>
          ))}

          {/* Total deducible */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px',
            borderTop: '2px solid #F0F0F0',
            background: '#F9F9F9',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Total deducible</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>
              ${totalDeductible.toLocaleString()}.00
            </span>
          </div>
        </div>

        {/* Nota importante */}
        <div style={{
          background: '#FFFBEB', borderRadius: 12,
          padding: '14px 16px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
          border: '1px solid #FDE68A',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
            Este resumen es orientativo. Consulta con un contador para tu declaración oficial.
            Los impuestos estimados son solo una referencia.
          </span>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
