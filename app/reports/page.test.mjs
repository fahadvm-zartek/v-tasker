import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readReportsPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../components/Sidebar.tsx', import.meta.url), 'utf8');

test('reports page renders the complaints dashboard from the provided reference', async () => {
  const source = await readReportsPage();

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /DashboardPageShell/);

  for (const text of [
    'Total Complaints',
    '156',
    '+5% vs last month',
    'Avg. Resolution Time',
    '4.2h',
    '-12% improvement',
    'Critical Issues',
    '12',
    'high priority',
    'Satisfaction Score',
    '4.8/5',
    '+2%',
    'Recent Complaints',
    'Search complaints...',
    'Complaint ID',
    'User',
    'Category',
    'Severity',
    'Date Filed',
    'Assigned To',
    'Status',
    'Action',
    '#CMP-1042',
    'John Smith',
    'App Issues',
    'Critical',
    'Jun 28, 2025',
    'Sarah Jenkins',
    'Pending',
    'View Detail',
    '#CMP-1041',
    'Alice Lee',
    'Payment',
    'High',
    'Jun 27, 2025',
    'Mike Davis',
    'Under Investigation',
    '#CMP-1040',
    'Robert Wilson',
    'Provider Behavior',
    'Medium',
    'Jun 26, 2025',
    'Emma Watson',
    'Resolved',
    '#CMP-1039',
    'Claire Davis',
    'Cancellation',
    'Low',
    'Jun 25, 2025',
    'Unassigned',
    'Open',
    'Showing 1 to 4 of 156 complaints',
    'Previous',
    'Next',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('sidebar exposes reports with the requested triangle alert icon', async () => {
  const source = await readSidebar();

  assert.match(source, /TriangleAlert/);
  assert.match(source, /label: 'Reports', href: '\/reports', icon: TriangleAlert/);
});
