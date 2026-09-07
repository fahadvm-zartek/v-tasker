import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const detailsPageUrl = new URL('./[id]/page.tsx', import.meta.url);

const readDetailsPage = async () => {
  try {
    return await readFile(detailsPageUrl, 'utf8');
  } catch {
    return '';
  }
};

const extractBlock = (source, start, end) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  assert.notEqual(startIndex, -1);
  assert.notEqual(endIndex, -1);

  return source.slice(startIndex, endIndex);
};

test('user details page keeps dashboard chrome and uses a vertical scroll layout', async () => {
  const source = await readDetailsPage();

  assert.match(source, /<Sidebar\s*\/>/);
  assert.match(source, /<Header\s*\/>/);
  assert.match(source, /pl-\[var\(--layout-sidebar-current\)\]/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /overflow-x-hidden/);
  assert.match(source, /pb-12/);
  assert.doesNotMatch(source, /h-screen/);
  assert.doesNotMatch(source, /overflow-x-auto/);
});

test('user details page renders every reference profile summary field', async () => {
  const source = await readDetailsPage();
  const identityInfoItems = extractBlock(source, 'const identityInfoItems: InfoItemData[] = [', '];');

  for (const text of [
    'Sarah Mitchell',
    'S.Mitchell',
    'Joining Date',
    'Jan 12, 2024',
    'Member ID',
    'CST-9824',
    'Role',
    'Both',
    'Milestone',
    'Silver',
    'Status',
    'Verified',
    'Active',
    'Student Verification Expiry',
    'Oct 24, 2026',
    'Interaction Date',
    'Dec 01, 2024',
    'Suspension Status',
    'No active suspensions',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(source, /CST-0041/);
  assert.doesNotMatch(source, /\$3,245\.00/);

  for (const movedMetric of [
    'Cancellation Rate',
    'Completed Tasks',
    'Total Earned',
    'Total Tasks Posted',
    'Total Spent',
  ]) {
    assert.doesNotMatch(identityInfoItems, new RegExp(movedMetric.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('user details profile overview uses the premium corporate component structure', async () => {
  const source = await readDetailsPage();
  const profileOverviewBlock = extractBlock(source, 'const ProfileIdentity', 'export default function UserDetailsPage');

  for (const text of [
    'const ProfileOverview',
    'const ProfileIdentity',
    'const InfoItem',
    'const IdentityInformation',
    'const AccountStanding',
    '<ProfileOverview />',
    'xl:grid-cols-4',
    'identityInfoItems.map',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(profileOverviewBlock, /bg-\[linear-gradient/);
  assert.doesNotMatch(source, /h-\[96px\] w-\[76px\]/);
  assert.doesNotMatch(source, /-bottom-2 -right-2/);
});

test('user details identity information is arranged as four columns and two rows', async () => {
  const source = await readDetailsPage();
  const identityInfoItems = extractBlock(source, 'const identityInfoItems: InfoItemData[] = [', '];');

  for (const text of ['Name', 'S.Mitchell', 'Member ID', 'CST-9824', 'Milestone', 'Silver', 'Student Verification Expiry', 'Oct 24, 2026']) {
    assert.match(identityInfoItems, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const text of ['Joining Date', 'Jan 12, 2024', 'Role', 'Both', 'Status', 'Verified • Active', 'Interaction Date', 'Dec 01, 2024']) {
    assert.match(identityInfoItems, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /sm:grid-cols-2 xl:grid-cols-4/);
  assert.equal((identityInfoItems.match(/label:/g) ?? []).length, 8);
  assert.doesNotMatch(source, /leftInfoItems|rightInfoItems/);
});

test('user details page includes the user metric statistics row only', async () => {
  const source = await readDetailsPage();
  const statisticsBlock = extractBlock(source, 'const overviewMetrics: OverviewMetric[] = [', '];');

  for (const text of [
    'Completed Tasks',
    '42',
    'Total Earned',
    '$3,240.50',
    'No. of Reports',
    '12',
    'No. of Disputes',
    '5',
    'Total Tasks Posted',
    '24',
    'Total Spent',
    '$1,240.00',
    'Cancellation Rate',
    '2.4%',
  ]) {
    assert.match(statisticsBlock, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const removedMetric of [
    'Total Users',
    'Role: Task Doer',
    'Role: Task Poster',
    'Pending Approvals',
    'Verification Requests',
  ]) {
    assert.doesNotMatch(statisticsBlock, new RegExp(removedMetric.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /xl:grid-cols-7/);
  assert.ok(source.indexOf('identityFields.map') < source.indexOf('overviewMetrics.map'));
});

test('user details page restores the four detailed statistics boxes', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'Milestone',
    'Silver',
    'Progress to Gold',
    'Payment Summary',
    'Total Earned',
    '$3,240.50',
    'Total Spent',
    '$1,240.00',
    'Task Activity',
    'Total Completed',
    '42',
    'Task Poster',
    '18',
    'Task Doer',
    '24',
    'Total Tasks Posted',
    '+12.5%',
    'Performance Metrics',
    'Cancellation Count & Rate',
    '1 (2.4%)',
    'Offers Made',
    '56',
    'Offers Accepted',
    '42',
    'Deletions',
    '0',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('user details page includes tabs and stacked below-the-fold sections', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'Account Details',
    'Task History',
    'Payment History',
    'Rewards History',
    'Reports',
    'Disputes',
    'About',
    'Contact Information',
    'Portfolio',
    'Internal Admin Notes',
    'Verification',
    'Student Verification',
    'Skills',
    'Education & Certs',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /grid-cols-\[minmax\(0,1fr\)_320px\]/);
  assert.match(source, /space-y-6/);
});

test('user details task history tab matches the reference table view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'Task Poster',
    'Task Doer',
    'Search tasks title/customer/provider...',
    'Task Status: All',
    'Date Created: All Time',
    'Filter',
    'Task ID',
    'Date',
    'Service Name',
    'Doer',
    'Status',
    'Amount',
    'Reward Points',
    '#TSK-4412',
    '24 Oct 2024',
    'Regular Cleaning',
    'Alexander Sterling',
    'Completed',
    '$150.00',
    '+100 pts',
    '#TSK-4415',
    'Garden Maintenance',
    'Maria Rodriguez',
    '#TSK-4428',
    'Deep Cleaning',
    'Unassigned',
    '#TSK-4390',
    'Window Washing',
    'Canceled',
    'Showing 1 to 5 of 24 tasks',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /const taskHistoryRows/);
  assert.match(source, /const TaskHistoryPanel/);
  assert.match(source, /grid-cols-\[112px_118px_minmax\(150px,1\.2fr\)_minmax\(150px,1fr\)_118px_100px_130px\]/);
});

test('user details task history task doer subtab matches the reference table view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const taskDoerRows',
    "useState('Task Doer')",
    'Task Poster',
    'Milestone',
    'Action',
    '#TSK-8921',
    'Oct 24, 2023',
    'Premium Site Inspection',
    'Sarah Jenkins',
    '$145.00',
    'Milestone2 / Task16',
    'View Receipt',
    '#TSK-8925',
    'Oct 25, 2023',
    'Emergency Repair Routing',
    'Marcus Thorne',
    '$210.00',
    'Milestone2 / Task 15',
    '#TSK-8890',
    'Oct 22, 2023',
    'Standard Installation',
    'TechNova Inc.',
    '$85.50',
    'Milestone1 / Task14',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activeTaskHistoryTab === 'Task Doer'/);
  assert.match(source, /grid-cols-\[112px_118px_minmax\(150px,1\.2fr\)_minmax\(150px,1fr\)_118px_110px_150px_104px\]/);
});

test('user details task history filters use reference dropdown options', async () => {
  const source = await readDetailsPage();
  const taskHistoryBlock = extractBlock(source, 'const TaskHistoryPanel = () => {', 'const AccountDetailsPanel');

  for (const text of [
    'const taskStatusFilterOptions',
    'const dateCreatedFilterOptions',
    'All',
    'Assigned',
    'Done',
    'Pending',
    'Cancelled',
    'Unpaid',
    'Expired',
    'Dispute',
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'Custom Range',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(taskHistoryBlock, /openTaskFilter === 'status'/);
  assert.match(taskHistoryBlock, /openTaskFilter === 'date'/);
  assert.match(source, /absolute left-0 top-\[calc\(100%\+10px\)\] z-50/);
  assert.match(source, /bg-\[#dbe5ff\]/);
  assert.match(source, /border-\[#9aa6b8\]/);
});

test('user details payment history tab matches the reference transaction view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const paymentHistoryRows',
    'const PaymentHistoryPanel',
    'Transactions',
    'All',
    'Outgoing',
    'Earned',
    'Cancellation Fees',
    'Remaining Fees',
    'You have remaining fees',
    'See fees',
    'Saved Methods',
    'Visa ending in 4242',
    'DEFAULT',
    'Expires 12/26',
    'Task Provider',
    'Cancellation Fee Amount',
    'House Cleaning',
    'Sarah Mitchell',
    'Chidi A.',
    '$150.00',
    'Paid',
    'Plumbing Repair',
    'Marcus T.',
    '$85.50',
    'In Review',
    'Deep Cleaning',
    'Elena R.',
    '$220.00',
    'Credited',
    'Window Cleaning',
    '#TSK-4492',
    '$12.50',
    'Canceled',
    'Showing 1 to 4 of 24 entries',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activeTab === 'Payment History' \? <PaymentHistoryPanel \/> : null/);
  assert.match(source, /xl:grid-cols-\[minmax\(0,1fr\)_300px\]/);
});

test('user details payment history outgoing subtab matches the reference table view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const outgoingPaymentRows',
    'const OutgoingPaymentTable',
    'Task Doer',
    'David L.',
    '02 Oct 2024',
    'Lawn Mowing',
    '$45.00',
    'Showing 1 to 4 of 24 entries',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activePaymentFilter === 'Outgoing'/);
  assert.match(source, /grid-cols-\[160px_minmax\(180px,1\.2fr\)_minmax\(160px,1fr\)_120px_120px\]/);
});

test('user details payment history earned subtab matches the reference table view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const earnedPaymentRows',
    'const EarnedPaymentTable',
    'Task Poster',
    'Elena Rodriguez',
    'Maria Rivera',
    'David Lawson',
    'Gardening',
    'End of lease cleaning',
    '$85.50',
    '$450.00',
    'Credited',
    'View Receipt',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activePaymentFilter === 'Earned'/);
  assert.match(source, /grid-cols-\[150px_minmax\(180px,1\.2fr\)_minmax\(160px,1fr\)_120px_120px_120px\]/);
});

test('user details payment history cancellation fees subtab matches the reference table view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const cancellationFeeRows',
    "useState('Cancellation Fees')",
    'const CancellationFeesTable',
    'Fee Amount',
    'Actions',
    '#TSK-4492',
    'Window Cleaning',
    'Elena Rodriguez',
    '$12.50',
    'Pending',
    '#TSK-4481',
    'Lawn Mowing',
    'Marcus Thorne',
    '$11.42',
    'Paid',
    '#TSK-4450',
    'Car Wash',
    'Maria Rivera',
    '$15.00',
    'Waived',
    'Showing 1 to 3 of 3 entries',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activePaymentFilter === 'Cancellation Fees'/);
  assert.match(source, /grid-cols-\[110px_110px_minmax\(160px,1\.1fr\)_minmax\(150px,1fr\)_120px_110px_90px\]/);
});

test('user details rewards history tab matches the points history reference view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const rewardPointRows',
    'const RewardsHistoryPanel',
    'Points History',
    'Task Poster rewards',
    'review-completed tasks',
    'AUD conversions',
    'All Activity',
    'Points Earned',
    'AUD Conversions',
    'Silver Member',
    'Since Jan 15, 2024',
    'Progress to Gold',
    '750 / 1,000 pts',
    'Total Pts Earned',
    '+3,750 pts',
    'Total Pts Converted',
    '-3,000 pts',
    'Total AUD Withdrawn',
    '$42.00 AUD',
    'Current Pts Balance',
    '750 pts',
    'Task ID',
    'Date',
    'Activity',
    'Task Type',
    'Points',
    'AUD Equiv.',
    'Nov 10, 2024 · 2:15 PM',
    'AUD Conversion',
    'Withdrawal',
    '-1,500 pts',
    '$21.00 AUD paid',
    '#TSK-8902',
    'Review Completed',
    'Standard Task',
    '+50 pts',
    '+$0.70 AUD',
    '#TSK-8841',
    'High Value Task',
    '+150 pts',
    '+$2.10 AUD',
    'Milestone Bonus',
    '+200 pts',
    '+$2.80 AUD',
    'Showing 1-7 of 42 entries',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activeTab === 'Rewards History' \? <RewardsHistoryPanel \/> : null/);
  assert.match(source, /grid-cols-\[120px_190px_minmax\(170px,1fr\)_170px_150px_150px\]/);
});

test('user details rewards history milestones subtab matches the reference view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const rewardCatalogItems',
    "useState('Milestones')",
    'const RewardsMilestonesPanel',
    'Current Progress',
    '142',
    'Tasks Completed',
    'Next Milestone: 200 Tasks',
    '71% Complete',
    '$50 Value Unlock',
    'Rewards Catalog',
    'Default Shipping Address',
    'Current Default Address',
    'Alexander Sterling',
    '1248 Oak Creek Dr, Apt 3B',
    'Austin, TX 78701',
    'United States',
    'Physical rewards are typically processed and shipped within 3-5 business days upon claim confirmation.',
    '20 Tasks',
    'Starter Gear Pack',
    'Claimed',
    'Shipped to: 1248 Oak Creek Dr...',
    'View Details',
    '50 Tasks',
    'Pro Tools Kit',
    '100 Tasks',
    'Silver Tasker Status + Fuel Voucher',
    'You will be asked to confirm your shipping address upon claiming.',
    '200 Tasks',
    'Elite Performance Reward',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activeRewardsTab === 'Milestones'/);
  assert.match(source, /lg:grid-cols-\[minmax\(0,1fr\)_360px\]/);
});

test('user details reports tab matches the recent complaints reference view', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'const reportMetricCards',
    'const recentComplaintRows',
    'const ReportsPanel',
    'Total Complaints',
    'Avg. Resolution Time',
    'Critical Issues',
    'Satisfaction Score',
    '4.8/5',
    '+2% vs last month',
    '-12% improvement',
    'High priority',
    'Recent Complaints',
    'Complaint ID',
    'Category',
    'Severity',
    'Date Filed',
    'Assigned To',
    'Status',
    'Action',
    '#CMP-1042',
    'App Issues',
    'Critical',
    'Jun 28, 2025',
    'Sarah Jenkins',
    'Pending',
    '#CMP-1041',
    'Payment',
    'High',
    'Jun 27, 2025',
    'Mike Davis',
    'Under Investigation',
    'View Detail',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /activeTab === 'Reports' \? <ReportsPanel \/> : null/);
  assert.match(source, /lg:grid-cols-\[140px_minmax\(130px,1fr\)_112px_150px_minmax\(150px,1fr\)_180px_120px\]/);
});

test('user details tab panels keep account details and task history separate', async () => {
  const source = await readDetailsPage();

  assert.match(source, /useState\('Account Details'\)/);
  assert.match(source, /onClick=\{\(\) => setActiveTab\(tab\)\}/);
  assert.match(source, /activeTab === 'Task History' \? <TaskHistoryPanel \/> : null/);
  assert.match(source, /activeTab === 'Account Details'/);
  assert.match(source, /const AccountDetailsPanel/);
});

test('user details page omits removed lower activity and admin sections', async () => {
  const source = await readDetailsPage();

  for (const text of [
    'Recent Task History',
    'Payment Snapshot',
    'Reviews & Ratings',
    'Account Timeline',
    'Admin Actions',
  ]) {
    assert.doesNotMatch(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('users table profile links open the user details route', async () => {
  const usersPageSource = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');

  assert.match(usersPageSource, /href=\{`\/users\/\$\{user\.id\.replace\('#', ''\)\}`\}/);
});
