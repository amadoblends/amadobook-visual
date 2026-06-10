// AMADOBOOK — ExportarReporte.tsx
// Pantalla de exportación de reportes en PDF
// Lista de reportes disponibles con botón de descarga por cada uno

'use client'

export interface ReporteExportable {
  id: string
  title: string
  description: string
  icon: string
  generating?: boolean
}

export interface ExportarReporteProps {
  reportes: ReporteExportable[]
  note?: string
  onExport?: (reporteId: string) => void
  onBack?: () => void
}

export default function ExportarReporte({
  reportes, note, onExport, onBack,
}: ExportarReporteProps) {
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
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Exportar reporte</div>
          <div style={{ width: 22 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Lista de reportes */}
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden' }}>
          {reportes.map((reporte, i) => (
            <div
              key={reporte.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px',
                borderBottom: i < reportes.length - 1 ? '1px solid #F5F5F5' : 'none',
              }}
            >
              {/* Ícono */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#F5F5F5', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {reporte.icon}
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{reporte.title}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2, lineHeight: 1.4 }}>
                  {reporte.description}
                </div>
              </div>

              {/* Botón PDF */}
              <button
                onClick={() => onExport?.(reporte.id)}
                disabled={reporte.generating}
                style={{
                  flexShrink: 0,
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: reporte.generating ? '#F0F0F0' : '#FFF3EC',
                  border: 'none', cursor: reporte.generating ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: reporte.generating ? 12 : 20,
                  color: reporte.generating ? '#999' : '#FF6B1A',
                  transition: 'all 200ms',
                }}
                aria-label={`Exportar ${reporte.title}`}
              >
                {reporte.generating ? '⏳' : '📥'}
              </button>
            </div>
          ))}
        </div>

        {/* Nota informativa */}
        {note && (
          <div style={{
            background: '#F0FDF4', borderRadius: 12,
            padding: '14px 16px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            border: '1px solid #BBF7D0',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontSize: 13, color: '#14532D', lineHeight: 1.5 }}>{note}</span>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
