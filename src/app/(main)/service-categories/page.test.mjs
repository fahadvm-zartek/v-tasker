import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readServiceCategoriesPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../../../components/Sidebar.tsx', import.meta.url), 'utf8');

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
    'Home Cleaning',
    'Add Category',
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

test('service categories page loads categories from api/categories as the source of truth', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'fetchCategoriesPage',
    'createCategory',
    'updateCategory',
    'createSubcategory',
    'updateSubcategory',
    'useEffect',
    'loadCategories',
    'setIsLoading',
    'setErrorMessage',
    'serviceGroups',
    'groupCategoriesByType',
    'category.categoryType',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(source, /const serviceCategories: ServiceCategory\[\] = \[/);
  assert.doesNotMatch(source, /const defaultActiveKeywords = \[/);
});

test('service categories page supports functional add and edit subcategory saves', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'SubcategoryFormModal',
    'editingSubcategory',
    'subCategoryName',
    'draftKeyword',
    'checklistEnabled',
    'checklistQuestions',
    'handleOpenAddSubcategory',
    'handleOpenEditSubcategory',
    'handleSaveSubcategory',
    'createSubcategory(',
    'updateSubcategory(',
    'loadCategories({ silent: true })',
    'isSaving',
    'Name is required.',
    'Select a category before adding a subcategory.',
    'toastMessage',
    'AppToast',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('service categories page supports functional add category saves from each group card', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'CategoryFormModal',
    'categoryForm',
    'categoryName',
    'categoryType',
    'handleOpenAddCategory',
    'handleSaveCategory',
    'createCategory(',
    'Add Category',
    'Category Name',
    'Category Type',
    'Description',
    'Name is required.',
    'Service category created',
    'Unable to save',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('service category cards expose edit category next to the subcategory count', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'handleOpenEditCategory',
    'editingCategoryId',
    'Edit Category',
    'Service category updated',
    'updateCategory(',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /aria-label=\{`Edit category \$\{subCategory\.name\}`\}/);
  assert.match(source, /onClick=\{\(\) => onOpenEditCategory\(subCategory\)\}/);
  assert.match(source, /<Pencil size=\{13\}/);
  assert.match(source, /form\.mode === 'edit' \? 'Edit Category' : 'Add Category'/);
  assert.match(source, /categoryForm\.editingCategoryId/);
});

test('service categories page manages keywords and checklist questions inside the subcategory form', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'Add Checklist / Questions',
    'Question Type',
    'Text',
    'Number',
    'Single Select',
    'Multiple Select / Checkbox',
    'Yes/No',
    'handleAddKeyword',
    'handleRemoveKeyword',
    'handleAddChecklistQuestion',
    'handleUpdateChecklistQuestion',
    'handleRemoveChecklistQuestion',
    'handleMoveChecklistQuestion',
    'ArrowUp',
    'ArrowDown',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('service category cards preserve the reference interaction affordances', async () => {
  const source = await readServiceCategoriesPage();

  assert.match(source, /'use client';/);
  assert.match(source, /aria-label=\{`Add category under \$\{category\.title\}`\}/);
  assert.match(source, /aria-label=\{`Drag \$\{subCategory\.name\}`\}/);
  assert.match(source, /<Plus size=\{15\}/);
  assert.doesNotMatch(source, /\+ Add Keyword/);
  assert.doesNotMatch(source, /category\.canAddKeyword/);
  assert.doesNotMatch(source, /onOpenKeywords/);
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

test('subcategory detail table shows checklist yes or no and keyword counts', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'SUBCATEGORIES ITEM',
    'CHECKLIST',
    'KEYWORDS',
    'Checklist: Yes',
    'Checklist: No',
    "subcategory.checklist.length ? 'Yes' : 'No'",
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /Keywords \(\$\{subcategory\.keywords\.length\}\)/);
  assert.match(source, /grid-cols-\[48px_minmax\(220px,1fr\)_140px_140px_120px\]/);
  assert.doesNotMatch(source, /<span>TYPE<\/span>/);
  assert.doesNotMatch(source, /'STANDARD'/);
});

test('subcategory detail modal displays keywords and checklist questions', async () => {
  const source = await readServiceCategoriesPage();

  for (const text of [
    'SubcategoryDetailModal',
    'selectedSubcategory',
    'handleOpenSubcategoryDetail',
    'Subcategory Details',
    'Keywords',
    'Checklist Questions',
    'No keywords added.',
    'No checklist questions added.',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /onClick=\{\(\) => onOpenSubcategoryDetail\(subcategory\)\}/);
  assert.match(source, /selectedSubcategory\.keywords\.map/);
  assert.match(source, /selectedSubcategory\.checklist\.map/);
});

test('sidebar exposes service categories with a tags icon', async () => {
  const source = await readSidebar();

  assert.match(source, /Tags/);
  assert.match(source, /label: 'Service Categories', href: '\/service-categories', icon: Tags/);
});
