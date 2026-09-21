import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');

test('rewards platform page renders the rewards dashboard content', () => {
  assert.doesNotMatch(source, /DashboardPlaceholderPage/);

  for (const literal of [
    'Rewards Platform',
    'Manage loyalty points, milestones, and user rewards programmatically.',
    'All',
    'Points Configuration',
    'Milestones',
    'Total Rewards Claimed',
    '1,248',
    '+12% mo.',
    'Pending Fulfillment',
    '45',
    'In Shipment',
    '82',
    'Total Points Redeemed',
    '48,500 PTS',
    'All Transactions & Claims',
    'Consolidated log of milestone achievements and points transactions.',
    'Export',
    'Search user, task ID...',
    'TYPE:',
    'STATUS:',
    'Select range...',
    'USER',
    'TYPE',
    'DETAILS / REFERENCE',
    'PTS / VALUE',
    'AUD EQUIV',
    'DATE',
    'STATUS',
    'ACTIONS',
    'John Doe',
    'CST-84926',
    'Points',
    'Task Completion',
    '#TSK-4421',
    '+50',
    '$0.50',
    'Premium Gear Pack',
    'Gold',
    'Alice Smith',
    '$50 Fuel Voucher',
    'Silver',
    'Michael Johnson',
    'Conversion',
    '-1000',
    '-$10.00',
    'Company T-Shirt',
    'Bronze',
    'Showing 1 to 5 of 12,430 entries',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('rewards platform page reuses the dashboard shell and controls', () => {
  assert.match(source, /'use client'/);
  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);
  assert.match(source, /DashboardMetricCard/);
  assert.match(source, /DashboardSearchField/);
  assert.match(source, /DashboardSelectButton/);
  assert.match(source, /DashboardPrimaryButton/);
  assert.match(source, /from 'lucide-react'/);
});

test('points configuration tab renders points activity when selected', () => {
  for (const literal of [
    'activeTab',
    'useState<RewardsTabKey>(() =>',
    "if (typeof window === 'undefined')",
    "const requestedTab = new URLSearchParams(window.location.search).get('tab')",
    "if (requestedTab === 'milestones' || requestedTab === 'points')",
    'useSearchParams',
    'const searchParams = useSearchParams();',
    "const requestedTab = searchParams.get('tab');",
    '<RewardsTabQuerySync onTabRequested={setActiveTab} />',
    'useEffect(() =>',
    'queueMicrotask(() => setActiveTab(requestedTab))',
    "onClick={() => setActiveTab('points')}",
    "activeTab === 'points'",
    'Total Points Earned',
    '8,230,500',
    '+12% this month',
    'Total Points Converted',
    '3,100,200',
    '+5% this month',
    'Total AUD Conversion',
    '$43,402.80',
    'Based on $0.014 per point',
    'Points Activity',
    'Search users...',
    'Activity Type: All',
    'mm/dd/yyyy',
    'USER NAME',
    'USER ID',
    'ACTIVITY TYPE',
    'TASK ID',
    'POINTS',
    'AUD EQV.',
    'TIMESTAMP',
    'PRV-44821',
    'Milestone Reached',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('milestones tab renders milestone tiers and recent claims', () => {
  for (const literal of [
    "import Link from 'next/link'",
    "activeTab === 'milestones'",
    'MilestonesPanel',
    'milestoneTiers',
    'milestoneClaimRows',
    'Milestone Tiers',
    'Define rules and rewards for achievement levels.',
    'MILESTONE',
    'Milestone 1',
    'Milestone 2',
    'Milestone 3',
    'Bronze',
    'Silver',
    'Gold',
    'Recent Claims',
    'Latest reward redemptions requiring fulfillment.',
    'Filter',
    'View All',
    'Search User...',
    'STATUS:',
    'MILESTONE:',
    'DATE RANGE:',
    'CLAIM DATE',
    'Premium Gear Pack',
    '$50 Fuel Voucher',
    'Company T-Shirt',
    'Oct 24, 2023',
    'Pending',
    'Shipped',
    'Delivered',
    'CLM-8824',
    'href={`/rewards-platform/claims/${row.claimId}`}',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('rewards platform header exposes a configure action', () => {
  assert.match(source, /Settings2/);
  assert.match(source, /Configure/);
  assert.match(source, /aria-label="Configure rewards platform"/);
  assert.match(source, /onClick=\{\(\) => setActiveTab\('configure'\)\}/);
  assert.match(source, /DashboardSecondaryButton/);
  assert.match(source, /className="h-9 border-\[#0457cf\] px-3 text-\[13px\] text-\[#0457cf\] hover:bg-\[#eef4ff\]"/);
  assert.match(source, /Settings2 size=\{16\}/);
  assert.doesNotMatch(source, /h-\[54px\]/);
  assert.doesNotMatch(source, /text-\[26px\]/);
  assert.doesNotMatch(source, /Settings2 size=\{30\}/);
});

test('configure action opens the points and tier configuration view', () => {
  for (const literal of [
    "type RewardsTabKey = 'all' | 'points' | 'milestones' | 'configure'",
    "activeTab === 'configure'",
    "active={activeTab === 'points' || activeTab === 'configure'}",
    'RewardsConfigurationPanel',
    'Points & Tier Configuration',
    'Define base exchange conversion rate and manage Task Value reward tier rules.',
    'ADD / EDIT TASK TIER PARAMETERS',
    'Tier reward points will recalculate estimated AUD value',
    'TASK VALUE RANGE ($ AUD)',
    'TIER NAME',
    'POINTS (PTS)',
    'AUD VALUE ($)',
    '$1,000.01 - $3,000',
    'High',
    '100',
    '$1.40',
    'Add Tier',
    'Task Value Tiers & Points',
    'Calculated reward points distribution matrix based on standard task budget.',
    'Configure or modify tiers below.',
    'Export CSV',
    'Task Value Range',
    'Tier Name',
    'Points Awarded',
    'AUD Value',
    'Actions',
    '$1 - $100',
    'Low',
    '25 PTS',
    '$0.35',
    '$100.01 - $500',
    'Medium',
    '50 PTS',
    '$0.70',
    '$500.01 - $1,000',
    'Standard',
    '75 PTS',
    '$1.05',
    '$3,000.01 - $6,000',
    'Very High',
    '125 PTS',
    '$1.75',
    '$6,000.01 - $9,999',
    'Premium',
    '150 PTS',
    '$2.10',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

test('add tier button opens a structured tier modal', () => {
  for (const literal of [
    "const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false)",
    'AddTierModal',
    'onOpenAddTier={() => setIsAddTierModalOpen(true)}',
    'onClick={onOpenAddTier}',
    'aria-label="Open add task tier modal"',
    'aria-modal="true"',
    'aria-labelledby="add-tier-title"',
    'Add New Milestone Tier',
    'Configure requirements and rewards for user achievement.',
    'TIER DETAILS',
    'Tier Name',
    'e.g. Gold Member, Task Master',
    'Reward Name',
    'Type the reward name...',
    'Task Completed',
    'e.g. 100',
    'Tier Icon',
    'Upload custom icon',
    'SVG, PNG, or JPG. Max 2MB. Recommended 128x128px.',
    'Browse',
    'SETTINGS',
    'Tier Status',
    'Set to inactive to hide this tier from users.',
    'Active',
    'Last Activated Date: Oct 24, 2024, 02:45 PM',
    'Tier Name',
    'Cancel',
    'Create Tier',
    "isAddTierModalOpen ? (",
    'onClose={() => setIsAddTierModalOpen(false)}',
  ]) {
    assert.match(source, new RegExp(escapeRegExp(literal)));
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
