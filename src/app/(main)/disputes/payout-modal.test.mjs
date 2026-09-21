import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('payout modal opens distribution summary from the initiate payout action', async () => {
  const source = await readFile(new URL('./[id]/PayoutModal.tsx', import.meta.url), 'utf8');

  for (const literal of [
    "'use client'",
    'useState(false)',
    'isPayoutModalOpen',
    'setIsPayoutModalOpen(true)',
    'setIsPayoutModalOpen(false)',
    'INITIATE PAYOUT',
    'Distribution Summary',
    'Final payout calculation for Task #TSK-4421',
    'TOTAL DISPUTE AMOUNT',
    '$120.00',
    'BREAKDOWN',
    'Customer Refund',
    '80% of Net',
    'Provider Payout',
    '20% of Net',
    'VTasker Commission',
    'Processing Fees',
    '$0.00',
    'Back to Dispute',
    'Confirm & Process Payout',
    'aria-modal="true"',
  ]) {
    assert.match(source, new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
