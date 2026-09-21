import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readHistoryPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');

test('chat moderation view history page matches the user timeline reference', async () => {
  const source = await readHistoryPage();

  for (const text of [
    'Rahul Sharma',
    'VTK-10245',
    '+91 98xxxxx210',
    'Active account',
    'Msgs Reviewed',
    'Flagged',
    'Blocked',
    'Highest Risk Score',
    'Conversation Timeline',
    'Today, 10:02 AM',
    'CNV-88240',
    'Please contact me on WhatsApp.',
    'Allow',
    '25 / 100',
    'Low Risk',
    'Below the 31-point Flag threshold',
    'Triggered Rules',
    'SOCIAL_MEDIA',
    '+25',
    'View Detection Details',
    'Admin Action',
    'Flag',
    'Block',
    'Today, 11:47 AM',
    'CNV-88266',
    'Message me on WhatsApp and I will give you my phone number.',
    '60 / 100',
    'Medium Risk',
    'Two contact-related rules triggered together',
    'PHONE_CONTACT_REQUEST',
    '+35',
    'View Moderation Log',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /<Sidebar\s*\/>/);
  assert.match(source, /<Header\s*\/>/);
  assert.match(source, /const userSummaryCards/);
  assert.match(source, /const conversationTimeline/);
  assert.match(source, /grid-cols-4/);
});
