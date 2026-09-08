import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('tasks page renders the task management dashboard from the reference', async () => {
  const source = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /DashboardSearchField/);
  assert.match(source, /DashboardSelectButton/);
  assert.match(source, /DashboardPrimaryButton/);
  assert.match(source, /from 'next\/link'/);
  assert.match(source, /\?status=\$\{encodeURIComponent\(task\.status\)\}/);

  for (const text of [
    'Total Tasks',
    '1,284',
    'Active',
    '342',
    'Pending',
    '198',
    'Tasks With No Offers',
    '156',
    'Disputes',
    '24',
    'Completed',
    '744',
    'Search tasks title/customer/provider...',
    'Suburbs: All',
    'States: All',
    'Status: All',
    'Tasks: All',
    'Date Created:',
    'Filter',
    'SL NO.',
    'Task ID',
    'Task Title',
    'Poster',
    'Doer',
    'Category',
    'Service',
    'Status',
    'Date Created',
    'Action',
    '#TSK-4421',
    'href={`/tasks/${task.id.replace',
    'House Cleaning - 3BR',
    'Sarah J.',
    'Mike T.',
    '#TSK-4422',
    'Lawn Mowing - Weekly',
    'Unassigned',
    '3 Offers',
    '#TSK-4423',
    'Bathroom Deep Clean',
    'Dispute',
    '#TSK-4424',
    'Cancelled Cleaning Visit',
    'Cancelled',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
