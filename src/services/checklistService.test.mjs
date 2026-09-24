import test from 'node:test';
import assert from 'node:assert/strict';
import service from './checklistService.js';

for (const type of ['single_select', 'multiple_select']) {
  test(`${type} options are trimmed, saved and loaded for service editing`, async () => {
    let stored = [{ id: 20, label: 'Old option', order: 1 }];
    const component = () => ({ id: 3, label: 'Choose', component_type: type === 'multiple_select' ? 'multi_select' : type, required: false, order: 1, options: stored });
    const options = { authenticatedFetch: async (url, request) => {
      let payload = {};
      if (request.method === 'GET') {
        payload = url.includes('?') ? [{ id: 1, status: 'draft' }]
          : url.endsWith('/checklist-definitions/1/') ? { id: 1, status: 'draft', sections: [{ id: 2, components: [component()] }] }
          : component();
      } else if (request.method === 'DELETE') {
        stored = [];
      } else if (request.method === 'POST' && url.endsWith('/checklist-options/')) {
        const body = JSON.parse(request.body);
        assert.ok(body.label.trim());
        stored.push({ id: 30 + stored.length, label: body.label, order: body.order });
      }
      return { ok: true, json: async () => payload };
    } };
    await service.saveChecklistQuestions('267', 'Cleaning', [{ id: '3', question: 'Choose', type, required: false, order: 1, options: ['Option 1', ' Option 2', ' Option 3 ', ''] }], options);
    const result = await service.fetchChecklist('267', options);
    assert.deepEqual(result.questions[0].options, ['Option 1', 'Option 2', 'Option 3']);
    assert.equal(result.questions[0].type, type);
  });
}

test('loads subcategory definitions and reads nested components from detail', async () => {
  const calls = [];
  const result = await service.fetchChecklist('267', { authenticatedFetch: async (url) => {
    calls.push(url);
    return { ok: true, json: async () => url.includes('?')
      ? { results: [{ id: 8, status: 'draft' }], next: null }
      : { id: 8, status: 'draft', subcategory: 267, sections: [{ id: 9, order: 1, components: [
        { id: 10, label: 'Rooms', component_number: 'C02', component_type: 'single_select', required: true, order: 1, options: [{ label: 'One' }] },
      ] }] } };
  } });
  assert.match(calls[0], /checklist-definitions\/\?subcategory=267/);
  assert.match(calls[1], /checklist-definitions\/8\/$/);
  assert.equal(result.questions[0].question, 'Rooms');
  assert.equal(result.questions[0].componentNumber, 'C02');
  assert.deepEqual(result.questions[0].options, ['One']);
});

test('creates definition, section, component and options using the migrated foreign key', async () => {
  const calls = [];
  await service.addChecklistQuestion('267', 'Cleaning', { question: 'Service type', componentNumber: 'C11', type: 'multiple_select', required: true, options: ['Regular'], order: 1 }, {
    authenticatedFetch: async (url, request) => {
      calls.push({ url, ...request });
      return { ok: true, json: async () => request.method === 'GET' ? [] : { id: calls.length, status: 'draft' } };
    },
  });
  const writes = calls.filter(c => c.method === 'POST');
  assert.equal(writes.length, 4);
  const definition = JSON.parse(writes[0].body);
  assert.equal(definition.subcategory, 267);
  assert.equal(Object.hasOwn(definition, 'category'), false);
  assert.ok(definition.slug);
  assert.ok(definition.screen_title);
  assert.match(writes[1].url, /checklist-sections\/$/);
  assert.equal(JSON.parse(writes[2].body).component_type, 'multi_select');
  assert.equal(JSON.parse(writes[2].body).component_number, 'C03');
  assert.match(writes[3].url, /checklist-options\/$/);
});

test('validation and failed reads prevent creation', async () => {
  const options = { authenticatedFetch: async () => ({ ok: false, status: 403, json: async () => ({ detail: 'Denied' }) }) };
  await assert.rejects(service.addChecklistQuestion('267', 'Cleaning', { question: 'Name', componentNumber: 'C05', type: 'text', options: [] }, options), /Denied/);
  await assert.rejects(service.addChecklistQuestion('267', 'Cleaning', { question: ' ', type: 'text' }, options), /required/);
});

test('component numbers follow the documented field types and UI aliases', () => {
  const mapping = { content_block: 'C01', single_select: 'C02', multi_select: 'C03', counter: 'C04', short_text: 'C05', long_text: 'C06', number_input: 'C07', boolean_toggle: 'C08', location_input: 'C09', repeatable_text_list: 'C10', date_input: 'C11', text: 'C05', number: 'C07', multiple_select: 'C03', yes_no: 'C08' };
  for (const [type, code] of Object.entries(mapping)) assert.equal(service.getComponentNumber(type), code);
  assert.throws(() => service.getComponentNumber('unknown'), /field type/);
});

test('failed option creation removes the incomplete new component before retry', async () => {
  const calls = [];
  await assert.rejects(service.addChecklistQuestion('267', 'Cleaning', { question: 'Type', componentNumber: 'C02', type: 'single_select', options: ['Regular'] }, {
    authenticatedFetch: async (url, request) => {
      calls.push({ url, ...request });
      if (url.endsWith('/checklist-options/')) return { ok: false, json: async () => ({ detail: 'Invalid option' }) };
      if (request.method === 'DELETE') return { ok: true, status: 204 };
      return { ok: true, json: async () => request.method === 'GET' ? [] : { id: 9 } };
    },
  }), /Invalid option/);
  assert.equal(calls.at(-1).method, 'DELETE');
  assert.match(calls.at(-1).url, /checklist-components\/9\/$/);
});

test('published checklists create a new draft version for additions', async () => {
  const calls = [];
  await service.addChecklistQuestion('267', 'Cleaning', { question: 'Notes', type: 'text', options: [] }, {
    authenticatedFetch: async (url, request) => {
      calls.push({ url, ...request });
      const payload = url.includes('?') ? [{ id: 1, status: 'published' }]
        : url.endsWith('/new-version/') ? { id: 2 }
        : url.endsWith('/checklist-definitions/1/') ? { id: 1, status: 'published' }
        : url.endsWith('/checklist-definitions/2/') ? { id: 2, status: 'draft', sections: [{ id: 3, components: [] }] }
        : { id: 4 };
      return { ok: true, json: async () => payload };
    },
  });
  assert.ok(calls.some(c => c.url.endsWith('/1/new-version/') && c.method === 'POST'));
  const component = calls.find(c => c.url.endsWith('/checklist-components/'));
  assert.equal(JSON.parse(component.body).section, 3);
  assert.equal(JSON.parse(component.body).component_type, 'short_text');
});

test('an unchanged checklist causes no writes', async () => {
  await service.saveChecklistQuestions('267', 'Cleaning', [{ id: '3', question: 'Notes', type: 'text', required: false, options: [], order: 1 }], {
    authenticatedFetch: async (url, request) => {
      assert.equal(request.method, 'GET');
      return { ok: true, json: async () => url.includes('?') ? [{ id: 1, status: 'draft' }]
        : { id: 1, status: 'draft', sections: [{ id: 2, components: [{ id: 3, label: 'Notes', component_number: 'C05', component_type: 'short_text', required: false, options: [], order: 1 }] }] } };
    },
  });
});
