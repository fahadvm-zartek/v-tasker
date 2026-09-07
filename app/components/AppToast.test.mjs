import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('app toast uses the compact premium success toast structure and styling', async () => {
  const source = await readSource('./AppToast.tsx');

  assert.match(source, /'use client'/);
  assert.match(source, /CheckCircle2/);
  assert.match(source, /X/);
  assert.match(source, /useEffect/);
  assert.match(source, /useState/);
  assert.match(source, /title: string/);
  assert.match(source, /message: string/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /bg-\[#ecfdf5\]/);
  assert.match(source, /border-\[#6ee7b7\]/);
  assert.match(source, /bg-\[#059669\]/);
  assert.match(source, /rounded-\[10px\]/);
  assert.match(source, /w-\[min\(360px,calc\(100vw-32px\)\)\]/);
  assert.match(source, /min-h-\[68px\]/);
  assert.match(source, /max-w-\[360px\]/);
  assert.match(source, /h-\[34px\] w-\[34px\]/);
  assert.match(source, /CheckCircle2 size=\{17\}/);
  assert.match(source, /text-\[15px\] font-semibold/);
  assert.match(source, /text-\[13px\] font-normal/);
  assert.match(source, /X size=\{16\}/);
  assert.match(source, /window\.setTimeout\(\(\) =>/);
  assert.match(source, /3500/);
  assert.match(source, /animate-toast-in/);
  assert.match(source, /animate-toast-out/);
  assert.match(source, /\{title\}/);
  assert.match(source, /\{message\}/);
  assert.match(source, /aria-label="Dismiss notification"/);
  assert.match(source, /onClick=\{handleDismiss\}/);
});
