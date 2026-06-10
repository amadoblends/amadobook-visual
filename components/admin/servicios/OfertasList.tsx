// AMADOBOOK — OfertasList.tsx
// Lista de ofertas con tabs Activas / Próximas / Finalizadas
// Ruta: /admin/servicios (tab Ofertas)

'use client'

import { useState } from 'react'
import OfertaCard, { OfertaCardProps, OfertaStatus } from './OfertaCard'

export interface OfertasListProps {
  offers: OfertaCardProps[]
  activeCount: number
  scheduledCount: number
  finishedCount: number
  activeTab: 'servicios' | 'paquetes' | 'ofertas'
  onTabChange: (tab: 'servicios' | 'paquetes' | 'ofertas') => void
  onNewOferta?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

type StatusFilter = 'active' | 'scheduled' | 'finished'

export default function OfertasList({
  offers, activeCount, scheduledCount, finishedCount,
  activeTab, onTabChange,
  onNewOferta, onEdit, onDelete,
}: OfertasListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

  const filtered = offers.filter(o => o.status === statusFilter)

  const STATUS_TABS: { key: StatusFilter; label: string; count: number; icon: string }[] = [
    { key: 'active',    label: 'Activas',     count: activeCount,    icon: '✓' },
    { key: 'scheduled', label: 'Próximas',    count: scheduledCount, icon: '⏳' },
    { key: 'finished',  label: 'Finalizadas', count: finishedCount,  icon: '✗' },
  ]

  const PAGE_TABS = [
    { key: 'servicios' as const, label: 'Servicios' },
    { key: 'paquetes'  as const, label: 'Paquetes'  },
    { key: 'ofertas'   as const, label: 'Ofertas'   },
  ]

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
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>Ofertas</div>
              <div style={{ fontSize: 12, color: '#999' }}>Administra las ofertas de tu barbería</div>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>🔔</button>
        </div>

        {/* Buscador */}
        <div style={{ padding: '0 16px 12px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-58%)', fontSize: 15, color: '#999' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar oferta..."
            style={{
              width: '100%', height: 44, paddingLeft: 40,
              background: '#F5F5F5', border: 'none',
              borderRadius: 12, fontSize: 14, color: '#0D0D0D',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tabs de estado (Activas / Próximas / Finalizadas) */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 999,
                border: statusFilter === t.key ? 'none' : '1px solid #E5E5E5',
                background: statusFilter === t.key ? '#0D0D0D' : 'transparent',
                color: statusFilter === t.key ? '#FFF' : '#666',
                fontSize: 13, fontWeight: statusFilter === t.key ? 600 : 400,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {t.icon} {t.label}
              <span style={{
                background: statusFilter === t.key ? 'rgba(255,255,255,0.2)' : '#F0F0F0',
                color: statusFilter === t.key ? '#FFF' : '#666',
                fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '1px 7px',
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tabs de página */}
        <div style={{ display: 'flex', borderTop: '1px solid #F0F0F0' }}>
          {PAGE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                flex: 1, padding: '12px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? '#0D0D0D' : '#999',
                borderBottom: activeTab === tab.key ? '2px solid #0D0D0D' : '2px solid transparent',
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ fontSize: 48 }}>🏷️</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0D0D0D' }}>Sin ofertas {statusFilter === 'active' ? 'activas' : statusFilter === 'scheduled' ? 'programadas' : 'finalizadas'}</div>
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>Crea una nueva oferta para atraer más clientes.</div>
          </div>
        ) : (
          filtered.map(offer => (
            <OfertaCard
              key={offer.id}
              {...offer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
        <div style={{ height: 80 }} />
      </div>

      {/* Botón crear */}
      <div style={{
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #F0F0F0', background: '#FFF', flexShrink: 0,
      }}>
        <button
          onClick={onNewOferta}
          style={{
            width: '100%', height: 52, background: '#FF6B1A', color: '#FFF',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          + Crear oferta
        </button>
      </div>
    </div>
  )
}
