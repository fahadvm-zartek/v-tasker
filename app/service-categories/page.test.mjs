import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readServiceCategoriesPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../components/Sidebar.tsx', import.meta.url), 'utf8');

test('service categories page renders the category manager from the provided reference', async () => {
  const source = await readServiceCategoriesPage();

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /DashboardPageShell/);
  assert.match(source, /DashboardPanel/);

  for (const text of [
    'Service Categories',
    'Manage and organize the types of services offered on the platform.',
    '12',
    'In Person Sub-categories',
    '8',
    'Professional Sub-categories',
    '11',
    'Online Sub-categories',
    'Search categories...',
    'In Person',
    'Services delivered at a physical location.',
    '+ Add Keyword',
    'Home Cleaning',
    'Add Sub-Category',
    'Professional',
    'Certified and licensed professional services.',
    'Legal Advice',
    'Online',
    'Remote services delivered digitally.',
    'Online Tutoring',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('service category cards preserve the reference interaction affordances', async () => {
  const source = await readServiceCategoriesPage();

  assert.match(source, /'use client';/);
  assert.match(source, /aria-label=\{`Add sub-category to \$\{category\.title\}`\}/);
  assert.match(source, /aria-label=\{`Drag \$\{subCategory\.name\}`\}/);
  assert.match(source, /<Plus size=\{15\}/);
  assert.match(source, /category\.canAddKeyword/);
});

test('in person card does not render ghost or selected blue treatment for home cleaning', async () => {
  const source = await readServiceCategoriesPage();

  assert.doesNotMatch(source, /ghost/);
  assert.doesNotMatch(source, /isActive/);
  assert.doesNotMatch(source, /category\.isActive/);
  assert.doesNotMatch(source, /index === 0/);
  assert.doesNotMatch(source, /border-dashed border-\[#2f74ff\] bg-\[#f8fbff\]/);
  assert.doesNotMatch(source, /shadow-\[0_0_0_1px_rgba\(47,116,255,0\.04\)\]/);
});

test('add keyword opens a manage keywords modal for the selected sub-category', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'Manage Keywords',
    'Sub-category:',
    'ADD NEW KEYWORD',
    'e.g. Eco-friendly',
    'Keywords help users find specific services within this sub-category during search.',
    'ACTIVE KEYWORDS',
    'Deep Clean',
    'Residential',
    'Express',
    'Move Out',
    'Cancel',
    'Save Keywords',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /const \[keywordModal, setKeywordModal\] = useState<KeywordModalState>\(null\)/);
  assert.match(source, /onClick=\{\(\) => onOpenKeywords\(category\.title, firstSubCategory\?\.name \?\? category\.title\)\}/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /onClick=\{onAddKeyword\}/);
  assert.match(source, /activeKeywords: \[nextKeyword, \.\.\.currentModal\.activeKeywords\]/);
  assert.match(source, /setKeywordModal\(null\)/);
});

test('add sub-category opens an add checklist item modal from the provided reference', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'Add New Checklist Item',
    'Field Type',
    'Text field',
    'Calendar',
    'Location',
    'Date & Time',
    'Field Name',
    'e.g. Number of Bathrooms',
    'Field Icon',
    'Optional',
    'Click to upload',
    'or drag and drop',
    'SVG or PNG',
    'Checklist Item Visibility',
    'This item will be visible to field workers assigned to tasks within this service category.',
    'Cancel',
    'Add Field',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /type ChecklistModalState =/);
  assert.match(source, /const \[checklistModal, setChecklistModal\] = useState<ChecklistModalState>\(null\)/);
  assert.match(source, /onClick=\{\(\) => onOpenChecklist\(category\.title\)\}/);
  assert.match(source, /aria-labelledby="add-checklist-item-title"/);
  assert.match(source, /setChecklistModal\(null\)/);
});

test('home cleaning opens a scrollable checklist detail view from the provided reference', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'Checklist of items required for the Home Cleaning service offering.',
    'IN PERSON',
    'Checklist Items (14)',
    '14 Items',
    'CHECKLIST ITEM',
    'REQUIRED',
    'TYPE',
    'ACTIONS',
    'Service Type',
    'SELECTION',
    'Edit Checklist Item: Service Type',
    'Options',
    'Regular cleaning',
    'End of lease cleaning',
    'Add New Field',
    'Mark as Required',
    'Providers cannot offer this service without submitting this item.',
    'Number of Rooms',
    'COUNTER',
    'Edit Checklist Item: Number of Rooms',
    'Room Counters',
    'Bedrooms',
    'Bathrooms',
    'Save Changes',
    'Add New Checklist Item',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /type ServiceDetailState =/);
  assert.match(source, /const \[serviceDetail, setServiceDetail\] = useState<ServiceDetailState>\(null\)/);
  assert.match(source, /onOpenDetail=\{openServiceDetail\}/);
  assert.match(source, /setServiceDetail\(\{ categoryTitle, subCategoryName \}\)/);
  assert.match(source, /max-h-\[calc\(100vh-180px\)\] overflow-y-auto/);
  assert.match(source, /setServiceDetail\(null\)/);
});

test('sidebar exposes service categories with a tags icon', async () => {
  const source = await readSidebar();

  assert.match(source, /Tags/);
  assert.match(source, /label: 'Service Categories', href: '\/service-categories', icon: Tags/);
});
