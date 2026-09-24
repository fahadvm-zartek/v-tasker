import assert from 'node:assert/strict';
import test from 'node:test';
import validation from './locationValidation.js';

test('country and state require nonblank names and codes without extra restrictions', () => {
  for (const kind of ['country', 'state']) {
    assert.deepEqual(Object.keys(validation.validateLocationForm(kind, { name: '  ', code: '' })), ['name', 'code']);
    assert.deepEqual(validation.validateLocationForm(kind, { name: 'Victoria', code: 'V' }), {});
  }
});

test('suburbs require a name, region and exactly four postcode digits including leading zeros', () => {
  for (const postcode of ['', '123', '12345', '12a4', '12 4']) {
    assert.ok(validation.validateLocationForm('suburb', { name: 'Darwin', postcode, regionId: '1' }).postcode);
  }
  for (const postcode of ['0800', '2010']) {
    assert.deepEqual(validation.validateLocationForm('suburb', { name: 'Darwin', postcode, regionId: '1' }), {});
  }
  assert.deepEqual(Object.keys(validation.validateLocationForm('suburb', { name: ' ', postcode: '', regionId: '' })), ['name', 'postcode', 'regionId']);
});
