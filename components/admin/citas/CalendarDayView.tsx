// AMADOBOOK — CalendarDayView.tsx
// Vista de calendario en modo DÍA: columna de horas con bloques de citas
// Horas: 08:00 AM – 07:00 PM

'use client'

export interface DayBlock {
  id: string
  startHour: number    // 9.0 = 9:00, 9.5 = 9:30
  durationHours: number // 0.5 = 30min, 1 = 60min
  clientName: string
  service: string
  color: string        // fondo del bloque
  textColor: string
}

export interface CalendarDayViewProps {
  blocks: DayBlock[]
  onViewCita?: (id: string) => void
  onNewCita?: () => void
}

const HOUR_HEIGHT = 64  // px por hora
const START_HOUR  = 8   // 08:00 AM
const END_HOUR    = 20  // 08:00 PM

function formatHour(h: number) {
  const hh = Math.floor(h)
  const mm = h % 1 === 0.5 ? '30' : '00'
  const ampm = hh < 12 ? 'AM' : 'PM'
  const display = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh
  return `${display}:${mm} ${ampm}`
}

export default function CalendarDayView({ blocks, onViewCita, onNewCita }: CalendarDayViewProps) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
  const totalHeight = hours.length * HOUR_HEIGHT
  const LEFT_GUTTER = 64  // ancho de la columna de horas

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: '#FFF',
      position: 'relative',
    }}>
      <div style={{
        position: 'relative',
        minHeight: totalHeight,
        paddingBottom: 24,
      }}>

        {/* ── Filas de horas ── */}
        {hours.map(h => (
          <div
            key={h}
            style={{
              display: 'flex',
              height: HOUR_HEIGHT,
              borderBottom: '1px solid #F5F5F5',
            }}
          >
            {/* Etiqueta de hora */}
            <div style={{
              width: LEFT_GUTTER,
              flexShrink: 0,
              padding: '0 10px',
              display: 'flex',
              alignItems: 'flex-start',
              paddingTop: 6,
            }}>
              <span style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>
                {formatHour(h)}
              </span>
            </div>

            {/* Zona de citas — línea horizontal de media hora */}
            <div style={{
              flex: 1,
              position: 'relative',
              borderLeft: '1px solid #F5F5F5',
            }}>
              {/* Línea de media hora */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                borderTop: '1px dashed #EFEFEF',
              }} />

              {/* Botón para nueva cita en hora libre */}
              <button
                onClick={onNewCita}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
                aria-label={`Nueva cita a las ${formatHour(h)}`}
              />
            </div>
          </div>
        ))}

        {/* ── Bloques de citas (posicionados absolutamente) ── */}
        {blocks.map(block => {
          const top = (block.startHour - START_HOUR) * HOUR_HEIGHT
          const height = block.durationHours * HOUR_HEIGHT - 4

          return (
            <button
              key={block.id}
              onClick={() => onViewCita?.(block.id)}
              style={{
                position: 'absolute',
                top,
                left: LEFT_GUTTER + 8,
                right: 8,
                height,
                background: block.color,
                borderRadius: 10,
                padding: '6px 10px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: block.textColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {block.clientName}
              </div>
              <div style={{
                fontSize: 11,
                color: block.textColor,
                opacity: 0.8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: 2,
              }}>
                {block.service}
              </div>
            </button>
          )
        })}

        {/* ── Línea de hora actual ── */}
        <div style={{
          position: 'absolute',
          top: (10 - START_HOUR) * HOUR_HEIGHT,   // 10:00 AM como "ahora"
          left: LEFT_GUTTER,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B1A', flexShrink: 0, marginLeft: -4 }} />
          <div style={{ flex: 1, height: 2, background: '#FF6B1A' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_DAY_BLOCKS: DayBlock[] = [
  { id: '1', startHour: 9,    durationHours: 0.5, clientName: 'Juan Pérez',    service: 'Corte clásico',        color: '#FFF3EC', textColor: '#C4500E' },
  { id: '2', startHour: 10,   durationHours: 0.75,clientName: 'Carlos Mendoza',service: 'Corte clásico + Barba',color: '#FF6B1A', textColor: '#FFF'    },
  { id: '3', startHour: 13,   durationHours: 0.75,clientName: 'Luis Ramírez',  service: 'Degradado + Barba',    color: '#F0FDF4', textColor: '#15803D' },
  { id: '4', startHour: 14,   durationHours: 0.5, clientName: 'Andrés Gómez',  service: 'Corte + Diseño',       color: '#FFF3EC', textColor: '#C4500E' },
  { id: '5', startHour: 15.5, durationHours: 0.5, clientName: 'Miguel Torres', service: 'Corte clásico',        color: '#F0FDF4', textColor: '#15803D' },
  { id: '6', startHour: 17,   durationHours: 0.75,clientName: 'David Sánchez', service: 'Degradado + Barba',    color: '#FFF3EC', textColor: '#C4500E' },
]
