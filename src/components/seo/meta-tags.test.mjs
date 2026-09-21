import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const currentDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(currentDir, 'meta-tags.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
});

const cjsModule = { exports: {} };
vm.runInNewContext(outputText, {
  exports: cjsModule.exports,
  module: cjsModule,
  require: () => ({}),
});

const { buildMetaTags } = cjsModule.exports;

test('meta tag helper supplies V Tasker fallback metadata', () => {
  const metadata = buildMetaTags();

  assert.equal(metadata.title.default, 'V Tasker Admin Panel');
  assert.equal(metadata.title.template, '%s | V Tasker');
  assert.equal(metadata.description, 'Manage V Tasker tasks, users, payments, disputes, reports, rewards, and moderation from one admin workspace.');
  assert.deepEqual(JSON.parse(JSON.stringify(metadata.icons)), {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  });
});

test('meta tag helper allows page-specific title and description overrides', () => {
  const metadata = buildMetaTags({
    title: 'Reports',
    description: 'Review report escalations and operational trends.',
  });

  assert.equal(metadata.title, 'Reports');
  assert.equal(metadata.description, 'Review report escalations and operational trends.');
  assert.equal(metadata.applicationName, 'V Tasker');
});
