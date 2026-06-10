// AMADOBOOK — CalendarMonthView.tsx
// Vista de calendario en modo MES: grid mensual con puntos indicadores por día

'use client'

export interface MonthDot {
  day: number
  count: number    // número de citas ese día
  hasConfirmed?: boolean
  hasPending?: boolean
}

export interface CalendarMonthViewProps {
  year: number
  month: number          // 0-indexed (0=Enero, 4=Mayo)
  dots: MonthDot[]
  selectedDay?: number
  onSelectDay?: (day: number) => void
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Dom…6=Sáb → convertir a Lun=0…Dom=6
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export default function CalendarMonthView({
  year, month, dots, selectedDay, onSelectDay,
}: CalendarMonthViewProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)

  // Crear grid: celdas vacías + días del mes
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad hasta múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null)

  const dotMap = new Map(dots.map(d => [d.day, d]))
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const todayDay = isCurrentMonth ? today.getDate() : -1

  return (
    <div style={{
      background: '#FFF',
      padding: '16px',
    }}>
      {/* ── Cabecera de días ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: 8,
      }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#999',
            padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid de días ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px 0',
      }}>
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />

          const dot       = dotMap.get(day)
          const isToday   = day === todayDay
          const isSelected = day === selectedDay
          const isActive  = isSelected || isToday

          return (
            <button
              key={day}
              onClick={() => onSelectDay?.(day)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {/* Número del día */}
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: isSelected ? '#0D0D0D' : isToday ? '#FF6B1A' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#FFF' : '#0D0D0D',
                }}>
                  {day}
                </span>
              </div>

              {/* Puntos indicadores de citas */}
              {dot && (
                <div style={{ display: 'flex', gap: 3, height: 6, alignItems: 'center' }}>
                  {dot.hasConfirmed && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
                  )}
                  {dot.hasPending && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B' }} />
                  )}
                  {!dot.hasConfirmed && !dot.hasPending && dot.count > 0 && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#999' }} />
                  )}
                </div>
              )}
              {!dot && <div style={{ height: 6 }} />}
            </button>
          )
        })}
      </div>

      {/* ── Leyenda ── */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginTop: 16,
        padding: '12px 0 0',
        borderTop: '1px solid #F5F5F5',
        justifyContent: 'center',
      }}>
        {[
          { color: '#22C55E', label: 'Confirmadas' },
          { color: '#F59E0B', label: 'Pendientes' },
          { color: '#999',    label: 'Otras' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: 12, color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_MONTH_DOTS: MonthDot[] = [
  { day: 1,  count: 3, hasConfirmed: true,  hasPending: false },
  { day: 6,  count: 2, hasConfirmed: true,  hasPending: true  },
  { day: 8,  count: 5, hasConfirmed: true,  hasPending: true  },
  { day: 10, count: 1, hasConfirmed: false, hasPending: true  },
  { day: 13, count: 4, hasConfirmed: true,  hasPending: false },
  { day: 14, count: 2, hasConfirmed: false, hasPending: true  },
  { day: 15, count: 6, hasConfirmed: true,  hasPending: true  },
  { day: 16, count: 3, hasConfirmed: true,  hasPending: false },
  { day: 17, count: 4, hasConfirmed: true,  hasPending: true  },
  { day: 20, count: 5, hasConfirmed: true,  hasPending: false },
  { day: 21, count: 2, hasConfirmed: false, hasPending: true  },
  { day: 22, count: 3, hasConfirmed: true,  hasPending: true  },
  { day: 27, count: 4, hasConfirmed: true,  hasPending: false },
  { day: 29, count: 2, hasConfirmed: true,  hasPending: true  },
]
