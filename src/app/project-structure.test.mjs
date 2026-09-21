import assert from 'node:assert/strict';
import { access, readdir } from 'node:fs/promises';
import test from 'node:test';

const exists = async (path) => {
  try {
    await access(new URL(path, import.meta.url));
    return true;
  } catch {
    return false;
  }
};

test('project uses src-based Next.js application structure', async () => {
  const rootEntries = await readdir(new URL('../../', import.meta.url));

  assert.equal(await exists('../../src/app'), true);
  assert.equal(await exists('../../src/components'), true);
  assert.equal(await exists('../../src/services'), true);
  assert.equal(rootEntries.includes('app'), false);
});

test('app routes are organized into auth and main route groups', async () => {
  const appEntries = await readdir(new URL('./', import.meta.url));

  assert.equal(await exists('./(auth)'), true);
  assert.equal(await exists('./(main)'), true);
  assert.equal(await exists('./(auth)/login/page.tsx'), true);
  assert.equal(await exists('./(auth)/register/page.tsx'), true);
  assert.equal(await exists('./(auth)/forgot-password/page.tsx'), true);
  assert.equal(await exists('./(main)/page.tsx'), true);
  assert.equal(await exists('./(main)/dashboard/page.tsx'), true);
  assert.equal(await exists('./(main)/admin/page.tsx'), true);
  assert.equal(await exists('./(main)/profile/page.tsx'), false);
  assert.equal(appEntries.includes('login'), false);
  assert.equal(appEntries.includes('forgot-password'), false);
  assert.equal(appEntries.includes('users'), false);
});

test('main app routes are wrapped in the auth gate layout', async () => {
  assert.equal(await exists('./(main)/layout.tsx'), true);
  assert.equal(await exists('../components/AuthGate.tsx'), true);
});

test('services folder does not contain Next.js route handlers', async () => {
  assert.equal(await exists('../services/api/login/route.ts'), false);
  assert.equal(await exists('../services/api/payments/route.ts'), false);
});
