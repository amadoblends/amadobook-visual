// AMADOBOOK — CalendarView.tsx
// Contenedor del calendario con tabs Día / Semana / Mes
// Ruta: /admin/citas/calendario

'use client'

import { useState } from 'react'
import CalendarDayView, { DEMO_DAY_BLOCKS } from './CalendarDayView'
import CalendarWeekView, { DEMO_WEEK_BLOCKS } from './CalendarWeekView'
import CalendarMonthView, { DEMO_MONTH_DOTS } from './CalendarMonthView'

type CalendarMode = 'day' | 'week' | 'month'

export interface CalendarViewProps {
  initialMode?: CalendarMode
  currentDate?: Date
  onNewCita?: () => void
  onViewCita?: (id: string) => void
  onBack?: () => void
}

const MODE_LABELS: Record<CalendarMode, string> = {
  day:   'Día',
  week:  'Semana',
  month: 'Mes',
}

export default function CalendarView({
  initialMode = 'day',
  currentDate = new Date('2024-05-15'),
  onNewCita,
  onViewCita,
  onBack,
}: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>(initialMode)
  const [selectedDate, setSelectedDate] = useState(currentDate)

  // Formatear título de período según el modo
  const periodLabel = (() => {
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    const m = months[selectedDate.getMonth()]
    const d = selectedDate.getDate()
    const y = selectedDate.getFullYear()
    if (mode === 'day')   return `${['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][selectedDate.getDay()]}, ${d} de ${m}`
    if (mode === 'week')  return `Semana del ${d} de ${m}`
    return `${m} ${y}`
  })()

  const navigate = (dir: 1 | -1) => {
    const d = new Date(selectedDate)
    if (mode === 'day')   d.setDate(d.getDate() + dir)
    if (mode === 'week')  d.setDate(d.getDate() + dir * 7)
    if (mode === 'month') d.setMonth(d.getMonth() + dir)
    setSelectedDate(d)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
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
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 12px',
        }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:'#0D0D0D', padding:0, lineHeight:1 }}>
            ☰
          </button>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D' }}>Calendario</div>
          <button
            onClick={onNewCita}
            style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: '#FF6B1A',
              border: 'none',
              cursor: 'pointer',
              color: '#FFF',
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            +
          </button>
        </div>

        {/* Tabs Día / Semana / Mes */}
        <div style={{
          display: 'flex',
          margin: '0 16px 14px',
          background: '#F5F5F5',
          borderRadius: 10,
          padding: 3,
          gap: 2,
        }}>
          {(['day','week','month'] as CalendarMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: mode === m ? '#FFF' : 'transparent',
                color: mode === m ? '#0D0D0D' : '#999',
                fontSize: 13,
                fontWeight: mode === m ? 700 : 400,
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 200ms',
              }}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Navegación de período */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px 14px',
        }}>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#0D0D0D', padding:0 }}>
            ‹
          </button>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{periodLabel}</div>
          <button onClick={() => navigate(1)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#0D0D0D', padding:0 }}>
            ›
          </button>
        </div>
      </div>

      {/* ── Contenido según modo ── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'day' && (
          <CalendarDayView
            blocks={DEMO_DAY_BLOCKS}
            onViewCita={onViewCita}
            onNewCita={onNewCita}
          />
        )}
        {mode === 'week' && (
          <CalendarWeekView
            blocks={DEMO_WEEK_BLOCKS}
            onViewCita={onViewCita}
          />
        )}
        {mode === 'month' && (
          <CalendarMonthView
            year={selectedDate.getFullYear()}
            month={selectedDate.getMonth()}
            dots={DEMO_MONTH_DOTS}
            selectedDay={selectedDate.getDate()}
            onSelectDay={(d) => {
              const n = new Date(selectedDate)
              n.setDate(d)
              setSelectedDate(n)
            }}
          />
        )}
      </div>

      {/* ── Bottom Nav placeholder ── */}
      <div style={{
        height: 80,
        background: '#FFF',
        borderTop: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        flexShrink: 0,
      }}>
        {[
          { icon: '🏠', label: 'Inicio',   active: false },
          { icon: '📅', label: 'Citas',    active: true  },
          { icon: '+',  label: '',         active: false, isFab: true },
          { icon: '👤', label: 'Clientes', active: false },
          { icon: '⋯',  label: 'Más',     active: false },
        ].map((item, i) => {
          if (item.isFab) return (
            <button key={i} onClick={onNewCita} style={{
              width:56, height:56, borderRadius:'50%', background:'#FF6B1A',
              border:'none', cursor:'pointer', fontSize:28, color:'#FFF',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 16px rgba(255,107,26,0.35)', marginTop:-20,
            }}>+</button>
          )
          return (
            <button key={i} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <span style={{ fontSize:10, color: item.active ? '#FF6B1A' : '#999', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
