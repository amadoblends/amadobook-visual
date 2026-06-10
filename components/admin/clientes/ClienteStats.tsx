// AMADOBOOK — ClienteStats.tsx
// Estadísticas detalladas de un cliente: tabs Resumen / Gastos
// Ruta: /admin/clientes/[id]/estadisticas

'use client'

import { useState } from 'react'

export interface TopService {
  name: string
  count: number
  maxCount: number   // para calcular el ancho de la barra
}

export interface ClienteStatsProps {
  clientName: string
  clientAvatar?: string
  clientSince: string       // "10 Ene 2024"
  totalAppointments: number
  completed: number
  cancelled: number
  attendanceRate: number
  totalSpent: number
  avgPerAppointment: number
  monthsAsClient: number
  isVip: boolean
  topServices: TopService[]
  onBack?: () => void
}

type StatsTab = 'resumen' | 'gastos'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function StatBox({
  label, value, valueColor,
}: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div style={{ textAlign: 'center', flex: 1, padding: '0 4px' }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: valueColor ?? '#0D0D0D', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: '#999', fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

export default function ClienteStats({
  clientName, clientAvatar, clientSince,
  totalAppointments, completed, cancelled, attendanceRate,
  totalSpent, avgPerAppointment, monthsAsClient, isVip,
  topServices,
  onBack,
}: ClienteStatsProps) {
  const [activeTab, setActiveTab] = useState<StatsTab>('resumen')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: '#F5F5F5', fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430, margin: '0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#FFF',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px',
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Estadísticas del Cliente</div>
          <div style={{ width: 22 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Card: Cliente header ── */}
        <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: clientAvatar ? 'transparent' : '#FF6B1A',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {clientAvatar
                ? <img src={clientAvatar} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFF', fontWeight: 700, fontSize: 20 }}>{getInitials(clientName)}</span>
              }
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>{clientName}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>Cliente desde: {clientSince}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', marginTop: 16,
            background: '#F5F5F5', borderRadius: 10, padding: 3, gap: 2,
          }}>
            {([
              { key: 'resumen', label: 'Resumen' },
              { key: 'gastos',  label: 'Gastos'  },
            ] as { key: StatsTab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  flex: 1, padding: '8px 0',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: activeTab === t.key ? '#FFF' : 'transparent',
                  color: activeTab === t.key ? '#0D0D0D' : '#999',
                  fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400,
                  boxShadow: activeTab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 200ms',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Resumen ── */}
        {activeTab === 'resumen' && (
          <>
            {/* Stats grid 4 */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: '16px 12px' }}>
              <div style={{ display: 'flex', marginBottom: 16 }}>
                <StatBox label="Citas totales"  value={totalAppointments} />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox label="Completadas"    value={completed} valueColor="#16A34A" />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox label="Canceladas"     value={cancelled} valueColor="#DC2626" />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox label="Asistencia"     value={`${attendanceRate}%`} valueColor={attendanceRate >= 80 ? '#16A34A' : '#D97706'} />
              </div>

              <div style={{ height: 1, background: '#F5F5F5', margin: '4px 0 16px' }} />

              <div style={{ display: 'flex' }}>
                <StatBox label="Total gastado"       value={`$${totalSpent.toLocaleString()}`} />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox label="Promedio por cita"   value={`$${avgPerAppointment}`} />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox label="Meses como cliente"  value={monthsAsClient} />
                <div style={{ width: 1, background: '#F0F0F0' }} />
                <StatBox
                  label="Nivel"
                  value={isVip ? 'VIP' : 'Regular'}
                  valueColor={isVip ? '#FF6B1A' : '#666'}
                />
              </div>
            </div>

            {/* Servicios más usados */}
            <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
                Servicios más usados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topServices.map((svc, i) => (
                  <div key={i}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: 6,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0D0D0D' }}>{svc.name}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>{svc.count} veces</span>
                    </div>
                    <div style={{
                      height: 6, background: '#F0F0F0', borderRadius: 999, overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(svc.count / svc.maxCount) * 100}%`,
                        background: i === 0 ? '#FF6B1A' : '#0D0D0D',
                        borderRadius: 999,
                        transition: 'width 600ms ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tab: Gastos ── */}
        {activeTab === 'gastos' && (
          <div style={{ background: '#FFF', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>
              Detalle de gastos
            </div>

            {[
              { label: 'Total invertido',       value: `$${totalSpent.toLocaleString()}`, highlight: true },
              { label: 'Promedio por visita',    value: `$${avgPerAppointment}` },
              { label: 'Visitas completadas',    value: completed },
              { label: 'Ticket más alto',        value: '—' },
              { label: 'Ticket más bajo',        value: '—' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0',
                borderBottom: i < 4 ? '1px solid #F5F5F5' : 'none',
              }}>
                <span style={{ fontSize: 13, color: '#666' }}>{row.label}</span>
                <span style={{
                  fontSize: 14, fontWeight: 700,
                  color: row.highlight ? '#FF6B1A' : '#0D0D0D',
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
