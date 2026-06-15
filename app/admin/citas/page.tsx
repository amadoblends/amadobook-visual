import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CitasAdminClient from './CitasAdminClient'

export default async function CitasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <CitasAdminClient />
}
