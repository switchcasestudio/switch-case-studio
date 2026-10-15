// Deletes visit records older than 12 months and every daily salt older than
// today (visit.mjs), the retention the privacy policy states. Deleting the
// salt is what makes a past day's visitor hashes untraceable. Keys start with
// "YYYY-MM-DD/" or "salt/YYYY-MM-DD", so age is read from the key.
import { getStore } from '@netlify/blobs';

const STORE = 'site-visits'; // same store as visit.mjs
const KEEP_MONTHS = 12;

export default async () => {
  const today = new Date().toISOString().slice(0, 10);
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - KEEP_MONTHS);
  const cutoffDay = cutoff.toISOString().slice(0, 10);

  const store = getStore({ name: STORE, consistency: 'strong' });
  const { blobs } = await store.list();
  let visits = 0;
  let salts = 0;
  for (const { key } of blobs) {
    if (key.startsWith('salt/')) {
      if (key.slice(5) < today) {
        await store.delete(key);
        salts += 1;
      }
    } else if (key.slice(0, 10) < cutoffDay) {
      await store.delete(key);
      visits += 1;
    }
  }
  console.log(`visits-purge: ${visits} visits (before ${cutoffDay}) and ${salts} salts deleted of ${blobs.length}`);
};

export const config = { schedule: '@daily' };
