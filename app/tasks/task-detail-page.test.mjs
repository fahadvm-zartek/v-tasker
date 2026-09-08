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
    'House Cleaning',
    '3BR',
    'In Progress',
    'Customer:',
    'Elena Rodriguez',
    'Location:',
    '124 Maple St, Downtown',
    'Budget:',
    '$100.00',
    'TOTAL TASK VIEWERS:',
    '142 views',
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
    'Provider Offers (3)',
    'Mike T.',
    'Accepted',
    'Sarah J.',
    'John D.',
    'Total Bid',
    '$120',
    '$135',
    '$110',
    'Service Amt:',
    'Commission (10%):',
    'Other Fees:',
    'Provider Payout:',
    'Fee Adj. Requested',
    'Review',
    'View Details',
    'View Offer',
    'Offer Discussion',
    'Admin Observing',
    'Today',
    'Can you confirm if you bring your own cleaning supplies?',
    'I provided all professional-grade cleaning supplies and equipment.',
    'Administrators can view communications but cannot interact directly in this channel.',
    'Fee Adjustment Review',
    'Task ID',
    '#TSK-4421',
    'Service',
    'Provider',
    'Adjustment Reason',
    'Encountered unexpected mold in the primary bathroom requiring specialized cleaning solutions and an additional 45 minutes of labor.',
    'Price Breakdown Comparison',
    'Current Bid',
    'Requested Payment Increase',
    '+ $15.00',
    '$115.00',
    '-$11.50',
    '$103.50',
    'Approve Adjustment',
    'DeleteTaskConfirmationModal',
    'Delete Task',
    'Are you sure you want to delete Task',
    '{displayId}',
    'This action cannot be undone and all associated offers and discussions will be permanently removed.',
    'Cancel',
    'Delete Permanently',
    'Open / In Dispute',
    'showViewerCount',
    'Dispute',
    'Offer Dispute Active',
    'Mike T. has raised a dispute regarding the task. Task remains open, but this offer is flagged for review.',
    'Dispute #DIS-5022',
    'REVIEWING',
    'Reason for Dispute',
    'Provider reported a mismatch between the task description and the actual requirements upon arrival.',
    'Resolve Dispute',
    'Cancelled',
    'Task Cancelled',
    'Cancellation Details',
    'Reason',
    'Customer requested cancellation due to unexpected severe scheduling conflict. Provider agreed to terms.',
    'Date Cancelled',
    'Jun 13, 2023 at 2:30 PM',
    'This task has been cancelled. Further communication is disabled.',
    'QuestionsSection',
    'Questions',
    'Offers (3)',
    'Questions',
    'Samantha Taylor',
    'Do you have green waste bins on site, or do I need to take the cuttings with me to the tip?',
    '2 HOURS AGO',
    'REPLY',
    'Marcus G.',
    'MODERATED',
    'I have one green bin, but if there',
    'Maria Rivera',
    'Is there parking available for a large van, or should I plan for street parking?',
    '30 MINS AGO',
    'David Lawson',
    'Are the hedges taller than 3 meters? Just checking if I',
    '4 HOURS AGO',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
