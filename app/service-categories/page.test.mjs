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

  assert.match(source, /aria-label=\{`Add sub-category to \$\{category\.title\}`\}/);
  assert.match(source, /aria-label=\{`Drag \$\{subCategory\.name\}`\}/);
  assert.match(source, /<Plus size=\{15\}/);
  assert.match(source, /border-dashed/);
  assert.match(source, /category\.isActive/);
  assert.match(source, /category\.canAddKeyword/);
});

test('sidebar exposes service categories with a tags icon', async () => {
  const source = await readSidebar();

  assert.match(source, /Tags/);
  assert.match(source, /label: 'Service Categories', href: '\/service-categories', icon: Tags/);
});
