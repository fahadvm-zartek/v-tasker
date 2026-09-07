import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('dashboard placeholder uses the compact layout with a fixed sidebar offset', async () => {
  const [pageSource, sidebarSource, headerSource, placeholderSource] = await Promise.all([
    readFile(new URL('../page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./Header.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./DashboardPlaceholderPage.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(pageSource, /<OverviewDashboard\s*\/>/);
  assert.match(placeholderSource, /<Sidebar\s*\/>/);
  assert.match(sidebarSource, /w-\[var\(--layout-sidebar-current\)\]/);
  assert.match(sidebarSource, /bg-white/);
  assert.match(pageSource, /pl-\[var\(--layout-sidebar-current\)\]/);
  assert.match(pageSource, /px-8/);
  assert.doesNotMatch(pageSource, /max-w-\[1440px\]/);
  assert.match(headerSource, /placeholder="Search dashboard\.\.\."/);
  assert.match(pageSource, /dashboard-container/);
});

test('dashboard top chrome matches the reference screenshot sizing', async () => {
  const [pageSource, sidebarSource, headerSource] = await Promise.all([
    readFile(new URL('../page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./Header.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(pageSource, /bg-\[#f7f8fa\]/);
  assert.match(pageSource, /pl-\[var\(--layout-sidebar-current\)\]/);
  assert.match(pageSource, /px-8/);
  assert.match(sidebarSource, /w-\[var\(--layout-sidebar-current\)\]/);
  assert.match(sidebarSource, /h-\[64px\]/);
  assert.match(sidebarSource, /px-5/);
  assert.match(headerSource, /h-\[62px\]/);
  assert.match(headerSource, /border-b border-\[#e2e7ef\]/);
  assert.match(headerSource, /max-w-\[384px\]/);
  assert.match(headerSource, /h-\[40px\]/);
  assert.match(headerSource, /rounded-\[7px\]/);
  assert.doesNotMatch(pageSource, /zoom:|scale\(/);
  assert.doesNotMatch(headerSource, /zoom:|scale\(/);
});

test('sidebar navigation uses real routes and pathname-based active state', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /'use client'/);
  assert.match(sidebarSource, /from 'next\/link'/);
  assert.match(sidebarSource, /usePathname/);
  assert.match(sidebarSource, /const pathname = usePathname\(\)/);
  assert.match(sidebarSource, /<Link/);
  assert.match(sidebarSource, /aria-current=\{isActive \? 'page' : undefined\}/);
  assert.doesNotMatch(sidebarSource, /href: '#'/);
});

test('sidebar exposes service categories with a category icon', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /Tags/);
  assert.match(sidebarSource, /label: 'Service Categories', href: '\/service-categories', icon: Tags/);
});

test('sidebar includes chat moderation as a parent item with nested routes', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  for (const text of [
    'Chat Moderation',
    "href: '/chat-moderation/overview'",
    'Overview',
    '/chat-moderation/overview',
    'Moderation Logs',
    '/chat-moderation/logs',
    'Rules',
    '/chat-moderation/rules',
    'children',
    'sidebar-subnav',
    'sidebar-subnav-link',
  ]) {
    assert.match(sidebarSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(sidebarSource, /item\.children\?\.map/);
  assert.match(sidebarSource, /isActivePath\(child\.href\)/);
});

test('sidebar hides subcategories by default and expands only the selected category', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /const \[expandedMenuLabel, setExpandedMenuLabel\] = useState<string \| null>\(null\)/);
  assert.match(sidebarSource, /const isExpanded = expandedMenuLabel === item\.label/);
  assert.match(sidebarSource, /onClick=\{\(\) => setExpandedMenuLabel\(isExpanded \? null : item\.label\)\}/);
  assert.match(sidebarSource, /item\.children && isExpanded \?/);
  assert.match(sidebarSource, /aria-expanded=\{item\.children \? isExpanded : undefined\}/);
  assert.match(sidebarSource, /onClick=\{\(\) => setExpandedMenuLabel\(null\)\}/);
});

test('chat moderation overview is the default active sub-navigation state', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /label: 'Chat Moderation',\s*href: '\/chat-moderation\/overview'/);
  assert.match(sidebarSource, /const isChildActive = isActivePath\(child\.href\)/);
  assert.match(sidebarSource, /aria-current=\{isChildActive \? 'page' : undefined\}/);
  assert.match(sidebarSource, /sidebar-subnav-link relative flex h-8/);
  assert.match(sidebarSource, /bottom-1\.5 left-0 top-1\.5 w-0\.5 rounded-full bg-\[#1B3061\]/);
});

test('sidebar active tab uses soft blue active highlight state', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /isActivePath\(item\.href\)/);
  assert.match(sidebarSource, /h-\[42px\]/);
  assert.match(sidebarSource, /bg-\[#eef2ff\]/);
  assert.match(sidebarSource, /text-\[#1B3061\]/);
});

test('sidebar brand header reproduces reference branding', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /V Tasker/);
  assert.match(sidebarSource, /ADMIN PANEL/);
  assert.doesNotMatch(sidebarSource, /Always Valentines/);
  assert.doesNotMatch(sidebarSource, /SAAS ADMIN/);
  assert.match(sidebarSource, /bg-\[#1B3061\]/);
});

test('sidebar toggle button sits on the edge with polished brand interactions', async () => {
  const sidebarSource = await readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

  assert.match(sidebarSource, /aria-label=\{isCollapsed \? 'Expand sidebar' : 'Collapse sidebar'\}/);
  assert.match(sidebarSource, /-right-\[14px\]/);
  assert.match(sidebarSource, /top-\[18px\]/);
  assert.match(sidebarSource, /h-7 w-7/);
  assert.match(sidebarSource, /rounded-full/);
  assert.match(sidebarSource, /border border-\[#dfe5ef\]/);
  assert.match(sidebarSource, /bg-white/);
  assert.match(sidebarSource, /text-\[#1B3061\]/);
  assert.match(sidebarSource, /shadow-\[0_8px_20px_rgba\(27,48,97,0\.16\)\]/);
  assert.match(sidebarSource, /hover:border-\[#E68A2E\]/);
  assert.match(sidebarSource, /hover:text-\[#E68A2E\]/);
  assert.match(sidebarSource, /focus-visible:ring-\[#E68A2E\]\/30/);
  assert.match(sidebarSource, /transition-all/);
  assert.match(sidebarSource, /ChevronLeft/);
  assert.match(sidebarSource, /ChevronRight/);
  assert.match(sidebarSource, /ToggleIcon size=\{15\}/);
});

test('sidebar toggle collapses the sidebar and updates the page content offset', async () => {
  const [sidebarSource, pageSource, placeholderSource] = await Promise.all([
    readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./DashboardPlaceholderPage.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(sidebarSource, /useState\(getInitialSidebarCollapsed\)/);
  assert.match(sidebarSource, /setIsCollapsed\(\(current\) => !current\)/);
  assert.match(sidebarSource, /aria-expanded=\{!isCollapsed\}/);
  assert.match(sidebarSource, /aria-label=\{isCollapsed \? 'Expand sidebar' : 'Collapse sidebar'\}/);
  assert.match(sidebarSource, /document\.documentElement\.style\.setProperty\(\s*'--layout-sidebar-current'/);
  assert.match(sidebarSource, /isCollapsed \? '64px' : '256px'/);
  assert.match(sidebarSource, /ChevronRight/);
  assert.match(sidebarSource, /isCollapsed \? ChevronRight : ChevronLeft/);
  assert.match(sidebarSource, /w-\[var\(--layout-sidebar-current\)\]/);
  assert.match(sidebarSource, /opacity-0/);
  assert.match(pageSource, /pl-\[var\(--layout-sidebar-current\)\]/);
  assert.match(placeholderSource, /pl-\[var\(--layout-sidebar-current\)\]/);
});

test('sidebar collapsed state persists and is applied before hydration', async () => {
  const [sidebarSource, layoutSource, globalsSource] = await Promise.all([
    readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../layout.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../globals.css', import.meta.url), 'utf8'),
  ]);

  assert.match(sidebarSource, /SIDEBAR_STORAGE_KEY = 'v-Tasker-sidebar-collapsed'/);
  assert.match(sidebarSource, /localStorage\.getItem\(SIDEBAR_STORAGE_KEY\)/);
  assert.match(sidebarSource, /localStorage\.setItem\(SIDEBAR_STORAGE_KEY, String\(isCollapsed\)\)/);
  assert.match(sidebarSource, /document\.documentElement\.dataset\.sidebarCollapsed = String\(isCollapsed\)/);
  assert.match(layoutSource, /v-Tasker-sidebar-collapsed/);
  assert.match(layoutSource, /document\.documentElement\.dataset\.sidebarCollapsed = 'true'/);
  assert.match(layoutSource, /--layout-sidebar-current', '64px'/);
  assert.match(globalsSource, /html\[data-sidebar-collapsed="true"\]/);
});

test('collapsed sidebar shows icon-only navigation with hover tooltips', async () => {
  const [sidebarSource, globalsSource] = await Promise.all([
    readFile(new URL('./Sidebar.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../globals.css', import.meta.url), 'utf8'),
  ]);

  assert.match(sidebarSource, /className=\{itemClass\}/);
  assert.match(sidebarSource, /sidebar-nav-link/);
  assert.match(sidebarSource, /sidebar-nav-main/);
  assert.match(sidebarSource, /sidebar-label/);
  assert.match(sidebarSource, /sidebar-badge/);
  assert.match(sidebarSource, /sidebar-tooltip/);
  assert.match(sidebarSource, /role="tooltip"/);
  assert.match(sidebarSource, /\{item\.label\}/);
  assert.match(globalsSource, /\.sidebar-tooltip/);
  assert.match(globalsSource, /html\[data-sidebar-collapsed="true"\] \.sidebar-tooltip/);
  assert.match(globalsSource, /html\[data-sidebar-collapsed="true"\] \.sidebar-label/);
  assert.match(globalsSource, /html\[data-sidebar-collapsed="true"\] \.sidebar-badge/);
  assert.match(globalsSource, /html\[data-sidebar-collapsed="true"\] \.sidebar-nav-link/);
}
);

test('stat cards display task and service performance metrics from the reference', async () => {
  const overviewSource = await readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8');

  for (const text of [
    'Tasks Posted',
    '1,284',
    'Completed Tasks',
    '946',
    'Total Payments',
    '$2,48,650',
    'Total Commission',
    '$24,865',
    'Task Deletion Rate',
    '6.8%',
    'Users Requiring Review',
    '18',
    'Tasks Without Offers',
    '142',
    'Cancellation Rate',
    'Cancellations Earnings',
    '$3,210',
    'Suspended & Reported',
    'Moderations Detected',
    '356',
    'Hard Moderations',
    '61',
    'Milestone Products Total',
    '1,248',
    'Total Points Granted',
    '48,500',
    'Disputes',
  ]) {
    assert.match(overviewSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('overview dashboard uses the reference scrollable analytics layout', async () => {
  const overviewSource = await readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8');

  assert.match(overviewSource, /max-h-\[calc\(100vh-94px\)\] overflow-y-auto/);
  assert.match(overviewSource, /grid-cols-\[repeat\(5,minmax\(0,1fr\)\)\]/);
  assert.match(overviewSource, /xl:grid-cols-\[minmax\(0,1fr\)_minmax\(320px,0\.42fr\)\]/);
  assert.match(overviewSource, /<TasksTable(?:\s+className="h-full")?\s*\/>/);
  assert.match(overviewSource, /Top Services \(Above 25%\)/);
  assert.match(overviewSource, /Top Category/);
  assert.match(overviewSource, /All Categories/);
  assert.match(overviewSource, /All Services/);
  assert.match(overviewSource, /All Statuses/);
  assert.match(overviewSource, /Today/);
  assert.match(overviewSource, /24 Oct, 2023/);
  assert.match(overviewSource, /Export Report/);
  assert.doesNotMatch(overviewSource, /zoom:|transform: scale|scale-\[/);
});

test('tasks posted table fits its rows without extra bottom whitespace', async () => {
  const [overviewSource, tasksTableSource] = await Promise.all([
    readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./TasksTable.tsx', import.meta.url), 'utf8'),
  ]);

  assert.doesNotMatch(overviewSource, /items-stretch/);
  assert.match(overviewSource, /xl:grid-cols-\[minmax\(0,1fr\)_minmax\(320px,0\.42fr\)\]/);
  assert.match(overviewSource, /<div className="min-w-0">[\s\S]*<TasksTable \/>/);
  assert.match(overviewSource, /<aside className="space-y-5">/);
  assert.doesNotMatch(overviewSource, /<TasksTable className="h-full" \/>/);
  assert.match(tasksTableSource, /className\?: string/);
  assert.match(tasksTableSource, /<section className=\{`ui-card \$\{className \?\? ''\}`\}>/);
});

test('dashboard adds minimal reduced-motion-safe animations', async () => {
  const [globalsSource, overviewSource, lockedOverlaySource] = await Promise.all([
    readFile(new URL('../globals.css', import.meta.url), 'utf8'),
    readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./LockedOverlay.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(globalsSource, /@keyframes dashboard-fade-up/);
  assert.match(globalsSource, /\.animate-dashboard-entry/);
  assert.match(globalsSource, /\.dashboard-interactive:hover/);
  assert.match(globalsSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(globalsSource, /animation: none/);
  assert.match(globalsSource, /transform: none/);
  assert.match(overviewSource, /animate-dashboard-entry/);
  assert.match(overviewSource, /dashboard-interactive/);
  assert.match(lockedOverlaySource, /animate-dashboard-entry/);
  assert.doesNotMatch(globalsSource, /zoom:|scale\(/);
}
);

test('overview dashboard reproduces task tables and service breakdown panels', async () => {
  const [overviewSource, tasksTableSource] = await Promise.all([
    readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./TasksTable.tsx', import.meta.url), 'utf8'),
  ]);

  for (const text of [
    'House Cleaning',
    'Plumbing Repair',
    'Electrical Work',
    'In Person',
    'Professional',
    'Online',
    'Others',
    'Open Dispute',
    'Closed Dispute',
  ]) {
    assert.match(overviewSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const text of ['#TSK-4412', 'Regular Cleaning', 'Alexander Sterling']) {
    assert.match(tasksTableSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('dashboard components use the shared brand color tokens', async () => {
  const [globalsSource, pageSource, overviewSource] = await Promise.all([
    readFile(new URL('../globals.css', import.meta.url), 'utf8'),
    readFile(new URL('../page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./OverviewDashboard.tsx', import.meta.url), 'utf8'),
  ]);

  for (const token of [
    '--color-primary',
    '--color-accent',
    '--color-surface',
    '--color-border',
  ]) {
    assert.match(globalsSource, new RegExp(token));
  }

  assert.match(globalsSource, /#1B3061/);
  assert.match(globalsSource, /#E68A2E/);
  assert.match(pageSource, /OverviewDashboard/);
  assert.match(overviewSource, /Export Report/);
});

test('dashboard renders a locked Coming soon... overlay', async () => {
  const [placeholderSource, lockedOverlaySource, indexSource] = await Promise.all([
    readFile(new URL('./DashboardPlaceholderPage.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./LockedOverlay.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./index.ts', import.meta.url), 'utf8'),
  ]);

  assert.match(placeholderSource, /<LockedOverlay\s*\/>/);
  assert.match(indexSource, /LockedOverlay/);
  assert.match(lockedOverlaySource, /Page Locked/);
  assert.match(lockedOverlaySource, /Coming soon\.\.\./);
  assert.doesNotMatch(lockedOverlaySource, /fixed inset-0/);
  assert.match(lockedOverlaySource, /absolute inset-0/);
  assert.match(lockedOverlaySource, /z-\[60\]/);
  assert.match(placeholderSource, /<section className="relative min-h-\[calc\(100vh-134px\)\]" aria-label=\{\`\$\{title\} coming soon\`\}>[\s\S]*<LockedOverlay\s*\/>[\s\S]*<\/section>/);
});

test('locked overlay covers only the main content while keeping sidebar untouched', async () => {
  const [placeholderSource, lockedOverlaySource] = await Promise.all([
    readFile(new URL('./DashboardPlaceholderPage.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./LockedOverlay.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(placeholderSource, /<Sidebar\s*\/>[\s\S]*<main className="[^"]*relative[^"]*pl-\[var\(--layout-sidebar-current\)\][^"]*"/);
  assert.match(placeholderSource, /<Header\s*\/>[\s\S]*<div className="dashboard-container/);
  assert.match(placeholderSource, /<section className="relative min-h-\[calc\(100vh-134px\)\]" aria-label=\{\`\$\{title\} coming soon\`\}>[\s\S]*<LockedOverlay\s*\/>[\s\S]*<\/section>/);
  assert.doesNotMatch(placeholderSource, /<\/div>\s*<LockedOverlay\s*\/>\s*<\/main>/);
  assert.match(lockedOverlaySource, /absolute inset-0 z-\[60\] flex items-center justify-center px-6 py-10/);
  assert.match(lockedOverlaySource, /aria-hidden="true"/);
  assert.match(lockedOverlaySource, /bg-slate-950\/\[0\.10\]/);
  assert.match(lockedOverlaySource, /backdrop-blur-\[2px\]/);
  assert.match(lockedOverlaySource, /relative z-10 w-full max-w-\[460px\]/);
  assert.match(lockedOverlaySource, /rounded-\[18px\]/);
  assert.match(lockedOverlaySource, /border border-\[#dbe3ef\]/);
  assert.match(lockedOverlaySource, /bg-white/);
  assert.match(lockedOverlaySource, /shadow-\[0_24px_70px_rgba\(15,23,42,0\.18\)\]/);
  assert.match(lockedOverlaySource, /h-16 w-16/);
  assert.match(lockedOverlaySource, /text-\[28px\]/);
  assert.match(lockedOverlaySource, /text-\[15px\]/);
  assert.doesNotMatch(lockedOverlaySource, /fixed inset-0/);
  assert.doesNotMatch(lockedOverlaySource, /Sidebar/);
});
