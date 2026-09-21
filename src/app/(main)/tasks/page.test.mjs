import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('tasks page loads live task data and renders N/A when no rows are available', async () => {
  const source = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');

  assert.match(source, /^'use client';/);
  assert.match(source, /fetchTasksPage/);
  assert.match(source, /useEffect/);
  assert.match(source, /DashboardPagination/);
  assert.match(source, /tasks\.length > 0/);
  assert.match(source, />N\/A</);
  assert.doesNotMatch(source, /#TSK-4421/);
  assert.doesNotMatch(source, /House Cleaning - 3BR/);
  assert.doesNotMatch(source, /value: '1,284'/);
});
