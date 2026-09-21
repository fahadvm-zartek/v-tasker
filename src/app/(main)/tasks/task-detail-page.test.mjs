import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('task detail page renders the offer discussion dashboard from the reference', async () => {
  const source = await readFile(new URL('./[id]/page.tsx', import.meta.url), 'utf8');

  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /params: Promise<\{ id: string \}>/);
  assert.match(source, /'use client'/);
  assert.match(source, /useSearchParams/);
  assert.match(source, /useState/);
  assert.match(source, /setIsFeeAdjustmentOpen\(true\)/);
  assert.match(source, /setIsFeeAdjustmentOpen\(false\)/);
  assert.match(source, /setIsDeleteTaskOpen\(true\)/);
  assert.match(source, /setIsDeleteTaskOpen\(false\)/);
  assert.match(source, /TaskDetailTab/);
  assert.match(source, /setActiveTab\('offers'\)/);
  assert.match(source, /setActiveTab\('questions'\)/);
  assert.match(source, /activeTab === 'offers'/);
  assert.match(source, /activeTab === 'questions'/);
  assert.match(source, /href=\{`\/tasks\/\$\{taskId\}\/offers\/\$\{offer\.slug\}`\}/);
  assert.match(source, /TaskDetailStatus/);
  assert.match(source, /const getTaskDetailStatus/);
  assert.match(source, /statusParam/);
  assert.match(source, /decodeURIComponent\(id\)/);
  assert.match(source, /normalizedId === 'TSK-4423'/);
  assert.match(source, /normalizedId === 'TSK-4424'/);

  for (const text of [
    'Tasks',
    'displayId',
    'Customer:',
    'Location:',
    'Budget:',
    'TOTAL TASK VIEWERS:',
    'Delete Task',
    'Offers',
    'Questions',
    'Status Timeline',
    'Task Posted',
    'Offer Received',
    'Provider Assigned',
    'Completed',
    'Administrative Details',
    'Completion Docs',
    'No documents uploaded yet.',
    'Dispute Info',
    'No active disputes.',
    'Provider Offers',
    'Total Bid',
    'Service Amt:',
    'Commission (10%):',
    'Other Fees:',
    'Provider Payout:',
    'Offer Discussion',
    'Admin Observing',
    'No Offer Discussion available.',
    'Fee Adjustment Review',
    'DeleteTaskConfirmationModal',
    'Delete Task',
    'Delete Permanently',
    'Dispute',
    'Resolve Dispute',
    'Cancelled',
    'QuestionsSection',
    'Questions',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
