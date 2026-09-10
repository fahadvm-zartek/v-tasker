import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('dispute detail page renders poster and doer dispute tabs with admin actions', async () => {
  const source = await readFile(new URL('./[id]/page.tsx', import.meta.url), 'utf8');

  for (const literal of [
    'DashboardPageShell',
    'DashboardPanel',
    "import { PayoutModal } from './PayoutModal'",
    'Poster Dispute',
    'Doer Dispute',
    "const activeTab = tab === 'doer' ? 'doer' : 'poster'",
    'Dispute Summary',
    'Related Task',
    '#TSK-4421',
    'Date Filed',
    'Oct 24, 2023 at 14:30 EST',
    'Against (Task Poster)',
    'Raised By (Task Provider)',
    'Reason Category',
    'Complaint Description',
    'The deliverable provided does not meet the specifications outlined in the original statement of work.',
    'The client is requesting additional work not specified in the original brief',
    'Evidence & Attachments',
    'original_brief_v1.png',
    'project_logs.jpg',
    'chat_history.jpg',
    'Activity Log',
    'Admin Actions',
    'Current Status',
    'Assign Admin',
    'Resolution Notes (Internal)',
    'Payout Distribution',
    'Refund Customer',
    'Pay Provider',
    'V Tasker Commission',
    '<PayoutModal refundName={dispute.refundName} providerName={dispute.providerName} />',
    'Mark as Resolved',
  ]) {
    assert.match(source, new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
