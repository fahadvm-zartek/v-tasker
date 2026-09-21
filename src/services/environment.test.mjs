import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('public API base URL is documented through the environment template', async () => {
  const source = await readFile(new URL('../../.env.example', import.meta.url), 'utf8');

  assert.match(source, /NEXT_PUBLIC_API_BASE_URL=http:\/\/3\.106\.23\.68/);
  assert.doesNotMatch(source, /SECRET|PRIVATE|PASSWORD|TOKEN/);
});
