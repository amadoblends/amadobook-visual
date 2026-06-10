// AMADOBOOK — ServiciosList.tsx
// Lista de servicios individuales con buscador, stats y botón agregar
// Ruta: /admin/servicios (tab Servicios)

'use client'

import { useState, useMemo } from 'react'
import ServicioCard, { ServicioCardProps } from './ServicioCard'

export interface ServiciosListProps {
  services: ServicioCardProps[]
  totalServices: number
  activeServices: number
  totalPackages: number
  activeOffers: number
  activeTab: 'servicios' | 'paquetes' | 'ofertas'
  onTabChange: (tab: 'servicios' | 'paquetes' | 'ofertas') => void
  onNewServicio?: () => void
  onEdit?: (id: string) => void
  onToggleActive?: (id: string, active: boolean) => void
  onDelete?: (id: string) => void
  onNotifications?: () => void
}

const TABS = [
  { key: 'servicios' as const, label: 'Servicios' },
  { key: 'paquetes'  as const, label: 'Paquetes'  },
  { key: 'ofertas'   as const, label: 'Ofertas'   },
]

export default function ServiciosList({
  services, totalServices, activeServices, totalPackages, activeOffers,
  activeTab, onTabChange,
  onNewServicio, onEdit, onToggleActive, onDelete, onNotifications,
}: ServiciosListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return services
    const q = query.toLowerCase()
    return services.filter(s => s.name.toLowerCase().includes(q))
  }, [services, query])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 16px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>☰</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>Servicios</div>
              <div style={{ fontSize: 12, color: '#999' }}>Gestiona todos los servicios de tu barbería</div>
            </div>
          </div>
          <button onClick={onNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>🔔</button>
        </div>

        {/* Buscador */}
        <div style={{ padding: '0 16px 12px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-58%)', fontSize: 15, color: '#999' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', height: 44,
              paddingLeft: 40, paddingRight: 40,
              background: '#F5F5F5', border: 'none',
              borderRadius: 12, fontSize: 14, color: '#0D0D0D',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-58%)',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 15,
          }}>⚙️</button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 10, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {[
            { label: 'Servicios', value: totalServices,   icon: '✂️', color: '#0D0D0D' },
            { label: 'Activos',   value: activeServices,  icon: '✓',  color: '#16A34A' },
            { label: 'Paquetes',  value: totalPackages,   icon: '📦', color: '#3B82F6' },
            { label: 'Ofertas',   value: activeOffers,    icon: '🏷️', color: '#FF6B1A' },
          ].map((s, i) => (
            <div key={i} style={{
              flexShrink: 0,
              background: '#F5F5F5', borderRadius: 10,
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderTop: '1px solid #F0F0F0' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                flex: 1, padding: '12px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? '#0D0D0D' : '#999',
                borderBottom: activeTab === tab.key ? '2px solid #0D0D0D' : '2px solid transparent',
                transition: 'all 200ms',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 60, gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>✂️</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0D0D0D' }}>
              {query ? 'Sin resultados' : 'Sin servicios'}
            </div>
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>
              {query ? 'No se encontró ningún servicio con ese nombre.' : 'Agrega tu primer servicio para empezar.'}
            </div>
          </div>
        ) : (
          filtered.map(svc => (
            <ServicioCard
              key={svc.id}
              {...svc}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))
        )}
        <div style={{ height: 80 }} />
      </div>

      {/* Botón agregar */}
      <div style={{
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0,
      }}>
        <button
          onClick={onNewServicio}
          style={{
            width: '100%', height: 52,
            background: '#FF6B1A', color: '#FFF',
            border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          + Agregar servicio
        </button>
      </div>
    </div>
  )
}
