import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ServiciosAdminClient from './ServiciosAdminClient'
export default async function ServiciosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <ServiciosAdminClient />
}
