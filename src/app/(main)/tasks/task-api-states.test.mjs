import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('task pages do not contain sample records or fabricated histories', async () => {
  const detail = await readFile(new URL('./[id]/page.tsx', import.meta.url), 'utf8');
  for (const mock of ['Mike T.', 'Samantha Taylor', 'TSK-4423', 'TSK-4424', 'DIS-5022', 'June 13, 2023', '$115.00', 'unexpected mold', 'severe scheduling conflict']) {
    assert.equal(detail.includes(mock), false, `Mock content: ${mock}`);
  }
  assert.match(detail, /No timeline available/);
  assert.match(detail, /loadedTaskId !== id/);
  assert.match(detail, /isLoadingMessages/);
  const listing = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');
  assert.match(listing, /Loading tasks/);
  assert.match(listing, /No tasks found/);
  assert.match(listing, /role="alert"/);
});
