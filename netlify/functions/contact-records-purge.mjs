// Deletes contact submission records older than 24 months, the retention the
// privacy policy states. Keys start with "YYYY-MM/<ISO time>" (contact.mjs),
// so age is read from the key without fetching the record. Scheduled
// functions run on the published deploy only.
import { getStore } from '@netlify/blobs';

const STORE = 'contact-submissions'; // same store as contact.mjs
const KEEP_MONTHS = 24;

export default async () => {
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - KEEP_MONTHS);
  const store = getStore({ name: STORE, consistency: 'strong' });
  const { blobs } = await store.list();
  let deleted = 0;
  for (const { key } of blobs) {
    const stamp = key.split('/')[1]?.split('_')[0]?.replace(/T(\d\d)-(\d\d)-(\d\d)/, 'T$1:$2:$3');
    const at = new Date(stamp);
    if (!Number.isNaN(at.getTime()) && at < cutoff) {
      await store.delete(key);
      deleted += 1;
    }
  }
  console.log(`contact-records-purge: ${deleted} of ${blobs.length} deleted (cutoff ${cutoff.toISOString()})`);
};

export const config = { schedule: '@daily' };
