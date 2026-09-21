import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceFiles = [
  '../app/(main)/users/[id]/page.tsx',
  './OverviewDashboard.tsx',
  './TasksTable.tsx',
  '../app/(main)/users/page.tsx',
  '../app/(main)/rewards-platform/claims/[claimId]/page.tsx',
  '../app/(main)/tasks/page.tsx',
  '../app/(main)/tasks/[id]/page.tsx',
];

test('interactive UI does not ship inert hash anchors', async () => {
  const sources = await Promise.all(sourceFiles.map((path) => readFile(new URL(path, import.meta.url), 'utf8')));

  for (const source of sources) {
    assert.doesNotMatch(source, /href="#"/);
  }
});
