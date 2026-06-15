import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientHome from './ClientHome'

export default async function AppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <ClientHome userId={user.id} />
}
