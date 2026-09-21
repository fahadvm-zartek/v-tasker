import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('root layout uses Next Script for the pre-hydration sidebar state', async () => {
  const source = await readFile(new URL('./layout.tsx', import.meta.url), 'utf8');

  assert.match(source, /from "next\/script"/);
  assert.match(source, /<Script/);
  assert.match(source, /strategy="beforeInteractive"/);
  assert.match(source, /v-Tasker-sidebar-collapsed/);
  assert.doesNotMatch(source, /<head>/);
  assert.doesNotMatch(source, /<\/head>/);
});
