import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('disputes page renders the resolution center disputes dashboard', async () => {
  const source = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');

  for (const literal of [
    'DashboardPageShell',
    'DashboardPageHeader',
    'DashboardMetricCard',
    'DashboardTableShell',
    'DashboardPagination',
    'ResolutionTabs',
    'Disputes',
    'Cancellations',
    "href: '/disputes'",
    "href: '/cancellations'",
    'Open Disputes',
    'Under Review',
    'Resolved',
    'Recent Disputes',
    'Status: All',
    'Category: All',
    'Date: Latest',
    'Priority: All',
    'Clear Filters',
    'Export',
    'DISPUTE ID',
    'TASK REFERENCE',
    'RAISED BY',
    'AGAINST',
    'CATEGORY',
    'STATUS',
    'DATE FILED',
    'ACTION',
    '#DIS-1142',
    '#TSK-4421',
    'Deep Cleaning',
    'Payment',
    'Dispute Raised',
    'Review',
    'href={`/disputes/${row.id.replace',
    'Showing 1 to 8 of 123 entries',
  ]) {
    assert.match(source, new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
