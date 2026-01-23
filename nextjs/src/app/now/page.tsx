import { createClient } from '@/lib/supabase/server';
import { getEntries } from './actions';
import NowContent from './NowContent';

const ALLOWED_EMAIL = 'zittiandrei@yahoo.com';

export default async function NowPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const entries = await getEntries();

  const canEdit = !!user && user.email === ALLOWED_EMAIL;

  return <NowContent entries={entries} canEdit={canEdit} />;
}
