'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Calendar, Users, Scissors, MoreHorizontal, Plus } from 'lucide-react'

export default function AdminBottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  const items = [
    { icon: Home,         label: 'Inicio',    path: '/admin' },
    { icon: Calendar,     label: 'Citas',     path: '/admin/citas' },
    { icon: null,         label: '',          path: '/admin/citas/nueva' }, // FAB
    { icon: Users,        label: 'Clientes',  path: '/admin/clientes' },
    { icon: MoreHorizontal, label: 'Más',     path: '/admin/servicios' },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
      background: '#FFF', borderTop: '1px solid #F0F0F0',
      display: 'flex', alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      {items.map((item, i) => {
        if (!item.icon) return (
          <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => router.push(item.path)} style={{
              width: 54, height: 54, borderRadius: '50%',
              background: '#FF6B1A', border: '4px solid #FFF',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,26,0.45)', marginTop: -20,
            }}>
              <Plus size={24} color="#FFF" />
            </button>
          </div>
        )
        const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
        const Icon = item.icon
        return (
          <button key={i} onClick={() => router.push(item.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer',
            paddingBottom: 2,
          }}>
            <Icon size={22} color={isActive ? '#FF6B1A' : '#999'} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, color: isActive ? '#FF6B1A' : '#999', fontWeight: isActive ? 700 : 400 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
