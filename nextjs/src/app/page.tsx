import { getEntries } from './now/actions';
import HomeClient from './HomeClient';

export default async function Home() {
  const entries = await getEntries();
  const latestNow = entries[0] ?? null;

  return <HomeClient latestNow={latestNow} />;
}
