import assert from 'node:assert/strict';
import test from 'node:test';
import service from './userTaskHistory.js';

test('user history matches exact participant IDs across pages and both roles', async () => {
  assert.equal(typeof service.fetchUserTaskHistory, 'function');
  const pages = [
    { count: 4, next: '?page=2', results: [
      { id: 1, poster: { id: 7, name: 'Sam' }, doer: { id: 8 }, title: 'Paint', status: 'OPEN', budget: 100 },
      { id: 2, poster: { id: 17, name: 'Sam' }, doer: null },
    ] },
    { count: 4, next: null, results: [
      { id: 3, poster_id: 8, doer_id: '7', title: 'Clean', status: 'COMPLETED', budget: '50.5', created_at: '2026-09-25T10:00:00Z' },
      { id: 4, poster: 7, doer: 7, title: 'Move', status: 'ASSIGNED' },
    ] },
  ];
  const rows = await service.fetchUserTaskHistory('7', { authenticatedFetch: async url => ({ ok: true, json: async () => pages[Number(new URL(url).searchParams.get('page') || 1) - 1] }) });
  assert.deepEqual(rows.map(row => row.routeId), ['1', '3', '4']);
  assert.deepEqual(service.filterUserTaskHistory(rows, { role: 'poster' }).map(row => row.routeId), ['1', '4']);
  assert.deepEqual(service.filterUserTaskHistory(rows, { role: 'doer', search: ' CLEAN ', status: 'COMPLETED', dateCreatedAfter: '2026-09-25', dateCreatedBefore: '2026-09-25' }).map(row => row.routeId), ['3']);
  assert.equal(rows[1].amount, '$50.50');
  assert.equal(rows[0].reward, 'N/A');
  assert.equal(rows[0].milestone, 'N/A');
});

test('sparse listings resolve participant IDs from task details without matching names', async () => {
  assert.equal(typeof service.fetchUserTaskHistory, 'function');
  const calls = [];
  const rows = await service.fetchUserTaskHistory('7', { authenticatedFetch: async url => {
    calls.push(String(url));
    return { ok: true, json: async () => new URL(url).pathname.endsWith('/5/')
      ? { id: 5, poster: { id: 7 }, doer: null }
      : [{ id: 5, poster_name: 'Sam' }] };
  } });
  assert.equal(calls.length, 2);
  assert.deepEqual(rows.map(row => row.routeId), ['5']);
  await assert.rejects(service.fetchUserTaskHistory('7', { authenticatedFetch: async () => ({ ok: false, status: 403 }) }));
});

test('plain participant names trigger detail lookup rather than being treated as IDs', async () => {
  const rows = await service.fetchUserTaskHistory('7', { authenticatedFetch: async url => ({ ok: true, json: async () =>
    new URL(url).pathname.endsWith('/9/') ? { id: 9, poster: { id: 8 }, doer: { id: 7 } }
      : [{ id: 9, poster: 'Sam Jones', doer: 'Alex Smith' }],
  }) });
  assert.deepEqual(rows.map(row => row.routeId), ['9']);
  assert.equal(rows[0].isDoer, true);
});

test('explicit IDs take precedence and date filters use the displayed timestamp aliases', async () => {
  const rows = await service.fetchUserTaskHistory('7', { authenticatedFetch: async () => ({ ok: true, json: async () => [
    { id: 1, poster: { id: 99 }, poster_id: 7, doer: null, createdAt: '2026-09-25T08:00:00Z' },
    { id: 2, poster_id: 7, doer: null, posted_at: '2026-09-25T09:00:00Z' },
  ] }) });
  assert.deepEqual(service.filterUserTaskHistory(rows, { role: 'poster', dateCreatedAfter: '2026-09-25', dateCreatedBefore: '2026-09-25' }).map(row => row.routeId), ['1', '2']);
});
