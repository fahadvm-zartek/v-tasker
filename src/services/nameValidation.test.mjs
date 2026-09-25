import assert from 'node:assert/strict';
import test from 'node:test';
import validation from './nameValidation.js';

test('name input keeps Unicode letters and accents but removes numbers and punctuation', () => {
  assert.equal(typeof validation.lettersOnly, 'function');
  assert.equal(validation.lettersOnly('John123!'), 'John');
  assert.equal(validation.lettersOnly('José'), 'José');
  assert.equal(validation.lettersOnly('Jose\u0301'), 'Jose\u0301');
  assert.equal(validation.lettersOnly('李१२ 3'), '李');
  assert.equal(validation.validateName('123', 'Required'), 'Use letters only.');
  assert.equal(validation.validateName('', 'Required'), 'Required');
  assert.equal(validation.validateName('José', 'Required'), '');
});
