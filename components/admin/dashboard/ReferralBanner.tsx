// AMADOBOOK — ReferralBanner.tsx
// Banner dismissible "Invita a tus clientes — gana descuentos y beneficios"

'use client'

import { useState } from 'react'

export interface ReferralBannerProps {
  title?: string
  body?: string
  ctaLabel?: string
  onCta?: () => void
  onDismiss?: () => void
}

export default function ReferralBanner({
  title = 'Invita a tus clientes',
  body = 'Comparte tu enlace y gana descuentos y beneficios.',
  ctaLabel = 'Invitar ahora',
  onCta,
  onDismiss,
}: ReferralBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div style={{
      background: '#0D0D0D',
      borderRadius: 16,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute', right: 60, top: -10,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,107,26,0.12)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 20, bottom: -20,
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(255,107,26,0.08)',
        pointerEvents: 'none',
      }} />

      {/* Emoji regalo */}
      <div style={{ fontSize: 36, flexShrink: 0, lineHeight: 1 }}>🎁</div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{body}</div>
        <button
          onClick={onCta}
          style={{
            marginTop: 10,
            background: '#FF6B1A', color: '#FFF',
            border: 'none', borderRadius: 8,
            padding: '7px 16px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {ctaLabel}
        </button>
      </div>

      {/* Cerrar */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: '50%',
          width: 24, height: 24, cursor: 'pointer',
          color: '#888', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  )
}
