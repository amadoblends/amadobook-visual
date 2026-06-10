// AMADOBOOK — CitasList.tsx
// Lista de citas del día con strip de fechas, tabs de estado y FAB nueva cita
// Pantalla principal de /admin/citas

'use client'

import { useState } from 'react'
import CitaCard, { CitaStatus, CitaCardProps } from './CitaCard'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface DayTab {
  dayShort: string   // "Lun"
  dayNum: number     // 13
  date: string       // "2024-05-13" (ISO)
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled'

// ─── Sub-componente: Strip de días ────────────────────────────────────────────

function DateStrip({
  days,
  activeDate,
  onSelect,
}: {
  days: DayTab[]
  activeDate: string
  onSelect: (date: string) => void
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '0 16px 4px',
      scrollbarWidth: 'none',
    }}>
      {days.map(d => {
        const isActive = d.date === activeDate
        return (
          <button
            key={d.date}
            onClick={() => onSelect(d.date)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? '#0D0D0D' : 'transparent',
              transition: 'background 200ms',
            }}
          >
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: isActive ? '#999' : '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {d.dayShort}
            </span>
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: isActive ? '#FFF' : '#0D0D0D',
            }}>
              {d.dayNum}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Sub-componente: Tabs de estado ───────────────────────────────────────────

function StatusTabs({
  counts,
  active,
  onSelect,
}: {
  counts: Record<StatusFilter, number>
  active: StatusFilter
  onSelect: (s: StatusFilter) => void
}) {
  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all',       label: 'Todos' },
    { key: 'pending',   label: 'Pendientes' },
    { key: 'confirmed', label: 'Confirmadas' },
    { key: 'cancelled', label: 'Canceladas' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '0 16px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      {tabs.map(t => {
        const isActive = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 999,
              border: isActive ? 'none' : '1px solid #E5E5E5',
              background: isActive ? '#0D0D0D' : 'transparent',
              color: isActive ? '#FFF' : '#666',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t.label}
            <span style={{
              background: isActive ? 'rgba(255,255,255,0.2)' : '#F0F0F0',
              color: isActive ? '#FFF' : '#666',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 999,
              padding: '1px 7px',
            }}>
              {counts[t.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export interface CitasListProps {
  days: DayTab[]
  appointments: CitaCardProps[]
  onNewCita?: () => void
  onViewCita?: (id: string) => void
  onConfirm?: (id: string) => void
  onComplete?: (id: string) => void
  onReschedule?: (id: string) => void
  onCancel?: (id: string) => void
}

export default function CitasList({
  days,
  appointments,
  onNewCita,
  onViewCita,
  onConfirm,
  onComplete,
  onReschedule,
  onCancel,
}: CitasListProps) {
  const today = days.find(d => d.dayShort === 'Mié')?.date ?? days[0]?.date ?? ''
  const [activeDate, setActiveDate] = useState(today)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Filtrar por fecha y estado
  const filtered = appointments.filter(a => {
    const dateMatch = true // En real: comparar a.scheduledAt con activeDate
    const statusMatch = statusFilter === 'all' || a.status === statusFilter
    return dateMatch && statusMatch
  })

  // Contar por estado
  const counts: Record<StatusFilter, number> = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  // Agrupar por fecha display
  const activeDayObj = days.find(d => d.date === activeDate)
  const dateLabel = activeDayObj
    ? `Miércoles, ${activeDayObj.dayNum} de Mayo`   // TODO: formatear dinámicamente
    : ''

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
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>☰</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>Citas</div>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', position: 'relative' }}>
            🔔
          </button>
        </div>

        {/* Strip de días */}
        <DateStrip days={days} activeDate={activeDate} onSelect={setActiveDate} />

        {/* Divider */}
        <div style={{ height: 1, background: '#F0F0F0', margin: '8px 0 0' }} />

        {/* Tabs */}
        <div style={{ padding: '12px 0 12px' }}>
          <StatusTabs counts={counts} active={statusFilter} onSelect={setStatusFilter} />
        </div>
      </div>

      {/* ── Lista ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Encabezado de fecha */}
        {dateLabel && (
          <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 4 }}>
            {dateLabel}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            paddingTop: 60,
          }}>
            <div style={{ fontSize: 48 }}>📅</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0D0D0D' }}>Sin citas</div>
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>
              No hay citas para este día con los filtros seleccionados.
            </div>
          </div>
        ) : (
          filtered.map(appt => (
            <CitaCard
              key={appt.id}
              {...appt}
              onView={onViewCita}
              onConfirm={onConfirm}
              onComplete={onComplete}
              onReschedule={onReschedule}
              onCancel={onCancel}
            />
          ))
        )}

        {/* Espacio para FAB */}
        <div style={{ height: 100 }} />
      </div>

      {/* ── FAB Nueva Cita ── */}
      <button
        onClick={onNewCita}
        style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          background: '#FF6B1A',
          color: '#FFF',
          border: 'none',
          borderRadius: 999,
          padding: '12px 20px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 16px rgba(255,107,26,0.35)',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        Nueva Cita
      </button>

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
          { icon: '🏠', label: 'Inicio',    active: false },
          { icon: '📅', label: 'Citas',     active: true  },
          { icon: '+',  label: '',          active: false, isFab: true },
          { icon: '👤', label: 'Clientes',  active: false },
          { icon: '⋯',  label: 'Más',      active: false },
        ].map((item, i) => {
          if (item.isFab) return (
            <button key={i} onClick={onNewCita} style={{
              width: 56, height: 56,
              borderRadius: '50%',
              background: '#FF6B1A',
              border: 'none',
              cursor: 'pointer',
              fontSize: 28,
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,26,0.35)',
              marginTop: -20,
            }}>+</button>
          )
          return (
            <button key={i} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: item.active ? '#FF6B1A' : '#999', fontWeight: item.active ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

export const DEMO_DAYS: DayTab[] = [
  { dayShort: 'Lun', dayNum: 13, date: '2024-05-13' },
  { dayShort: 'Mar', dayNum: 14, date: '2024-05-14' },
  { dayShort: 'Mié', dayNum: 15, date: '2024-05-15' },
  { dayShort: 'Jue', dayNum: 16, date: '2024-05-16' },
  { dayShort: 'Vie', dayNum: 17, date: '2024-05-17' },
  { dayShort: 'Sáb', dayNum: 18, date: '2024-05-18' },
  { dayShort: 'Dom', dayNum: 19, date: '2024-05-19' },
]

export const DEMO_APPOINTMENTS: CitaCardProps[] = [
  { id: '1', time: '09:00 AM', clientName: 'Juan Pérez',    clientPhone: '555 987 6543', service: 'Corte clásico',        status: 'pending',   price: 200 },
  { id: '2', time: '10:30 AM', clientName: 'Carlos Mendoza',clientPhone: '555 123 4567', service: 'Corte clásico + Barba',status: 'confirmed', price: 270 },
  { id: '3', time: '12:00 PM', clientName: 'Luis Ramírez',  clientPhone: '555 456 7890', service: 'Degradado + Barba',    status: 'confirmed', price: 250 },
  { id: '4', time: '02:00 PM', clientName: 'Andrés Gómez',  clientPhone: '555 321 9876', service: 'Corte + Diseño',       status: 'pending',   price: 300 },
  { id: '5', time: '03:30 PM', clientName: 'Miguel Torres', clientPhone: '555 654 3210', service: 'Corte clásico',        status: 'confirmed', price: 200 },
  { id: '6', time: '05:00 PM', clientName: 'David Sánchez', clientPhone: '555 789 1234', service: 'Degradado + Barba',    status: 'pending',   price: 250 },
]
