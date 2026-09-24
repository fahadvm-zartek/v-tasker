import assert from 'node:assert/strict';
import test from 'node:test';
import filters from './taskFilters.js';

test('date presets use local calendar dates including today across month boundaries', () => {
  const now = new Date(2026, 0, 3, 0, 30);
  assert.deepEqual(filters.getTaskDateRange('today', '', '', now), { dateCreatedAfter: '2026-01-03', dateCreatedBefore: '2026-01-03' });
  assert.deepEqual(filters.getTaskDateRange('7', '', '', now), { dateCreatedAfter: '2025-12-28', dateCreatedBefore: '2026-01-03' });
  assert.deepEqual(filters.getTaskDateRange('30', '', '', now), { dateCreatedAfter: '2025-12-05', dateCreatedBefore: '2026-01-03' });
  assert.deepEqual(filters.getTaskDateRange('all', '2026-01-01', '2026-01-03', now), {});
});

test('custom dates require valid ordered bounds and include both selected dates', () => {
  assert.deepEqual(filters.getTaskDateRange('custom', '2026-09-01', '2026-09-24'), { dateCreatedAfter: '2026-09-01', dateCreatedBefore: '2026-09-24' });
  for (const [start, end] of [['', ''], ['2026-09-25', '2026-09-24'], ['2026-02-30', '2026-03-01']]) {
    assert.throws(() => filters.getTaskDateRange('custom', start, end));
  }
});
