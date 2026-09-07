import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readDetailPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readReportsPage = () => readFile(new URL('../page.tsx', import.meta.url), 'utf8');

test('reports detail page renders the complaint detail reference screen', async () => {
  const source = await readDetailPage();

  assert.match(source, /DashboardPageShell/);

  for (const text of [
    '#CMP-1042: App Issues - Payment Failed at Checkout',
    'Pending',
    'Critical',
    'Filed by John Smith',
    'Jun 28, 2025 at 10:45 AM',
    'Issue Summary',
    'User reported that the app crashed when trying to complete a payment for a "House Cleaning" task.',
    'No charge was made to the user card',
    'screenshot_error_01.png',
    'Customer Information',
    'Name',
    'John Smith',
    'Email',
    'john.smith@example.com',
    'Phone',
    '+1 555-0123',
    'Account Type',
    'Premium',
    'Related Task',
    '#TSK-4421: House Cleaning',
    'Admin Actions',
    'Assigned To',
    'Sarah Jenkins',
    'Status',
    'Internal Resolution Notes',
    'Add internal notes here...',
    'Update Complaint',
    'Activity Log',
    'Today, 11:00 AM',
    'Assigned to Sarah Jenkins by Alex Mercer',
    'Today, 10:45 AM',
    'Complaint filed by John Smith via Mobile App',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('reports table links each complaint to the detail route', async () => {
  const source = await readReportsPage();

  assert.match(source, /from 'next\/link'/);
  assert.match(source, /href=\{`\/reports\/\$\{complaint\.id\.replace\('#', ''\)\}`\}/);
  assert.doesNotMatch(source, /<button[\s\S]*View Detail[\s\S]*<\/button>/);
});
