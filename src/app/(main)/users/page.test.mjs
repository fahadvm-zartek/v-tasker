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
    'Role: Both',
    'Role: Task Doer',
    'Role: Task Poster',
    'Pending Approvals',
    'Verification Status',
    'User Activity',
    'Total Suspended Users',
    'Expired Student Users',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /value: 'N\/A'/);

  for (const dummyValue of ['12,543', '5,120', '4,215', '3,208', '9,875', '2,668', '8,230', '1,420', '412', '185']) {
    assert.doesNotMatch(source, new RegExp(dummyValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(source, /value: '42'/);
});

test('users page includes the reference filters, export action, and pagination', async () => {
  const source = `${await readUsersPage()}\n${await readFilterToolbar()}`;

  for (const text of [
    'Search by name, email, or ID...',
    'Registration',
    'Activity',
    'Status',
    'Role',
    'Top Task Poster & Doer',
    'Export CSV',
    'View Profile',
    'Showing {firstItemIndex}-{lastItemIndex} of {totalUsers} users',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const dummyText of ['#CUS-0041', 'Sarah Mitchell', 'James Davis', 'Emma Wilson', 'Tom Richards', 'Alice Lee']) {
    assert.doesNotMatch(source, new RegExp(dummyText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('users page loads live users from api/users without static dummy fallback rows', async () => {
  const source = await readUsersPage();

  assert.match(source, /'use client'/);
  assert.match(source, /fetchUsersPage/);
  assert.match(source, /useEffect/);
  assert.match(source, /setUsers/);
  assert.match(source, /useState<User\[\]>\(\[\]\)/);
  assert.match(source, /setTotalUsers/);
  assert.match(source, /paginationPages/);
  assert.match(source, /activePage=\{String\(currentPage\)\}/);
  assert.match(source, /onPageChange=\{handlePageChange\}/);
  assert.match(source, /N\/A/);
  assert.doesNotMatch(source, /fallbackUsers/);
  assert.doesNotMatch(source, /useState<User\[\]>\(fallbackUsers\)/);
  assert.doesNotMatch(source, /pages=\{\['1', '2', '3', '\.\.\.', '25'\]\}/);
});

test('users page sends functional table filters to api/users query parameters', async () => {
  const [pageSource, toolbarSource] = await Promise.all([
    readUsersPage(),
    readFilterToolbar(),
  ]);

  for (const queryKey of [
    'dateJoinedAfter',
    'dateJoinedBefore',
    'isActive',
    'isEmailVerified',
    'ordering',
    'pageSize',
    'search',
    'userType',
  ]) {
    assert.match(pageSource, new RegExp(queryKey));
  }

  assert.match(pageSource, /fetchUsersPage\(\{[\s\S]*page: currentPage[\s\S]*pageSize: filters\.pageSize[\s\S]*search: filters\.search[\s\S]*userType: filters\.userType[\s\S]*isActive: filters\.isActive[\s\S]*isEmailVerified: filters\.isEmailVerified[\s\S]*ordering: filters\.ordering[\s\S]*dateJoinedAfter: filters\.dateJoinedAfter[\s\S]*dateJoinedBefore: filters\.dateJoinedBefore/);
  assert.doesNotMatch(pageSource, /phone: filters\.phone/);
  assert.doesNotMatch(pageSource, /isPhoneVerified: filters\.isPhoneVerified/);
  assert.match(pageSource, /<UsersFilterToolbar\s+filters=\{filters\}\s+onFiltersChange=\{handleFiltersChange\}/);
  assert.match(pageSource, /setCurrentPage\(1\)/);

  for (const text of [
    'Search',
    'Registration',
    'Activity',
    'Status',
    'Role',
    'Top Task Poster & Doer',
  ]) {
    assert.match(toolbarSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const removedFilter of ['Phone Verified', 'Email Verified', 'Page Size', 'Ordering', 'placeholder="Phone"']) {
    assert.doesNotMatch(toolbarSource, new RegExp(removedFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(toolbarSource, /onFiltersChange/);
  assert.match(toolbarSource, /updateFilter/);
  assert.match(toolbarSource, /clearFilters/);
});

test('users page requests 10 users per table page by default', async () => {
  const toolbarSource = await readFilterToolbar();

  assert.match(toolbarSource, /pageSize: 10/);
  assert.doesNotMatch(toolbarSource, /pageSize: 20/);
});

test('users page uses dashboard chrome and responsive table styling', async () => {
  const [source, sharedUiSource] = await Promise.all([
    readUsersPage(),
    readFile(new URL('../../../components/dashboard-ui.tsx', import.meta.url), 'utf8'),
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

  assert.match(pageSource, /<UsersFilterToolbar[\s\S]*filters=\{filters\}[\s\S]*onFiltersChange=\{handleFiltersChange\}/);
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
    'Admin',
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
