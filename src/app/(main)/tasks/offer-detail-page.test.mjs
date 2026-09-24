import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = new URL('./[id]/offers/[offerId]/page.tsx', import.meta.url);

test('offer details never contain fabricated provider, task, price, or service claims', async () => {
  const source = await readFile(page, 'utf8');
  for (const mock of ['Mike T.', 'TSK-4421', 'House Cleaning', 'Created Oct 24, 2023', '124 reviews', '$120', '$108.00', '-$12.00', 'Hi Elena', 'Professional Cleaner', 'Background Checked', 'Top Rated', 'Estimated 4 Hours', 'Includes all cleaning supplies', '100% satisfaction guarantee']) {
    assert.equal(source.includes(mock), false, `Unexpected mock content: ${mock}`);
  }
  assert.match(source, /Loading offer details/);
  assert.match(source, /role="status"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /loadedOfferId !== offerId/);
  assert.match(source, /fetchOfferById\(offerId\)/);
  assert.match(source, /deleteOffer\(offerId\)/);
});

test('offer typography and both destructive modals use the task detail text scale', async () => {
  const source = await readFile(page, 'utf8');
  assert.match(source, /text-\[26px\] font-bold leading-8 text-\[#111827\]/);
  assert.doesNotMatch(source, /text-\[(30|54|24|22)px\]/);
  const task = await readFile(new URL('./[id]/page.tsx', import.meta.url), 'utf8');
  const modal = task.slice(task.indexOf('const DeleteTaskConfirmationModal'), task.indexOf('const FeeAdjustmentReviewModal'));
  for (const text of [source, modal]) {
    assert.match(text, /text-\[18px\] font-bold leading-6/);
    assert.match(text, /text-\[12px\] font-medium leading-5/);
  }
});
