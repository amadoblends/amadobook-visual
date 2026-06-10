// AMADOBOOK — FiltrosReporte.tsx
// Bottom sheet de filtros del reporte
// Opciones: período rápido, rango personalizado, comparar con, barbero

'use client'

import { useState } from 'react'

export type PeriodoRapido = 'today' | 'week' | 'month' | 'prev_month'
export type CompararCon = 'prev_period' | 'prev_year' | 'none'

export interface FiltrosReporteProps {
  initialPeriodo?: PeriodoRapido
  initialDesde?: string
  initialHasta?: string
  initialComparar?: CompararCon
  barberName?: string
  onApply: (filtros: {
    periodo?: PeriodoRapido
    desde?: string
    hasta?: string
    compararCon: CompararCon
  }) => void
  onClear?: () => void
  onClose?: () => void
}

const PERIODOS: { key: PeriodoRapido; label: string }[] = [
  { key: 'today',      label: 'Hoy'          },
  { key: 'week',       label: 'Esta semana'  },
  { key: 'month',      label: 'Este mes'     },
  { key: 'prev_month', label: 'Mes anterior' },
]

const COMPARAR_OPTIONS: { key: CompararCon; label: string }[] = [
  { key: 'prev_period', label: 'Período anterior' },
  { key: 'prev_year',   label: 'Año anterior'     },
  { key: 'none',        label: 'Sin comparar'     },
]

export default function FiltrosReporte({
  initialPeriodo = 'month',
  initialDesde = '',
  initialHasta = '',
  initialComparar = 'prev_period',
  barberName = 'Yo (Alex The Barber)',
  onApply, onClear, onClose,
}: FiltrosReporteProps) {
  const [periodo,    setPeriodo]    = useState<PeriodoRapido | null>(initialPeriodo)
  const [desde,      setDesde]      = useState(initialDesde)
  const [hasta,      setHasta]      = useState(initialHasta)
  const [compararCon,setCompararCon]= useState<CompararCon>(initialComparar)

  const handlePeriodoSelect = (p: PeriodoRapido) => {
    setPeriodo(p)
    // Limpiar rango personalizado al elegir período rápido
    setDesde('')
    setHasta('')
  }

  const handleDesdeChange = (v: string) => {
    setDesde(v)
    if (v) setPeriodo(null)   // Al escribir rango personalizado, quitar período rápido
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, height: 44, padding: '0 14px',
    background: '#F5F5F5', border: 'none',
    borderRadius: 10, fontSize: 14, color: '#0D0D0D',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{
      background: '#FFF',
      borderRadius: '20px 20px 0 0',
      padding: '0 0 env(safe-area-inset-bottom, 16px)',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430,
      width: '100%',
    }}>
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: '#E5E5E5' }} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '12px 20px 16px',
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Filtros</div>
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#F5F5F5', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#666',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Período rápido */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 10 }}>Período</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {PERIODOS.map(p => (
              <button
                key={p.key}
                onClick={() => handlePeriodoSelect(p.key)}
                style={{
                  flex: 1, height: 40,
                  background: periodo === p.key ? '#0D0D0D' : '#F5F5F5',
                  color: periodo === p.key ? '#FFF' : '#666',
                  border: 'none', borderRadius: 10,
                  fontSize: 12, fontWeight: periodo === p.key ? 700 : 400,
                  cursor: 'pointer', transition: 'all 200ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rango personalizado */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 10 }}>Personalizado</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Desde</div>
              <input
                type="date"
                value={desde}
                onChange={e => handleDesdeChange(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Hasta</div>
              <input
                type="date"
                value={hasta}
                onChange={e => setHasta(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Comparar con */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 10 }}>Comparar con</div>
          <select
            value={compararCon}
            onChange={e => setCompararCon(e.target.value as CompararCon)}
            style={{
              width: '100%', height: 48, padding: '0 14px',
              background: '#F5F5F5', border: 'none',
              borderRadius: 12, fontSize: 14, color: '#0D0D0D',
              outline: 'none', appearance: 'none',
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}
          >
            {COMPARAR_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Barbero (informativo para futuro multi-barbero) */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 10 }}>Barbero</div>
          <div style={{
            height: 48, padding: '0 14px',
            background: '#F5F5F5', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#FF6B1A', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#FFF',
            }}>A</div>
            <span style={{ fontSize: 14, color: '#0D0D0D', flex: 1 }}>{barberName}</span>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
          <button
            onClick={() => onApply({ periodo: periodo ?? undefined, desde, hasta, compararCon })}
            style={{
              width: '100%', height: 52,
              background: '#0D0D0D', color: '#FFF',
              border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Aplicar filtros
          </button>
          <button
            onClick={() => {
              setPeriodo('month')
              setDesde('')
              setHasta('')
              setCompararCon('prev_period')
              onClear?.()
            }}
            style={{
              width: '100%', height: 44,
              background: 'none', color: '#FF6B1A',
              border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}
