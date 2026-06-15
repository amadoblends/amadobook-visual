import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientesAdminClient from './ClientesAdminClient'
export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <ClientesAdminClient />
}
