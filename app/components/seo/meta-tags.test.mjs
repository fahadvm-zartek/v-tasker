import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMetaTags } from './meta-tags.ts';

test('meta tag helper supplies V Tasker fallback metadata', () => {
  const metadata = buildMetaTags();

  assert.equal(metadata.title.default, 'V Tasker Admin Panel');
  assert.equal(metadata.title.template, '%s | V Tasker');
  assert.equal(metadata.description, 'Manage V Tasker tasks, users, payments, disputes, reports, rewards, and moderation from one admin workspace.');
  assert.deepEqual(metadata.icons, {
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
