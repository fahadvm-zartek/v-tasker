import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readLogsPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readDashboardUi = () => readFile(new URL('../../components/dashboard-ui.tsx', import.meta.url), 'utf8');

test('chat moderation logs page matches the audit log reference view', async () => {
  const source = await readLogsPage();
  const dashboardUi = await readDashboardUi();

  for (const text of [
    'Moderation Logs',
    'A complete, immutable audit trail of every moderation decision made on VTASKER.',
    'Export CSV',
    'Total Log Entries',
    '18,204',
    '+12% this week',
    'Hard Violations',
    '61',
    '+3 from yesterday',
    'Admin-Overridden',
    '84',
    '+8.4%',
    'vs last week',
    'Avg. Time to Log',
    '0.4s',
    '-0.1s optimization',
    'Search ID, User...',
    'Final Decision: All',
    'Violations: All',
    'Risk Level: All',
    'Date Range: Last 7 Days',
    'Reset',
    'Apply',
    'Active:',
    'Hard Violation: Yes',
    'Last 7 days',
    'Mod ID',
    'Content ID',
    'User',
    'Content Preview',
    'Risk Score',
    'Violations',
    'Decision',
    'Status',
    'Timestamp',
    'Action',
    '#ML-9921',
    'C-8812A',
    'Rahul Sharma',
    'buy cheap vi...',
    '82 / 100',
    'HARD VIOLATION',
    'BLOCK',
    'Closed',
    '10:42 AM',
    '#ML-9920',
    'C-8811B',
    'Jane Doe',
    'Image attachment',
    '52 / 100',
    'NONE',
    'FLAG',
    'Open -- under review',
    '10:15 AM',
    '#ML-9919',
    'C-8810C',
    'Mike Smith',
    'Hello everyone...',
    '12 / 100',
    'ALLOW',
    'Auto-cleared',
    '09:58 AM',
    'Showing 1 to 3 of 18,204 entries',
    'Prev',
    'Next',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /<DashboardPageShell/);
  assert.match(dashboardUi, /<Sidebar\s*\/>/);
  assert.match(dashboardUi, /<Header\s*\/>/);
  assert.match(source, /const logMetricCards/);
  assert.match(source, /const moderationLogRows/);
  assert.match(source, /'use client';/);
  assert.match(source, /useState<ModerationLogDetail \| null>/);
  assert.match(source, /onClick=\{\(\) => setSelectedLog\(moderationLogDetail\)\}/);
  assert.doesNotMatch(source, /href=\{`\/chat-moderation\/logs\/\$\{row\.modId\.replace\('#', ''\)\}`\}/);
  assert.match(dashboardUi, /app-shell flex min-h-screen bg-\[#f7f8fa\]/);
  assert.match(source, /contentClassName="h-\[calc\(100vh-62px\)\] overflow-hidden px-5 py-4"/);
  assert.match(source, /<DashboardPanel className="flex min-h-0 flex-1 flex-col">/);
  assert.match(source, /grid-cols-\[120px_120px_minmax\(110px,0\.8fr\)_minmax\(160px,1fr\)_120px_150px_110px_170px_120px_80px\]/);
});

test('chat moderation logs page opens an in-page detail modal from the eye action', async () => {
  const source = await readLogsPage();

  for (const text of [
    'Moderation Log Detail',
    'MOD-2026-88301',
    'Aug 31, 2026, 1:20 PM IST',
    'CNV-88301',
    'VTK-10245',
    'Original Content',
    'Dønt pay thru VTASKER, pay me directly pls',
    'Normalized Content',
    'dont pay through vtasker pay me directly please',
    'Rule Engine Analysis',
    'Triggered Rules',
    'PAYMENT_BYPASS (+40)',
    'Hard Violation',
    'Yes',
    'Final Decision',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /fixed inset-0 z-50/);
  assert.match(source, /max-h-\[calc\(100vh-32px\)\]/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /onClick=\{onClose\}/);
  assert.match(source, /onClose=\{\(\) => setSelectedLog\(null\)\}/);
});
