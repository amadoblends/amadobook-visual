import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportesAdminClient from './ReportesAdminClient'
export default async function ReportesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <ReportesAdminClient />
}
