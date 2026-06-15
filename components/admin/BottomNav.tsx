'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Calendar, Users, MoreHorizontal, Plus } from 'lucide-react'

export default function AdminBottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }

  const items = [
    { icon: Home,           label: 'Inicio',    path: '/admin' },
    { icon: Calendar,       label: 'Citas',     path: '/admin/citas' },
    { icon: null,           label: '',          path: '/admin/citas/nueva' },
    { icon: Users,          label: 'Clientes',  path: '/admin/clientes' },
    { icon: MoreHorizontal, label: 'Más',       path: '/admin/servicios' },
  ]

  return (
    <>
      <div style={{ height: 'calc(72px + env(safe-area-inset-bottom, 0px))', flexShrink: 0 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
        background: '#FFF', borderTop: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100, boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
      }}>
        {items.map((item, i) => {
          if (!item.icon) return (
            <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => router.push(item.path)} style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#FF6B1A', border: '4px solid #FFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(255,107,26,0.45)', marginTop: -18,
              }}>
                <Plus size={22} color="#FFF" />
              </button>
            </div>
          )
          const active = isActive(item.path)
          const Icon = item.icon as any
          return (
            <button key={i} onClick={() => router.push(item.path)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <Icon size={22} color={active ? '#FF6B1A' : '#999'} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, color: active ? '#FF6B1A' : '#999', fontWeight: active ? 700 : 400 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
