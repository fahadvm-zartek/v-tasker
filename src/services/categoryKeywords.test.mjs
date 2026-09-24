import assert from 'node:assert/strict';
import test from 'node:test';
import service from './categoryService.js';

test('service payloads omit separately managed keywords and hide inactive nested keywords', () => {
  const payload = service.buildSubcategoryPayload({ name: 'Cleaning', categoryId: '5' });
  assert.equal(Object.hasOwn(payload, 'keywords'), false);
  const normalized = service.normalizeSubcategory({ id: 267, name: 'Cleaning', keywords: [
    { keyword: 'home cleaning', is_active: true },
    { keyword: 'old keyword', is_active: false },
  ] });
  assert.deepEqual(normalized.keywords, ['home cleaning']);
});

test('keyword management uses subcategory filters, follows pages and preserves existing records', async () => {
  const calls = [];
  const options = { baseUrl: 'https://api.example.com', authenticatedFetch: async (url, request) => {
    calls.push({ url, ...request });
    if (request.method === 'GET') {
      assert.equal(new URL(url).searchParams.get('subcategory'), '267');
      assert.equal(new URL(url).searchParams.has('category'), false);
      return { ok: true, json: async () => new URL(url).searchParams.has('page')
        ? { results: [{ id: 3, subcategory: 267, keyword: 'restore', is_active: false }], next: null }
        : { results: [{ id: 1, subcategory: 267, keyword: 'keep', is_active: true }, { id: 2, subcategory: 267, keyword: 'remove', is_active: true }], next: 'https://api.example.com/api/category-keywords/?subcategory=267&page=2' } };
    }
    return { ok: true, status: request.method === 'DELETE' ? 204 : 200, json: async () => ({ id: 4 }) };
  } };
  await service.saveSubcategoryKeywords('267', ['keep', 'restore', ' new ', 'new'], options);
  const writes = calls.filter((call) => call.method !== 'GET');
  assert.equal(writes.length, 3);
  const create = writes.find((call) => call.method === 'POST');
  assert.equal(create.url, 'https://api.example.com/api/category-keywords/');
  assert.deepEqual(JSON.parse(create.body), { subcategory: 267, keyword: 'new', is_active: true });
  const restore = writes.find((call) => call.method === 'PATCH');
  assert.match(restore.url, /\/3\/$/);
  assert.deepEqual(JSON.parse(restore.body), { subcategory: 267, keyword: 'restore', is_active: true });
  assert.match(writes.find((call) => call.method === 'DELETE').url, /\/2\/$/);
});

test('a failed keyword read prevents writes', async () => {
  await assert.rejects(service.saveSubcategoryKeywords('267', ['new'], {
    authenticatedFetch: async (_url, options) => {
      assert.equal(options.method, 'GET');
      return { ok: false, status: 403, json: async () => ({ detail: 'Denied' }) };
    },
  }), /Denied/);
});
