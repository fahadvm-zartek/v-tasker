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
    'DashboardPageHeader',
    'DashboardMetricCard',
    'DashboardPanel',
    'DashboardTableShell',
    'DashboardPagination',
    'DashboardIconButton',
    'DashboardSearchField',
    'DashboardSelectButton',
    'DashboardPrimaryButton',
    'DashboardSecondaryButton',
    'dashboardButtonClass',
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

test('global dashboard design tokens define the shared admin surface system', async () => {
  const globalsSource = await read('../globals.css');

  for (const token of [
    '--font-admin: Arial, Helvetica, sans-serif',
    '--space-page-x: 32px',
    '--space-page-y: 20px',
    '--card-radius: 10px',
    '--control-radius: 7px',
    '--table-header-height: 42px',
    '--table-row-height: 58px',
    '.ui-control',
    '.ui-button-primary',
    '.ui-button-secondary',
    '.ui-pagination-button',
  ]) {
    assert.match(globalsSource, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('admin primary action styling uses sidebar navy instead of bright reference blue', async () => {
  const checkedFiles = [
    './dashboard-ui.tsx',
    './Sidebar.tsx',
    '../users/page.tsx',
    '../users/UsersFilterToolbar.tsx',
  ];

  const sources = await Promise.all(checkedFiles.map((path) => read(path)));

  for (const source of sources) {
    assert.match(source, /#1B3061|var\(--color-primary\)/);
    assert.doesNotMatch(source, /bg-\[#2563eb\]|hover:bg-\[#1d4ed8\]|rgba\(37,99,235/);
  }
});

test('list-heavy admin pages compose shared table and pagination primitives', async () => {
  const checkedFiles = [
    '../payment/page.tsx',
    '../rewards-platform/page.tsx',
    '../disputes/page.tsx',
    '../cancellations/page.tsx',
  ];

  const sources = await Promise.all(checkedFiles.map((path) => read(path)));

  for (const source of sources) {
    assert.match(source, /DashboardPageHeader/);
    assert.match(source, /DashboardTableShell/);
    assert.match(source, /DashboardPagination/);
    assert.doesNotMatch(source, /const PaginationFooter/);
  }
});
