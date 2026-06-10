// AMADOBOOK — CalendarWeekView.tsx
// Vista de calendario en modo SEMANA: 7 columnas con bloques de citas

'use client'

export interface WeekBlock {
  id: string
  dayIndex: number       // 0=Lun, 1=Mar, ... 6=Dom
  startHour: number      // 9.0 = 9:00, 9.5 = 9:30
  durationHours: number
  clientName: string
  service: string
  color: string
  textColor: string
}

export interface CalendarWeekViewProps {
  blocks: WeekBlock[]
  weekDays?: string[]    // ["13","14","15","16","17","18","19"]
  dayLabels?: string[]   // ["L","M","X","J","V","S","D"]
  todayIndex?: number    // 2 = Miércoles activo
  onViewCita?: (id: string) => void
}

const HOUR_HEIGHT = 48
const START_HOUR  = 8
const END_HOUR    = 19

function formatHourShort(h: number) {
  const hh = Math.floor(h)
  const ampm = hh < 12 ? 'a' : 'p'
  const display = hh > 12 ? hh - 12 : hh
  return `${display}${ampm}`
}

export default function CalendarWeekView({
  blocks,
  weekDays = ['13','14','15','16','17','18','19'],
  dayLabels = ['L','M','X','J','V','S','D'],
  todayIndex = 2,
  onViewCita,
}: CalendarWeekViewProps) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
  const LEFT_GUTTER = 36

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FFF' }}>

      {/* ── Cabecera de días ── */}
      <div style={{
        display: 'flex',
        position: 'sticky',
        top: 0,
        background: '#FFF',
        zIndex: 10,
        borderBottom: '1px solid #F0F0F0',
        paddingBottom: 8,
        paddingTop: 8,
      }}>
        {/* Espacio para la columna de horas */}
        <div style={{ width: LEFT_GUTTER, flexShrink: 0 }} />
        {dayLabels.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{ fontSize: 10, color: '#999', fontWeight: 500 }}>{d}</span>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i === todayIndex ? '#0D0D0D' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 13,
                fontWeight: i === todayIndex ? 700 : 400,
                color: i === todayIndex ? '#FFF' : '#0D0D0D',
              }}>
                {weekDays[i]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grid de horas + bloques ── */}
      <div style={{ position: 'relative' }}>
        {/* Filas de horas */}
        {hours.map(h => (
          <div key={h} style={{ display: 'flex', height: HOUR_HEIGHT, borderBottom: '1px solid #F5F5F5' }}>
            <div style={{
              width: LEFT_GUTTER,
              flexShrink: 0,
              padding: '0 6px',
              display: 'flex',
              alignItems: 'flex-start',
              paddingTop: 4,
            }}>
              <span style={{ fontSize: 10, color: '#999', fontWeight: 500 }}>{formatHourShort(h)}</span>
            </div>
            {dayLabels.map((_, di) => (
              <div key={di} style={{
                flex: 1,
                borderLeft: '1px solid #F5F5F5',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0, right: 0,
                  borderTop: '1px dashed #FAFAFA',
                }} />
              </div>
            ))}
          </div>
        ))}

        {/* Bloques de citas */}
        {blocks.map(block => {
          const colWidth = `calc((100% - ${LEFT_GUTTER}px) / 7)`
          const top = (block.startHour - START_HOUR) * HOUR_HEIGHT
          const height = block.durationHours * HOUR_HEIGHT - 3

          return (
            <button
              key={block.id}
              onClick={() => onViewCita?.(block.id)}
              style={{
                position: 'absolute',
                top,
                left: `calc(${LEFT_GUTTER}px + ${block.dayIndex} * ${colWidth} + 2px)`,
                width: `calc(${colWidth} - 4px)`,
                height,
                background: block.color,
                borderRadius: 7,
                padding: '4px 6px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                zIndex: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: block.textColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {block.clientName}
              </div>
              {block.durationHours >= 0.75 && (
                <div style={{
                  fontSize: 10,
                  color: block.textColor,
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {block.service}
                </div>
              )}
            </button>
          )
        })}

        {/* Línea de hora actual */}
        <div style={{
          position: 'absolute',
          top: (10 - START_HOUR) * HOUR_HEIGHT,
          left: LEFT_GUTTER,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B1A', flexShrink: 0, marginLeft: -4 }} />
          <div style={{ flex: 1, height: 2, background: '#FF6B1A', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_WEEK_BLOCKS: WeekBlock[] = [
  { id: 'w1', dayIndex: 0, startHour: 9,    durationHours: 0.5,  clientName: 'Juan Pérez',    service: 'Corte clásico',        color: '#FFF3EC', textColor: '#C4500E' },
  { id: 'w2', dayIndex: 2, startHour: 10,   durationHours: 0.75, clientName: 'Carlos Mendoza',service: 'Corte clásico + Barba',color: '#FF6B1A', textColor: '#FFF'    },
  { id: 'w3', dayIndex: 2, startHour: 13,   durationHours: 0.75, clientName: 'Luis Ramírez',  service: 'Degradado + Barba',    color: '#F0FDF4', textColor: '#15803D' },
  { id: 'w4', dayIndex: 2, startHour: 14,   durationHours: 0.5,  clientName: 'Andrés Gómez',  service: 'Corte + Diseño',       color: '#FFF3EC', textColor: '#C4500E' },
  { id: 'w5', dayIndex: 2, startHour: 15.5, durationHours: 0.5,  clientName: 'Miguel Torres', service: 'Corte clásico',        color: '#F0FDF4', textColor: '#15803D' },
  { id: 'w6', dayIndex: 3, startHour: 10,   durationHours: 0.5,  clientName: 'David Sánchez', service: 'Degradado',            color: '#FFF3EC', textColor: '#C4500E' },
  { id: 'w7', dayIndex: 4, startHour: 11,   durationHours: 0.75, clientName: 'Juan Pérez',    service: 'Corte + Barba',        color: '#F0FDF4', textColor: '#15803D' },
  { id: 'w8', dayIndex: 5, startHour: 9,    durationHours: 0.5,  clientName: 'Carlos Mendoza',service: 'Corte clásico',        color: '#FF6B1A', textColor: '#FFF'    },
]
