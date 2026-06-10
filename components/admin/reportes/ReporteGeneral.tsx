// AMADOBOOK — ReporteGeneral.tsx
// Contenedor del reporte general con tabs: Resumen / Ingresos / Servicios / Clientes / Tiempo
// Ruta: /admin/reportes/general

'use client'

import { useState } from 'react'
import ReporteResumen, { ReporteResumenProps } from './ReporteResumen'
import ReporteIngresos, { ReporteIngresosProps } from './ReporteIngresos'
import ReporteServicios, { ReporteServiciosProps } from './ReporteServicios'
import ReporteClientes, { ReporteClientesProps } from './ReporteClientes'
import ReporteTiempo, { ReporteTiempoProps } from './ReporteTiempo'

type ReporteTab = 'resumen' | 'ingresos' | 'servicios' | 'clientes' | 'tiempo'

export interface ReporteGeneralProps {
  period: string
  resumen: ReporteResumenProps
  ingresos: ReporteIngresosProps
  servicios: ReporteServiciosProps
  clientes: ReporteClientesProps
  tiempo: ReporteTiempoProps
  onBack?: () => void
  onFilter?: () => void
  onPeriodChange?: () => void
}

const TABS: { key: ReporteTab; label: string }[] = [
  { key: 'resumen',   label: 'Resumen'   },
  { key: 'ingresos',  label: 'Ingresos'  },
  { key: 'servicios', label: 'Servicios' },
  { key: 'clientes',  label: 'Clientes'  },
  { key: 'tiempo',    label: 'Tiempo'    },
]

export default function ReporteGeneral({
  period, resumen, ingresos, servicios, clientes, tiempo,
  onBack, onFilter, onPeriodChange,
}: ReporteGeneralProps) {
  const [activeTab, setActiveTab] = useState<ReporteTab>('resumen')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 16px 12px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Reporte general</div>
          <button onClick={onFilter} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666' }}>⚙️</button>
        </div>

        {/* Selector período */}
        <div style={{ padding: '0 16px 12px' }}>
          <button
            onClick={onPeriodChange}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F5F5F5', border: 'none', borderRadius: 10,
              padding: '8px 14px', fontSize: 13, fontWeight: 600,
              color: '#0D0D0D', cursor: 'pointer',
            }}
          >
            📅 {period} <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', overflowX: 'auto',
          scrollbarWidth: 'none', padding: '0 16px',
          gap: 0,
        }}>
          {TABS.map(tab => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0, padding: '10px 16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#0D0D0D' : '#999',
                  borderBottom: isActive ? '2px solid #0D0D0D' : '2px solid transparent',
                  transition: 'all 200ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'resumen'   && <ReporteResumen   {...resumen}   />}
        {activeTab === 'ingresos'  && <ReporteIngresos  {...ingresos}  />}
        {activeTab === 'servicios' && <ReporteServicios {...servicios} />}
        {activeTab === 'clientes'  && <ReporteClientes  {...clientes}  />}
        {activeTab === 'tiempo'    && <ReporteTiempo    {...tiempo}    />}
      </div>
    </div>
  )
}
