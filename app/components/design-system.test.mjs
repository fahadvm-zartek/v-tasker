import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('admin pages use shared dashboard UI primitives instead of page-specific styling', async () => {
  const [uiSource, overviewSource, logsSource, rulesSource, settingsSource] =
    await Promise.all([
      read('./dashboard-ui.tsx'),
      read('../chat-moderation/overview/page.tsx'),
      read('../chat-moderation/logs/page.tsx'),
      read('../chat-moderation/rules/page.tsx'),
      read('../settings/page.tsx'),
    ]);

  for (const exportName of [
    'DashboardPageShell',
    'DashboardMetricCard',
    'DashboardPanel',
    'DashboardSearchField',
    'DashboardSelectButton',
    'DashboardPrimaryButton',
    'DashboardSecondaryButton',
    'dashboardStatusBadgeClass',
  ]) {
    assert.match(uiSource, new RegExp(`export .*${exportName}`));
  }

  for (const source of [overviewSource, logsSource, rulesSource, settingsSource]) {
    assert.match(source, /from '..\/..\/components'|from '..\/components'/);
    assert.match(source, /DashboardPageShell/);
    assert.match(source, /DashboardMetricCard|DashboardPanel/);
    assert.doesNotMatch(source, /bg-\[#004fb8\]|bg-\[#005bd8\]|text-\[#005bd8\]/);
  }
});

test('admin action styling uses sidebar navy instead of bright reference blue', async () => {
  const checkedFiles = [
    './dashboard-ui.tsx',
    './OverviewDashboard.tsx',
    './Sidebar.tsx',
    '../chat-moderation/overview/page.tsx',
    '../chat-moderation/logs/page.tsx',
    '../chat-moderation/rules/page.tsx',
    '../locations/page.tsx',
    '../reports/page.tsx',
    '../reports/[id]/page.tsx',
    '../users/page.tsx',
    '../users/[id]/page.tsx',
    '../users/UsersFilterToolbar.tsx',
  ];

  const sources = await Promise.all(checkedFiles.map((path) => read(path)));

  for (const source of sources) {
    assert.match(source, /#1B3061|var\(--color-primary\)/);
    assert.doesNotMatch(source, /#2563eb|#1d4ed8|#3b82f6|#60a5fa|rgba\(37,99,235/);
    assert.doesNotMatch(source, /blue-|indigo-|sky-|cyan-/);
  }
});
