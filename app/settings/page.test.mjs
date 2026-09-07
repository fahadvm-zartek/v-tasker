import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSettingsPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readLogoutButton = () => readFile(new URL('./LogoutButton.tsx', import.meta.url), 'utf8');
const readDashboardUi = () => readFile(new URL('../components/dashboard-ui.tsx', import.meta.url), 'utf8');

test('settings page renders the platform configuration screen instead of a placeholder', async () => {
  const source = await readSettingsPage();
  const dashboardUi = await readDashboardUi();

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /Platform Configuration/);
  assert.match(source, /Manage system-wide settings, commission rates, and content filters\./);
  assert.match(source, /<DashboardPageShell/);
  assert.match(dashboardUi, /<Sidebar\s*\/>/);
  assert.match(dashboardUi, /<Header\s*\/>/);
});

test('settings page includes commission and cancellation configuration forms', async () => {
  const source = await readSettingsPage();

  for (const text of [
    'Commission Settings',
    'Active System',
    'Standard User Commission (%)',
    'Student-Verified User Commission (%)',
    'future transactions',
    'Cancellation Settings',
    'Standard Cancellation Fee (%)',
    'Provider-Initiated Cancellation Fee (%)',
    'Grace Period (Hours)',
    'Save Changes',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('settings page includes the revenue and commission impact side panels', async () => {
  const source = await readSettingsPage();

  for (const text of [
    'Total Monthly Revenue',
    '$42,890.00',
    '+12.4% from last month',
    'Commission Impact',
    'Standard Revenue',
    '$34,200',
    'Student Revenue',
    '$8,690',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('settings page includes admin profile and logout controls', async () => {
  const source = await readSettingsPage();
  const logoutSource = await readLogoutButton().catch(() => '');

  for (const text of [
    'Admin Profile',
    'Admin User',
    'admin@alwaysvalentines.com',
    'System Administrator',
    'Last login',
    'Logout',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source + logoutSource, /LogOut/);
  assert.match(source + logoutSource, /type="button"/);
});

test('logout clears authenticated state, shows a success toast, and redirects to login', async () => {
  const logoutSource = await readLogoutButton();
  const toastSource = await readFile(new URL('../components/AppToast.tsx', import.meta.url), 'utf8').catch(() => '');

  assert.match(logoutSource, /'use client'/);
  assert.match(logoutSource, /useRouter/);
  assert.match(logoutSource, /const router = useRouter\(\)/);
  assert.match(logoutSource, /You have been successfully logged out\./);
  assert.match(logoutSource, /<AppToast/);
  assert.match(logoutSource, /title="Signed out"/);
  assert.match(logoutSource, /message=\{toastMessage\}/);
  assert.match(logoutSource, /onDismiss=\{\(\) => setToastMessage\(''\)\}/);
  assert.match(toastSource, /bg-\[#ecfdf5\]/);
  assert.match(toastSource, /border-\[#6ee7b7\]/);
  assert.match(logoutSource, /localStorage\.removeItem/);
  assert.match(logoutSource, /sessionStorage\.clear\(\)/);
  assert.match(logoutSource, /router\.replace\('\/login'\)/);
  assert.doesNotMatch(logoutSource, /alert\(/);
  assert.doesNotMatch(logoutSource, /Swal|sweetalert/i);
});
