import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readUsersPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readFilterToolbar = async () => {
  try {
    return await readFile(new URL('./UsersFilterToolbar.tsx', import.meta.url), 'utf8');
  } catch {
    return '';
  }
};

test('users page renders the requested KPI cards and status summaries', async () => {
  const source = await readUsersPage();

  for (const text of [
    'Total Users',
    '12,543',
    'Role: Both',
    '5,120',
    'Role: Task Doer',
    '4,215',
    'Role: Task Poster',
    '3,208',
    'Pending Approvals',
    'Verification Status',
    'User Activity',
    'Total Suspended Users',
    'Expired Student Users',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('users page includes the reference filters, export action, rows, and pagination', async () => {
  const source = `${await readUsersPage()}\n${await readFilterToolbar()}`;

  for (const text of [
    'Search by name, email, or ID...',
    'Registration',
    'Activity',
    'Status',
    'Role',
    'Top Task Poster & Doer',
    'Export CSV',
    '#CUS-0041',
    'Sarah Mitchell',
    'James Davis',
    'Emma Wilson',
    'Tom Richards',
    'Alice Lee',
    'View Profile',
    'Showing 1-10 of 248 customers',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('users page uses dashboard chrome and responsive table styling', async () => {
  const [source, sharedUiSource] = await Promise.all([
    readUsersPage(),
    readFile(new URL('../components/dashboard-ui.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardMetricCard/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /DashboardPagination/);
  assert.doesNotMatch(source, /<Sidebar\s*\/>/);
  assert.doesNotMatch(source, /<Header\s*\/>/);
  assert.match(sharedUiSource, /pl-\[var\(--layout-sidebar-current\)\]/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /grid-cols-\[repeat\(auto-fit,minmax\(180px,1fr\)\)\]/);
  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
});

test('users filter toolbar matches the dropdown reference options and open styling', async () => {
  const [pageSource, toolbarSource] = await Promise.all([
    readUsersPage(),
    readFilterToolbar(),
  ]);

  assert.match(pageSource, /<UsersFilterToolbar\s*\/>/);
  assert.match(toolbarSource, /'use client'/);
  assert.match(toolbarSource, /useState/);

  for (const text of [
    'Registration',
    'All',
    'Today',
    'Weekly',
    'Monthly',
    'Yearly',
    'Activity',
    'Active Users',
    'Inactive (30 Days)',
    'Inactive (60 Days)',
    'Inactive (90 Days)',
    'Status',
    'Verified',
    'Unverified',
    'Student',
    'Reported Users',
    'Role',
    'Task Doer',
    'Task Poster',
    'Both',
    'Top Task Poster & Doer',
    'High',
    'Low',
  ]) {
    assert.match(toolbarSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(toolbarSource, /border-\[#dbe4ef\]/);
  assert.match(toolbarSource, /focus-visible:border-\[#1B3061\]/);
  assert.match(toolbarSource, /focus-visible:ring-\[#1B3061\]\/15/);
  assert.match(toolbarSource, /shadow-\[0_8px_22px_rgba\(15,23,42,0\.14\)\]/);
  assert.match(toolbarSource, /rotate-180/);
  assert.match(toolbarSource, /aria-expanded=\{isOpen\}/);
  assert.doesNotMatch(toolbarSource, /: 'border-\[#1B3061\] hover:bg-\[#fbfcfe\]'/);
});

test('users filter toolbar keeps search, filters, and export in a single row', async () => {
  const toolbarSource = await readFilterToolbar();

  assert.match(toolbarSource, /overflow-visible/);
  assert.match(toolbarSource, /flex-nowrap/);
  assert.match(toolbarSource, /shrink-0/);
  assert.match(toolbarSource, /w-\[245px\]/);
  assert.match(toolbarSource, /w-\[132px\]/);
  assert.match(toolbarSource, /w-\[154px\]/);
  assert.match(toolbarSource, /Clear Filters[\s\S]*Export CSV/);
  assert.match(toolbarSource, /<div className="flex min-w-max flex-nowrap items-center gap-2">[\s\S]*Clear Filters[\s\S]*Export CSV[\s\S]*<\/div>\s*<\/div>/);
  assert.doesNotMatch(toolbarSource, /flex flex-wrap items-center justify-between/);
  assert.doesNotMatch(toolbarSource, /flex flex-1 flex-wrap items-start/);
  assert.doesNotMatch(toolbarSource, /overflow-x-auto/);
  assert.doesNotMatch(toolbarSource, /w-\[358px\]/);
  assert.doesNotMatch(toolbarSource, /w-\[208px\]/);
});

test('users dropdowns are layered above the table and are not clipped by parent containers', async () => {
  const [pageSource, toolbarSource] = await Promise.all([
    readUsersPage(),
    readFilterToolbar(),
  ]);

  assert.match(pageSource, /<DashboardPanel className="relative overflow-visible/);
  assert.doesNotMatch(pageSource, /<section className="overflow-hidden/);
  assert.match(toolbarSource, /relative z-\[60\]/);
  assert.match(toolbarSource, /z-\[80\]/);
  assert.match(toolbarSource, /overflow-visible/);
});
