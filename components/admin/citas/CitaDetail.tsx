// AMADOBOOK — CitaDetail.tsx
// Pantalla de detalle completo de una cita
// Ruta: /admin/citas/[id]
// Incluye: info del cliente, info de la cita, notas y acción principal

'use client'

import { useState } from 'react'
import { CitaStatus } from './CitaCard'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CitaDetailProps {
  id: string
  status: CitaStatus
  clientName: string
  clientPhone: string
  clientAvatar?: string
  service: string
  duration: number          // minutos
  scheduledDate: string     // "Miércoles, 15 de Mayo 2024"
  scheduledTime: string     // "10:00 AM"
  barber: string            // "Alex The Barber"
  price: number
  notes?: string
  onBack?: () => void
  onCall?: (phone: string) => void
  onMessage?: (phone: string) => void
  onEdit?: (id: string) => void
  onComplete?: (id: string) => void
  onReschedule?: (id: string) => void
  onCancel?: (id: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CitaStatus, { label: string; bg: string; text: string }> = {
  pending:   { label: 'Pendiente',   bg: '#FFFBEB', text: '#D97706' },
  confirmed: { label: 'Confirmada',  bg: '#F0FDF4', text: '#16A34A' },
  completed: { label: 'Completada',  bg: '#F9FAFB', text: '#6B7280' },
  cancelled: { label: 'Cancelada',   bg: '#FEF2F2', text: '#DC2626' },
  no_show:   { label: 'No asistió',  bg: '#F5F3FF', text: '#7C3AED' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Sub-componente: Fila de info ─────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 0',
      borderBottom: '1px solid #F5F5F5',
    }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: '#0D0D0D', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  )
}

// ─── Sub-componente: Botón de acción rápida ───────────────────────────────────

function ActionBtn({
  icon, label, onClick, danger = false,
}: {
  icon: string; label: string; onClick?: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 4px',
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: danger ? '#FEF2F2' : '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 12, color: danger ? '#DC2626' : '#666', fontWeight: 500 }}>{label}</span>
    </button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CitaDetail({
  id, status, clientName, clientPhone, clientAvatar,
  service, duration, scheduledDate, scheduledTime,
  barber, price, notes,
  onBack, onCall, onMessage, onEdit, onComplete, onReschedule, onCancel,
}: CitaDetailProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const cfg = STATUS_CONFIG[status]

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
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#0D0D0D', padding: 0, lineHeight: 1 }}
          >
            ←
          </button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D' }}>Detalle de Cita</div>
          {/* Menú opciones adicionales */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666', padding: 0 }}>⋯</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Card: Cliente ── */}
        <div style={{
          background: '#FFF',
          borderRadius: 16,
          padding: 20,
        }}>
          {/* Status badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{
              background: cfg.bg,
              color: cfg.text,
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 16px',
              borderRadius: 999,
            }}>
              {cfg.label}
            </span>
          </div>

          {/* Avatar grande */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: clientAvatar ? 'transparent' : '#FF6B1A',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {clientAvatar ? (
                <img src={clientAvatar} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#FFF', fontWeight: 700, fontSize: 28 }}>
                  {getInitials(clientName)}
                </span>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D' }}>{clientName}</div>
          </div>

          {/* Teléfono */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#999' }}>📞 {clientPhone}</span>
          </div>

          {/* Acciones rápidas */}
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionBtn icon="📞" label="Llamar"  onClick={() => onCall?.(clientPhone)} />
            <ActionBtn icon="💬" label="Mensaje" onClick={() => onMessage?.(clientPhone)} />
            <ActionBtn icon="✏️" label="Editar"  onClick={() => onEdit?.(id)} />
            <ActionBtn icon="⋯"  label="Más"     />
          </div>
        </div>

        {/* ── Card: Información de la cita ── */}
        <div style={{
          background: '#FFF',
          borderRadius: 16,
          padding: '4px 20px 4px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', padding: '16px 0 4px' }}>
            Información de la cita
          </div>
          <InfoRow icon="✂️" label="Servicio"  value={service} />
          <InfoRow icon="⏱"  label="Duración"  value={`${duration} min`} />
          <InfoRow icon="📅" label="Fecha"     value={scheduledDate} />
          <InfoRow icon="🕐" label="Hora"      value={scheduledTime} />
          <InfoRow icon="👤" label="Barbero"   value={barber} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '13px 0',
          }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>💰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 2 }}>Precio</div>
              <div style={{ fontSize: 14, color: '#0D0D0D', fontWeight: 700 }}>${price.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* ── Card: Notas ── */}
        {notes && (
          <div style={{
            background: '#FFF',
            borderRadius: 16,
            padding: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', marginBottom: 10 }}>Notas</div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{notes}</div>
          </div>
        )}

        {/* Espacio inferior */}
        <div style={{ height: 20 }} />
      </div>

      {/* ── Botón principal de acción ── */}
      <div style={{
        background: '#FFF',
        borderTop: '1px solid #F0F0F0',
        padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Acción principal según estado */}
        {status === 'confirmed' && (
          <button
            onClick={() => onComplete?.(id)}
            style={{
              width: '100%',
              height: 52,
              background: '#0D0D0D',
              color: '#FFF',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✓ Marcar como completada
          </button>
        )}
        {status === 'pending' && (
          <button
            onClick={() => onComplete?.(id)}
            style={{
              width: '100%',
              height: 52,
              background: '#FF6B1A',
              color: '#FFF',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✓ Confirmar cita
          </button>
        )}

        {/* Cancelar (si aplica) */}
        {!['completed', 'cancelled'].includes(status) && (
          showCancelConfirm ? (
            <div style={{
              background: '#FEF2F2',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', textAlign: 'center' }}>
                ¿Confirmar cancelación?
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  style={{
                    flex: 1, height: 44, background: '#FFF', color: '#0D0D0D',
                    border: '1px solid #E5E5E5', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => { onCancel?.(id); setShowCancelConfirm(false) }}
                  style={{
                    flex: 1, height: 44, background: '#DC2626', color: '#FFF',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              style={{
                width: '100%',
                height: 44,
                background: 'none',
                color: '#DC2626',
                border: '1px solid #FECACA',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar cita
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────
export const DEMO_CITA_DETAIL: CitaDetailProps = {
  id: '2',
  status: 'confirmed',
  clientName: 'Carlos Mendoza',
  clientPhone: '555 123 4567',
  service: 'Corte clásico',
  duration: 30,
  scheduledDate: 'Miércoles, 15 de Mayo 2024',
  scheduledTime: '10:00 AM',
  barber: 'Alex The Barber',
  price: 200,
  notes: 'Cliente prefiere degradado bajo.',
}
