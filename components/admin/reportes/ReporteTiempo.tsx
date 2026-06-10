// AMADOBOOK — ReporteTiempo.tsx
// Tab "Tiempo" del reporte general
// Muestra: horas por día de la semana (barras) + productividad

'use client'

export interface HorasDia {
  day: string      // "Lun" / "Mar" etc.
  hours: number
}

export interface ReporteTiempoProps {
  horasPorDia: HorasDia[]
  productividadPct: number
  productividadChangePct: number
  totalHorasTrabajadas: string     // "36h 30m"
  promedioHorasDia: number
  diaMasOcupado: string
}

function HorasBarChart({ data }: { data: HorasDia[] }) {
  const max = Math.max(...data.map(d => d.hours))
  const labels = [0, 2, 4, 6, 8]
  const CHART_H = 160
  const BAR_H_MAX = 120

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
      {/* Eje Y */}
      <div style={{
        display: 'flex', flexDirection: 'column-reverse',
        justifyContent: 'space-between',
        height: CHART_H, paddingBottom: 20, flexShrink: 0,
      }}>
        {labels.map(l => (
          <span key={l} style={{ fontSize: 10, color: '#CCC' }}>{l}h</span>
        ))}
      </div>

      {/* Barras */}
      <div style={{
        flex: 1, display: 'flex', gap: 8,
        alignItems: 'flex-end', height: CHART_H,
      }}>
        {data.map((d, i) => {
          const barH = max > 0 ? (d.hours / max) * BAR_H_MAX : 4
          const isMax = d.hours === max
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 10, color: isMax ? '#FF6B1A' : '#999', fontWeight: isMax ? 700 : 400 }}>
                {d.hours}h
              </div>
              <div style={{
                width: '100%', height: barH,
                background: isMax ? '#FF6B1A' : '#E5E5E5',
                borderRadius: '4px 4px 0 0',
                minHeight: 4,
                transition: 'height 400ms ease',
              }} />
              <div style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>{d.day}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ReporteTiempo({
  horasPorDia, productividadPct, productividadChangePct,
  totalHorasTrabajadas, promedioHorasDia, diaMasOcupado,
}: ReporteTiempoProps) {
  const isPos = productividadChangePct >= 0

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Horas por día */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 20 }}>
          Horas por día
        </div>
        <HorasBarChart data={horasPorDia} />
      </div>

      {/* Productividad */}
      <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
          Productividad
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0D0D0D', lineHeight: 1 }}>
            {productividadPct}%
          </div>
          <div style={{
            fontSize: 13, fontWeight: 600, paddingBottom: 4,
            color: isPos ? '#22C55E' : '#EF4444',
          }}>
            {isPos ? '↑' : '↓'} {Math.abs(productividadChangePct)}% vs mes anterior
          </div>
        </div>

        {/* Barra de productividad */}
        <div style={{ height: 10, background: '#F0F0F0', borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{
            height: '100%',
            width: `${productividadPct}%`,
            background: productividadPct >= 80 ? '#22C55E' : productividadPct >= 60 ? '#F59E0B' : '#EF4444',
            borderRadius: 999,
            transition: 'width 600ms ease',
          }} />
        </div>

        {/* Stats de tiempo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Total trabajado',  value: totalHorasTrabajadas },
            { label: 'Promedio/día',     value: `${promedioHorasDia}h` },
            { label: 'Día más ocupado',  value: diaMasOcupado },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#F9F9F9', borderRadius: 10, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0D0D0D' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}
