import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');

const literals = [
  'Payments Overview',
  'Monitor revenue, commissions, and transaction flows across the platform.',
  'Export CSV',
  'Generate Report',
  'Gross Revenue',
  '$125,400',
  'Commission',
  '$18,810',
  'Net Revenue',
  '$106,590',
  'Rejection Rate',
  '3.2%',
  'Cancellations',
  '$4,250',
  'Refunds',
  '$1,890',
  'Transaction History',
  'Search transactions...',
  'All Status',
  'All Dates',
  'Sort by Amount',
  'Auto Canceled',
  'Today',
  'Last 60 Days',
  'Highest Amount',
  'Lowest Amount',
  '#TSK-8824',
  'Sarah Mitchell',
  'Alexander Sterling',
  'Paid',
  '#TSK-8823',
  'Pending',
  '30 Days',
  '#TSK-8819',
  'Processing',
  '#TSK-8795',
  'Refunded',
  '#TSK-8790',
  'Rejected',
  'Showing 1 to 5 of 1,248 entries',
];

test('payment page renders the payments overview dashboard content', () => {
  assert.doesNotMatch(source, /DashboardPlaceholderPage/);

  for (const literal of literals) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('payment page reuses dashboard shell components and icon actions', () => {
  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /DashboardSearchField/);
  assert.match(source, /DashboardPrimaryButton/);
  assert.match(source, /from 'lucide-react'/);
});

test('payment filters expose the requested dropdown option text', () => {
  assert.match(source, /statusFilterOptions = \[\s*'All',\s*'Paid',\s*'Pending',\s*'Processing',\s*'Refunded',\s*'Cancelled',\s*'Auto Canceled',\s*\]/);
  assert.match(source, /dateFilterOptions = \[\s*'All',\s*'Today',\s*'Last 7 Days',\s*'Last 7 Days',\s*'Last 30 Days',\s*'Last 60 Days',\s*\]/);
  assert.match(source, /sortFilterOptions = \[\s*'All',\s*'Highest Amount',\s*'Lowest Amount',\s*\]/);
});

test('payment page opens payment detail modals for completed and rejected payments', () => {
  for (const literal of [
    "'use client'",
    'selectedPaymentId',
    'setSelectedPaymentId',
    'paymentDetails',
    'Payment Details',
    'Premium Site Inspection',
    'Task Description',
    'Total Amount',
    'Completed',
    'Task Poster',
    'Sarah Mitchell',
    'ID: USR-992',
    'Task Provider',
    'Alexander Sterling',
    'ID: PRV-441',
    'Payment Timeline',
    'Payment Created',
    'Payment Authorized',
    'Funds Released',
    'Payment Method',
    'Visa ending in 4242',
    'Download Invoice',
    'Payment Rejected',
    'Failed Authorization',
    'Reason for Rejection',
    'ERR_INSUFFICIENT_FUNDS',
    'Insufficient funds on the cardholder account.',
    'Download Invoice / Transaction Log',
    'onClick={() => setSelectedPaymentId(transaction.taskId)}',
    'onClose={() => setSelectedPaymentId(null)}',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('payment invoice action opens the tax invoice receipt view', () => {
  for (const literal of [
    'selectedReceiptId',
    'setSelectedReceiptId',
    'PaymentReceiptModal',
    'Payment receipt',
    'Back',
    'Issued on Aug 0, 2026',
    'Bathroom cleaning',
    '$79.70',
    'Total',
    'Task receipt',
    '#A0035700522',
    'Posted by Mina S.',
    'Task cost',
    '$95.00',
    'Pricing adjustment',
    '$20.00',
    'Service fee',
    '-$25.30',
    'Cancellation fee',
    '-$10.00',
    'Net earnings',
    'Tax invoice',
    'VTASKER Limited',
    'ABN 53 149 850 457',
    '$25.30',
    'Download PDF receipt',
    'onOpenReceipt',
    'onClick={onOpenReceipt}',
    'onBack={() => setSelectedReceiptId(null)}',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('payment details modal uses compact sizing', () => {
  assert.match(source, /max-w-\[680px\]/);
  assert.match(source, /overflow-visible rounded-\[10px\]/);
  assert.match(source, /px-5 py-3/);
  assert.match(source, /space-y-3 px-5 py-3/);
  assert.match(source, /text-\[18px\] font-bold leading-6/);
  assert.match(source, /text-\[18px\] font-bold leading-6/);
  assert.match(source, /md:grid-cols-\[minmax\(0,1fr\)_190px\]/);
  assert.doesNotMatch(source, /max-w-\[920px\]/);
  assert.doesNotMatch(source, /max-w-\[760px\]/);
  assert.doesNotMatch(source, /max-h-\[calc\(100vh-32px\)\] w-full max-w-\[760px\] overflow-y-auto/);
  assert.match(source, /max-w-\[340px\]/);
});

test('rejected payment detail reason block stays compact', () => {
  assert.match(source, /rounded-\[8px\] border border-\[#fca5a5\] bg-\[#fff7f7\] px-3 py-2 text-\[#b91c1c\]/);
  assert.match(source, /flex items-start gap-3/);
  assert.match(source, /h-6 w-6 shrink-0/);
  assert.match(source, /AlertTriangle size=\{12\}/);
  assert.match(source, /text-\[11px\] font-bold uppercase leading-4/);
  assert.match(source, /mt-1\.5 text-\[10px\] font-medium leading-4/);
  assert.match(source, /mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-\[#fecaca\] pt-1\.5 text-\[9px\]/);
  assert.doesNotMatch(source, /rounded-\[8px\] border border-\[#fca5a5\] bg-\[#fff7f7\] px-5 py-4 text-\[#b91c1c\]/);
  assert.doesNotMatch(source, /rounded-\[8px\] border border-\[#fca5a5\] bg-\[#fff7f7\] px-4 py-3 text-\[#b91c1c\]/);
  assert.doesNotMatch(source, /mt-3 text-\[13px\] font-medium leading-5/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
