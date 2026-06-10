// AMADOBOOK — NewCita_Step2_Cliente.tsx
// Paso 2 del stepper "Nueva Cita" (admin)
// Seleccionar cliente: frecuentes arriba + buscador + ver todos

'use client'

import { useState, useMemo } from 'react'

export interface Cliente {
  id: string
  name: string
  phone: string
  avatar?: string
  appointmentCount?: number
}

export interface Step2ClienteProps {
  clients: Cliente[]
  frequentClients?: Cliente[]    // Los más recurrentes (top 5-6)
  onNext: (clientId: string) => void
  onBack?: () => void
  onViewAll?: () => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Servicio', 'Cliente', 'Fecha y Hora', 'Confirmar']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 16px', gap: 0 }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current, active = n === current
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, background: done ? '#0D0D0D' : '#E5E5E5', zIndex: 0 }} />
            )}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', zIndex: 1, flexShrink: 0,
              background: done || active ? '#0D0D0D' : '#E5E5E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? '0 0 0 3px rgba(13,13,13,0.1)' : 'none',
            }}>
              {done
                ? <span style={{ color: '#FFF', fontSize: 13, fontWeight: 700 }}>✓</span>
                : <span style={{ color: active ? '#FFF' : '#999', fontSize: 12, fontWeight: 700 }}>{n}</span>
              }
            </div>
            <span style={{ fontSize: 10, color: active ? '#0D0D0D' : '#999', fontWeight: active ? 700 : 400, textAlign: 'center', lineHeight: 1.2 }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ClientRow({
  client, selected, onSelect,
}: { client: Cliente; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 0',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid #F5F5F5',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: selected ? '#FF6B1A' : '#F5F5F5',
        overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 200ms',
      }}>
        {client.avatar ? (
          <img src={client.avatar} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: selected ? '#FFF' : '#666', fontWeight: 700, fontSize: 14 }}>
            {getInitials(client.name)}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{client.name}</div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{client.phone}</div>
      </div>

      {/* Radio */}
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: selected ? 'none' : '2px solid #E5E5E5',
        background: selected ? '#FF6B1A' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'all 200ms',
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFF' }} />}
      </div>
    </button>
  )
}

export default function NewCita_Step2_Cliente({
  clients, frequentClients, onNext, onBack, onViewAll,
}: Step2ClienteProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const frequent = frequentClients ?? clients.slice(0, 5)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q)
    )
  }, [query, clients])

  const showSearch = query.trim().length > 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF', fontFamily: "'DM Sans', sans-serif", maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Nueva Cita</div>
          <div style={{ width: 22 }} />
        </div>
        <div style={{ paddingBottom: 20 }}>
          <StepIndicator current={2} />
        </div>
      </div>

      {/* Buscador */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#999' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              height: 46,
              paddingLeft: 42,
              paddingRight: 42,
              background: '#F5F5F5',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              color: '#0D0D0D',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {/* Filtro */}
          <button style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
          }}>⚙️</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {showSearch ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#999', padding: '8px 0 4px' }}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </div>
            {filtered.map(c => (
              <ClientRow key={c.id} client={c} selected={selected === c.id} onSelect={() => setSelected(c.id)} />
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#999', fontSize: 14 }}>
                No se encontraron clientes
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, color: '#999', padding: '8px 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
              Clientes frecuentes
            </div>
            {frequent.map(c => (
              <ClientRow key={c.id} client={c} selected={selected === c.id} onSelect={() => setSelected(c.id)} />
            ))}
            {/* Ver todos */}
            <button
              onClick={onViewAll}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '14px 0',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 13, color: '#FF6B1A', fontWeight: 600 }}>Ver todos los clientes</span>
              <span style={{ fontSize: 16, color: '#FF6B1A' }}>›</span>
            </button>
          </>
        )}
      </div>

      {/* Siguiente */}
      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #F0F0F0', background: '#FFF' }}>
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          style={{
            width: '100%', height: 52,
            background: selected ? '#0D0D0D' : '#E5E5E5',
            color: selected ? '#FFF' : '#999',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed', transition: 'background 200ms',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export const DEMO_CLIENTS: Cliente[] = [
  { id: 'c1', name: 'Carlos Mendoza', phone: '555 123 4567', appointmentCount: 12 },
  { id: 'c2', name: 'Juan Pérez',     phone: '555 987 6543', appointmentCount: 8  },
  { id: 'c3', name: 'Luis Ramírez',   phone: '555 456 7890', appointmentCount: 15 },
  { id: 'c4', name: 'Andrés Gómez',   phone: '555 321 9876', appointmentCount: 6  },
  { id: 'c5', name: 'Miguel Torres',  phone: '555 654 3210', appointmentCount: 9  },
  { id: 'c6', name: 'David Sánchez',  phone: '555 789 1234', appointmentCount: 10 },
]
