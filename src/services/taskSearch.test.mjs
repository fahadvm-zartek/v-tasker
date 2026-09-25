import assert from 'node:assert/strict';
import test from 'node:test';
import service from './taskService.js';

test('combined task filters search people across API pages before pagination', async () => {
  const rows = [
    { id: 1, title: 'Cleaning', poster: { first_name: 'Alice' }, status: 'OPEN', suburb: { id: 7, name: 'Bondi', state: { code: 'NSW' } }, offer_count: 0, created_at: '2026-09-24T12:00:00Z' },
    { id: 2, title: 'Painting', poster: { first_name: 'Alice' }, status: 'COMPLETED', offer_count: 0 },
    { id: 3, title: 'Moving', poster: { first_name: 'Alice' }, status: 'OPEN', suburb: { id: 7, name: 'Bondi', state: { code: 'NSW' } }, offer_count: 0, created_at: '2026-09-24T23:59:59Z' },
  ];
  const authenticatedFetch = async (url) => {
    const page = Number(new URL(url).searchParams.get('page') || 1);
    return { ok: true, json: async () => ({ count: 3, next: page < 3 ? `?page=${page + 1}` : null, results: [rows[page - 1]] }) };
  };
  assert.equal(typeof service.fetchFilteredTasksPage, 'function');
  const options = { baseUrl: 'https://example.com', authenticatedFetch, search: ' ALICE ', status: 'OPEN', suburb: '7', state: 'NSW', hasOffers: false, dateCreatedAfter: '2026-09-24', dateCreatedBefore: '2026-09-24', pageSize: 1 };
  const first = await service.fetchFilteredTasksPage(options);
  assert.equal(first.count, 2);
  assert.deepEqual(first.tasks.map(t => t.routeId), ['1']);
  assert.ok(first.next);
  const second = await service.fetchFilteredTasksPage({ ...options, page: 2 });
  assert.deepEqual(second.tasks.map(t => t.routeId), ['3']);
  assert.equal(second.tasks[0].serial, '2');
  assert.equal(second.next, null);
  assert.ok(second.previous);
  const empty = await service.fetchFilteredTasksPage({ ...options, hasOffers: true });
  assert.equal(empty.count, 0);
});

test('state and suburb filters resolve numeric location references', async () => {
  const result = await service.fetchFilteredTasksPage({
    state: 'NSW', suburb: '7', stateSuburbs: ['7', 'Bondi'],
    authenticatedFetch: async () => ({ ok: true, json: async () => [
      { id: 1, suburb: 7 }, { id: 2, suburb: 8 },
    ] }),
  });
  assert.deepEqual(result.tasks.map(task => task.routeId), ['1']);
});

test('selected suburb IDs also match listings that return suburb names', async () => {
  const result = await service.fetchFilteredTasksPage({
    suburb: '7', suburbName: 'Bondi',
    authenticatedFetch: async () => ({ ok: true, json: async () => [
      { id: 1, suburb: 'Bondi' }, { id: 2, suburb: 'Sydney' },
    ] }),
  });
  assert.deepEqual(result.tasks.map(task => task.routeId), ['1']);
});
