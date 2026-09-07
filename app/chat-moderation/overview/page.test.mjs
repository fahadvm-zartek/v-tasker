import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readOverviewPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readDashboardUi = () => readFile(new URL('../../components/dashboard-ui.tsx', import.meta.url), 'utf8');

test('chat moderation overview page matches the reference dashboard view', async () => {
  const source = await readOverviewPage();
  const dashboardUi = await readDashboardUi();

  for (const text of [
    'Chat Moderation Overview',
    'Monitor and manage user chat activities across the platform.',
    'Total Chats Reviewed',
    '18,204',
    '+12.5%',
    'Pending Moderation',
    '142',
    '+5.2%',
    'Flagged Chats',
    '356',
    '+8.4%',
    'Blocked Chats',
    '61',
    '-2.1%',
    'High Risk Chats',
    '29',
    'Requires Immediate Action',
    'Search User',
    'User ID, name, or mobile number',
    'Risk Level',
    'All levels',
    'Content Type',
    'All types',
    'Rule Category',
    'All categories',
    'Date Range',
    'Last 7 days',
    'Apply Filters',
    'Export',
    'User Details',
    'Total Chats',
    'Triggered',
    'Flagged',
    'Blocked',
    'Highest Risk Score',
    'Status',
    'Action',
    'Rahul Sharma',
    'VTK-10245',
    '82 / 100',
    'High Risk',
    'Arjun Kumar',
    'VTK-10872',
    '58 / 100',
    'Flagged',
    'Neha Thomas',
    'VTK-11439',
    '12 / 100',
    'Normal',
    'Anita Joshi',
    'VTK-14592',
    '45 / 100',
    'Vikram Singh',
    'VTK-09321',
    '91 / 100',
    'View History',
    'Showing 1 to 5 of 142 high-priority entries',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /<DashboardPageShell/);
  assert.match(dashboardUi, /<Sidebar\s*\/>/);
  assert.match(dashboardUi, /<Header\s*\/>/);
  assert.match(source, /const moderationMetrics/);
  assert.match(source, /const moderationRows/);
  assert.match(source, /href=\{`\/chat-moderation\/overview\/\$\{row\.userId\}`\}/);
  assert.match(source, /grid-cols-\[minmax\(180px,1\.1fr\)_110px_110px_110px_110px_170px_140px_150px\]/);
});
