import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readRulesPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../../components/Sidebar.tsx', import.meta.url), 'utf8');
const readDashboardUi = () => readFile(new URL('../../components/dashboard-ui.tsx', import.meta.url), 'utf8');

test('chat moderation rules page matches the restricted keywords reference', async () => {
  const source = await readRulesPage();
  const sidebar = await readSidebar();
  const dashboardUi = await readDashboardUi();

  for (const text of [
    'Rules',
    'Monitor and manage flagged content and restricted keywords across the platform.',
    'Total Flagged Content',
    '1,248',
    'Restricted Keywords',
    '342',
    'Active rules',
    'Daily Flag Volume',
    '45',
    'Search keywords...',
    'Add New',
    'Keyword',
    'Category',
    'Frequency',
    'Last Detected',
    'Action',
    'urgent payment',
    'Scam / Spam',
    '1,402',
    '2 mins ago',
    'crypto wallet',
    '845',
    '1 hour ago',
    'f***',
    'Profanity',
    '523',
    '4 hours ago',
    'competitor_app_name',
    'Competitor',
    '12',
    '2 days ago',
    'Showing 1 to 4 of 342 entries',
    'Top Flagged Keywords',
    '1,402 hits',
    '845 hits',
    '523 hits',
    '312 hits',
    'Prev',
    'Next',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /<DashboardPageShell/);
  assert.match(dashboardUi, /<Sidebar\s*\/>/);
  assert.match(dashboardUi, /<Header\s*\/>/);
  assert.match(source, /const ruleMetricCards/);
  assert.match(source, /const restrictedKeywords/);
  assert.match(source, /const topFlaggedKeywords/);
  assert.match(source, /<Plus size=\{13\}/);
  assert.match(sidebar, /label: 'Rules', href: '\/chat-moderation\/rules'/);
});

test('restricted keyword toggles are anchored and update local state', async () => {
  const source = await readRulesPage();

  assert.match(source, /'use client';/);
  assert.match(source, /useState\(restrictedKeywords\)/);
  assert.match(source, /setKeywordRules\(\(currentRules\) =>/);
  assert.match(source, /onClick=\{\(\) => onToggle\(\)\}/);
  assert.match(source, /left-\[3px\]/);
  assert.match(source, /enabled \? 'translate-x-\[16px\]' : 'translate-x-0'/);
});

test('add restricted keyword button opens a structured modal', async () => {
  const source = await readRulesPage();

  for (const text of [
    'Add Restricted Keyword',
    'Keyword Name',
    'Enter keyword or phrase',
    'Category',
    'Scam / Spam',
    'Match Type',
    'Exact Match',
    'Moderation Score',
    '50',
    'FLAG',
    'Active Status',
    'Cancel',
    'Save Keyword',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /const \[isAddKeywordOpen, setIsAddKeywordOpen\] = useState\(false\)/);
  assert.match(source, /onClick=\{\(\) => setIsAddKeywordOpen\(true\)\}/);
  assert.match(source, /setOpenDropdown\(null\);/);
  assert.match(source, /setIsAddKeywordOpen\(false\);/);
  assert.match(source, /fixed inset-0 z-50/);
  assert.match(source, /max-w-\[620px\]/);
});

test('add restricted keyword modal uses the requested dropdown option lists', async () => {
  const source = await readRulesPage();

  for (const text of [
    'Select Category...',
    'Phone',
    'Email',
    'URL',
    'Social Media',
    'Payment',
    'Abuse',
    'Threat',
    'Scam',
    'Platform Bypass',
    'Contains',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /const categoryOptions = \[/);
  assert.match(source, /const matchTypeOptions = \[/);
  assert.match(source, /type AddKeywordDropdown = 'category' \| 'matchType' \| null/);
  assert.match(source, /const \[openDropdown, setOpenDropdown\] = useState<AddKeywordDropdown>\(null\)/);
  assert.match(source, /options=\{categoryOptions\}/);
  assert.match(source, /options=\{matchTypeOptions\}/);
});

test('add restricted keyword dropdown menus are not clipped by the modal shell', async () => {
  const source = await readRulesPage();

  assert.match(source, /max-h-\[calc\(100vh-32px\)\]/);
  assert.match(source, /overflow-visible rounded-\[10px\]/);
  assert.match(source, /max-h-\[360px\] overflow-y-auto/);
  assert.match(source, /z-\[70\]/);
});

test('add restricted keyword modal saves a new local keyword rule', async () => {
  const source = await readRulesPage();

  assert.match(source, /type NewKeywordForm/);
  assert.match(source, /defaultNewKeywordForm/);
  assert.match(source, /const \[newKeyword, setNewKeyword\] = useState\(defaultNewKeywordForm\)/);
  assert.match(source, /const handleSaveKeyword = \(\) =>/);
  assert.match(source, /keyword: newKeyword.keywordName \|\| 'New restricted keyword'/);
  assert.match(source, /const savedCategory = newKeyword.category === 'Select Category\.\.\.' \? 'Scam \/ Spam' : newKeyword.category/);
  assert.match(source, /category: savedCategory/);
  assert.match(source, /enabled: newKeyword.isActive/);
  assert.match(source, /setKeywordRules\(\(currentRules\) => \[newRule, \.\.\.currentRules\]\)/);
  assert.match(source, /setNewKeyword\(defaultNewKeywordForm\)/);
  assert.match(source, /onClick=\{onSave\}/);
  assert.match(source, /onSave=\{handleSaveKeyword\}/);
});
