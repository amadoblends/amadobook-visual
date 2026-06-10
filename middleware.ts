// middleware.ts
// Protege rutas y redirige según el rol del usuario
// /admin/* → solo admin
// /app/*   → solo client

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar sesión
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Rutas públicas — dejar pasar
  const publicPaths = ['/login', '/register', '/auth/callback']
  if (publicPaths.some(p => path.startsWith(p))) {
    return supabaseResponse
  }

  // Sin sesión → login
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Verificar rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'client'
  const isAdminRoute  = path.startsWith('/admin')
  const isClientRoute = path.startsWith('/app')

  // Cliente intenta entrar a /admin → redirigir a /app
  if (isAdminRoute && role !== 'admin') {
    const redirect = request.nextUrl.clone()
    redirect.pathname = '/app'
    return NextResponse.redirect(redirect)
  }

  // Admin intenta entrar a /app → redirigir a /admin
  if (isClientRoute && role !== 'client') {
    const redirect = request.nextUrl.clone()
    redirect.pathname = '/admin'
    return NextResponse.redirect(redirect)
  }

  // Raíz → redirigir según rol
  if (path === '/') {
    const redirect = request.nextUrl.clone()
    redirect.pathname = role === 'admin' ? '/admin' : '/app'
    return NextResponse.redirect(redirect)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
  ],
}
