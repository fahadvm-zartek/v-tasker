import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('cancellations page renders the resolution center cancellations dashboard', async () => {
  const source = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');

  for (const literal of [
    'DashboardPageShell',
    'DashboardPanel',
    'ResolutionTabs',
    'Disputes',
    'Cancellations',
    "href: '/disputes'",
    "href: '/cancellations'",
    'Total Cancellations',
    'Task Cancellations',
    'Payment Cancellations',
    'Booking & Service Cancellations',
    'All Cancellations (Tasks, Payments & Bookings)',
    'Filter by cancellation type, cause, refund stage, or initiating party.',
    'Search Cancellation ID, Task, or User...',
    'All Cancellation Types',
    'All Causes',
    'All Statuses',
    'Latest',
    'Export CSV',
    'CANCELLATION ID',
    'CANCELLATION TYPE',
    'INITIATED BY',
    'REASON / CAUSE',
    'AMOUNT',
    'STATUS',
    '#CAN-8824',
    'Payment Cancellation',
    'Auth Expired / Insufficient Funds',
    'Payment Cancelled',
    'Showing 1 to 7 of 48 cancellation entries',
  ]) {
    assert.match(source, new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
