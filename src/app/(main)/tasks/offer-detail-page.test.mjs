import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('offer detail page renders provider offer details from the reference', async () => {
  const source = await readFile(new URL('./[id]/offers/[offerId]/page.tsx', import.meta.url), 'utf8');

  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /params: Promise<\{ id: string; offerId: string \}>/);
  assert.match(source, /from 'next\/link'/);

  for (const text of [
    'Tasks',
    'Offer: Mike T.',
    'Task ID',
    'House Cleaning',
    '3BR',
    'In Progress',
    'Created Oct 24, 2023',
    'Mike T.',
    'Professional Cleaner',
    '4.9',
    '124 reviews',
    'Background Checked',
    'Top Rated',
    'Bid Amount',
    '$120',
    'Service Amount:',
    '$108.00',
    'Platform Fee (10%):',
    '-$12.00',
    'Fixed Price',
    'Estimated 4 Hours',
    'Offer Description',
    'Hi Elena, I have 5 years of experience in residential cleaning and can bring my own equipment.',
    'View Task Timeline',
    'Service Terms',
    'Includes all cleaning supplies',
    '4-hour service duration',
    '100% satisfaction guarantee',
    'Message Provider',
    'Remove Offer',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
