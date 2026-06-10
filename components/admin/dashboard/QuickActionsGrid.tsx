// AMADOBOOK — QuickActionsGrid.tsx
// Grid 2x3 de accesos rápidos del dashboard admin
// Acciones: Nueva Cita, Clientes, Servicios, Calendario, Reportes, Ingresos

'use client'

export interface QuickAction {
  id: string
  icon: string      // emoji
  label: string
  onClick?: () => void
}

export interface QuickActionsGridProps {
  actions?: QuickAction[]
  onNewCita?: () => void
  onClientes?: () => void
  onServicios?: () => void
  onCalendario?: () => void
  onReportes?: () => void
  onIngresos?: () => void
}

const DEFAULT_ACTIONS = (props: QuickActionsGridProps): QuickAction[] => [
  { id: 'nueva-cita',  icon: '📅', label: 'Nueva Cita',   onClick: props.onNewCita    },
  { id: 'clientes',    icon: '👥', label: 'Clientes',     onClick: props.onClientes   },
  { id: 'servicios',   icon: '✂️', label: 'Servicios',    onClick: props.onServicios  },
  { id: 'calendario',  icon: '🗓', label: 'Calendario',   onClick: props.onCalendario },
  { id: 'reportes',    icon: '📊', label: 'Reportes',     onClick: props.onReportes   },
  { id: 'ingresos',    icon: '💰', label: 'Ingresos',     onClick: props.onIngresos   },
]

export default function QuickActionsGrid(props: QuickActionsGridProps) {
  const actions = props.actions ?? DEFAULT_ACTIONS(props)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
    }}>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.onClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 8px',
            background: '#FFF',
            border: '1px solid #F0F0F0',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#F5F5F5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {action.icon}
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, color: '#0D0D0D',
            textAlign: 'center', lineHeight: 1.3,
          }}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
