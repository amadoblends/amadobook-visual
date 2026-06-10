// AMADOBOOK — DayResumen.tsx
// Resumen del día para el admin
// Muestra: stats, ingresos, próximas citas, servicios más reservados (donut)
// Ruta: /admin/citas/resumen  o acceso desde Dashboard

'use client'

interface DayStat {
  label: string
  value: number
  color: string
}

interface UpcomingAppt {
  id: string
  time: string
  clientName: string
  service: string
  status: 'pending' | 'confirmed'
}

interface ServiceShare {
  name: string
  pct: number
  color: string
}

export interface DayResumenProps {
  date: string           // "Miércoles, 15 de Mayo 2024"
  stats: DayStat[]       // [{label:'Total', value:12, color:'#0D0D0D'}, ...]
  dayRevenue: number
  revenueChangePct: number  // +18 o -5
  upcoming: UpcomingAppt[]
  topServices: ServiceShare[]
  onBack?: () => void
  onViewAll?: () => void
  onViewCita?: (id: string) => void
}

// ─── Mini Donut (SVG puro) ────────────────────────────────────────────────────

function MiniDonut({ segments }: { segments: { pct: number; color: string }[] }) {
  const cx = 60, cy = 60, r = 44, stroke = 20
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
            strokeLinecap="butt"
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}

// ─── Sparkline simple ─────────────────────────────────────────────────────────

function Sparkline({ positive }: { positive: boolean }) {
  const color = positive ? '#22C55E' : '#EF4444'
  const d = positive
    ? 'M0,20 C10,18 20,10 30,8 C40,6 50,4 60,2'
    : 'M0,2 C10,4 20,12 30,14 C40,16 50,18 60,20'
  return (
    <svg width={64} height={24} viewBox="0 0 64 24">
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DayResumen({
  date, stats, dayRevenue, revenueChangePct,
  upcoming, topServices,
  onBack, onViewAll, onViewCita,
}: DayResumenProps) {
  const isPositive = revenueChangePct >= 0

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: '#F5F5F5',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430,
      margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 16px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0, lineHeight: 1 }}>
            ←
          </button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Resumen del día</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>📅</button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: '#666', fontWeight: 500, paddingBottom: 12 }}>
          {date}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Stats grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#FFF',
              borderRadius: 12,
              padding: '12px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Ingresos del día ── */}
        <div style={{
          background: '#FFF',
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ fontSize: 13, color: '#666', fontWeight: 500, marginBottom: 6 }}>Ingresos del día</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0D0D0D', lineHeight: 1 }}>
                ${dayRevenue.toLocaleString()}.00
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
                fontSize: 12,
                color: isPositive ? '#22C55E' : '#EF4444',
                fontWeight: 600,
              }}>
                {isPositive ? '↑' : '↓'} {Math.abs(revenueChangePct)}% vs ayer
              </div>
            </div>
            <Sparkline positive={isPositive} />
          </div>
        </div>

        {/* ── Próximas citas ── */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Próximas citas</div>
            <button
              onClick={onViewAll}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#FF6B1A', fontWeight: 600 }}
            >
              Ver todas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(appt => {
              const statusColor = appt.status === 'confirmed' ? '#16A34A' : '#D97706'
              const statusLabel = appt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'
              const statusBg   = appt.status === 'confirmed' ? '#F0FDF4' : '#FFFBEB'
              return (
                <button
                  key={appt.id}
                  onClick={() => onViewCita?.(appt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 0',
                    borderBottom: '1px solid #F5F5F5',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ minWidth: 52, fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{appt.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{appt.clientName}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{appt.service}</div>
                  </div>
                  <span style={{
                    background: statusBg,
                    color: statusColor,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 999,
                    flexShrink: 0,
                  }}>
                    {statusLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Servicios más reservados ── */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
            Servicios más reservados
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Donut */}
            <div style={{ flexShrink: 0 }}>
              <MiniDonut segments={topServices.map(s => ({ pct: s.pct, color: s.color }))} />
            </div>
            {/* Leyenda */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topServices.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: '#0D0D0D', fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_DAY_RESUMEN: DayResumenProps = {
  date: 'Miércoles, 15 de Mayo 2024',
  stats: [
    { label: 'Citas\ntotales',    value: 12, color: '#0D0D0D' },
    { label: 'Confir-\nmadas',   value: 6,  color: '#16A34A' },
    { label: 'Pen-\ndientes',    value: 4,  color: '#D97706' },
    { label: 'Cance-\nladas',    value: 2,  color: '#DC2626' },
  ],
  dayRevenue: 2400,
  revenueChangePct: 18,
  upcoming: [
    { id: '4', time: '02:00 PM', clientName: 'Andrés Gómez',  service: 'Corte + Diseño',   status: 'pending'   },
    { id: '5', time: '03:30 PM', clientName: 'Miguel Torres', service: 'Corte clásico',     status: 'confirmed' },
    { id: '6', time: '05:00 PM', clientName: 'David Sánchez', service: 'Degradado + Barba', status: 'pending'   },
  ],
  topServices: [
    { name: 'Corte clásico',  pct: 40, color: '#FF6B1A' },
    { name: 'Degradado',      pct: 25, color: '#0D0D0D' },
    { name: 'Corte + Barba',  pct: 20, color: '#22C55E' },
    { name: 'Otros',          pct: 15, color: '#E5E5E5' },
  ],
}
