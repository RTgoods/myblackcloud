import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=%2Fsettings')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <SettingsForm
      userId={user.id}
      email={user.email ?? ''}
      initialHandle={profile?.display_name ?? ''}
      initialRole={profile?.role ?? 'RN'}
    />
  )
}
