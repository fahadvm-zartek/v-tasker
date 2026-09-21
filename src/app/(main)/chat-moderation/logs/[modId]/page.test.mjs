import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readDetailPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');

test('chat moderation log detail page matches the modal reference', async () => {
  const source = await readDetailPage();

  for (const text of [
    'Live Chat Stream',
    'Moderation Log Detail',
    'Moderation ID',
    'MOD-2026-88301',
    'Timestamp',
    'Aug 31, 2026, 1:20 PM IST',
    'Content ID',
    'CNV-88301',
    'User ID',
    'VTK-10245',
    'Original Content',
    'Dønt pay thru VTASKER, pay me directly pls',
    'Normalized Content',
    'dont pay through vtasker pay me directly please',
    'Rule Engine Analysis',
    'Triggered Rules',
    'PAYMENT_BYPASS (+40)',
    'Risk Score',
    '82 / 100',
    'Hard Violation',
    'Yes',
    'Final Decision',
    'BLOCK',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /<Sidebar\s*\/>/);
  assert.match(source, /<Header\s*\/>/);
  assert.match(source, /const moderationLogDetail/);
  assert.match(source, /backdrop-blur/);
});
