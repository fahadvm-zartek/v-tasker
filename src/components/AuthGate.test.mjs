import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('auth gate redirects unauthenticated users and renders children after storage check', async () => {
  const source = await readFile(new URL('./AuthGate.tsx', import.meta.url), 'utf8');

  assert.match(source, /'use client'/);
  assert.match(source, /useRouter/);
  assert.match(source, /hasStoredAuthSession/);
  assert.match(source, /router\.replace\('\/login'\)/);
  assert.match(source, /setIsAuthorized\(true\)/);
  assert.match(source, /return <>\{children\}<\/>/);
});

test('main route group layout wraps protected pages with AuthGate', async () => {
  const source = await readFile(new URL('../app/(main)/layout.tsx', import.meta.url), 'utf8');

  assert.match(source, /import AuthGate from '..\/..\/components\/AuthGate'/);
  assert.match(source, /<AuthGate>\s*\{children\}\s*<\/AuthGate>/);
}
);

test('auth redirect prevents logged-in users from seeing auth pages', async () => {
  const [componentSource, layoutSource] = await Promise.all([
    readFile(new URL('./AuthRedirect.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/(auth)/layout.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(componentSource, /'use client'/);
  assert.match(componentSource, /useRouter/);
  assert.match(componentSource, /hasStoredAuthSession/);
  assert.match(componentSource, /router\.replace\('\/dashboard'\)/);
  assert.match(componentSource, /return null/);
  assert.match(componentSource, /return <>\{children\}<\/>/);
  assert.match(layoutSource, /import AuthRedirect from '..\/..\/components\/AuthRedirect'/);
  assert.match(layoutSource, /<AuthRedirect>\s*\{children\}\s*<\/AuthRedirect>/);
});
