// AMADOBOOK — ClientesList.tsx
// Lista de clientes del admin con buscador, filtro, tabs y stats
// Ruta: /admin/clientes

'use client'

import { useState, useMemo } from 'react'
import ClienteCard, { ClienteCardProps } from './ClienteCard'

type TabFilter = 'all' | 'active' | 'new' | 'inactive'

export interface ClientesListProps {
  clients: ClienteCardProps[]
  totalClients: number
  activeClients: number
  newThisMonth: number
  onNewCliente?: () => void
  onView?: (id: string) => void
  onNewCita?: (id: string) => void
  onHistorial?: (id: string) => void
  onEdit?: (id: string) => void
  onCall?: (phone: string) => void
  onMessage?: (phone: string) => void
}

export default function ClientesList({
  clients,
  totalClients,
  activeClients,
  newThisMonth,
  onNewCliente,
  onView,
  onNewCita,
  onHistorial,
  onEdit,
  onCall,
  onMessage,
}: ClientesListProps) {
  const [tab, setTab] = useState<TabFilter>('all')
  const [query, setQuery] = useState('')

  const inactiveClients = totalClients - activeClients

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: 'all',      label: 'Todos',     count: totalClients   },
    { key: 'active',   label: 'Activos',   count: activeClients  },
    { key: 'new',      label: 'Nuevos',    count: newThisMonth   },
    { key: 'inactive', label: 'Inactivos', count: inactiveClients },
  ]

  const filtered = useMemo(() => {
    let list = clients
    if (tab === 'active')   list = list.filter(c => c.status === 'active')
    if (tab === 'inactive') list = list.filter(c => c.status === 'inactive')
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.phone.includes(q)
      )
    }
    return list
  }, [clients, tab, query])

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>☰</button>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>Clientes</div>
          </div>
          <button
            onClick={onNewCliente}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#0D0D0D', border: 'none', cursor: 'pointer',
              color: '#FFF', fontSize: 20, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}
          >
            +
          </button>
        </div>

        {/* Buscador */}
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', fontSize: 15, color: '#999',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%', height: 44,
                paddingLeft: 38, paddingRight: 12,
                background: '#F5F5F5', border: 'none',
                borderRadius: 12, fontSize: 14, color: '#0D0D0D',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#F5F5F5', border: 'none', cursor: 'pointer',
            fontSize: 16, flexShrink: 0,
          }}>
            ⚙️
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '0 16px 14px',
        }}>
          <div style={{
            background: '#F5F5F5', borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>👥</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0D0D0D' }}>{totalClients}</div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>Total clientes</div>
            </div>
          </div>
          <div style={{
            background: '#F5F5F5', borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>✓</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0D0D0D' }}>{activeClients}</div>
              <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 500 }}>Clientes activos</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '0 16px 14px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {tabs.map(t => {
            const isActive = t.key === tab
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
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
                  fontSize: 11, fontWeight: 600,
                  borderRadius: 999, padding: '1px 7px',
                }}>
                  {t.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Lista ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', paddingTop: 60, gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>👤</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0D0D0D' }}>Sin clientes</div>
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>
              {query ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no hay clientes en esta categoría.'}
            </div>
            {!query && (
              <button
                onClick={onNewCliente}
                style={{
                  marginTop: 8, padding: '12px 24px',
                  background: '#FF6B1A', color: '#FFF',
                  border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                + Agregar cliente
              </button>
            )}
          </div>
        ) : (
          filtered.map(client => (
            <ClienteCard
              key={client.id}
              {...client}
              onView={onView}
              onNewCita={onNewCita}
              onHistorial={onHistorial}
              onEdit={onEdit}
              onCall={onCall}
              onMessage={onMessage}
            />
          ))
        )}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{
        height: 80, background: '#FFF', borderTop: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)', flexShrink: 0,
      }}>
        {[
          { icon: '🏠', label: 'Inicio',   active: false },
          { icon: '📅', label: 'Citas',    active: false },
          { icon: '+',  label: '',         isFab: true   },
          { icon: '👤', label: 'Clientes', active: true  },
          { icon: '⋯',  label: 'Más',     active: false },
        ].map((item, i) => {
          if (item.isFab) return (
            <button key={i} onClick={onNewCliente} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FF6B1A', border: 'none', cursor: 'pointer',
              fontSize: 28, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,26,0.35)', marginTop: -20,
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
