import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readLocationsPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../../../components/Sidebar.tsx', import.meta.url), 'utf8');

test('locations page renders the country state suburb manager structure', async () => {
  const source = await readLocationsPage();

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /DashboardPageShell/);

  for (const text of [
    'Countries',
    'Search countries...',
    '+ Add New Country',
    'States / Regions',
    'Search states...',
    '+ Add New State',
    'Suburbs in',
    '+ Add Suburb',
    'Search suburbs...',
    'Suburb Name',
    'Map View',
    'Postcode',
    'Actions',
    'View Map',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('sidebar exposes locations with a map pin icon', async () => {
  const source = await readSidebar();

  assert.match(source, /MapPin/);
  assert.match(source, /label: 'Locations', href: '\/locations', icon: MapPin/);
});

test('suburbs table fits the panel without horizontal scrolling', async () => {
  const source = await readLocationsPage();

  assert.doesNotMatch(source, /overflow-x-auto/);
  assert.doesNotMatch(source, /min-w-\[/);
  assert.match(source, /table-fixed/);
});

test('add suburb button opens a structured add suburb modal', async () => {
  const source = await readLocationsPage();

  for (const text of [
    "'use client'",
    'useState',
    'setIsAddSuburbOpen(true)',
    'role="dialog"',
    'aria-modal="true"',
    'Add New Suburb',
    'Suburb Name',
    'Choose from map',
    'e.g. Surry Hills',
    'Postcode',
    'e.g. 2010',
    'State/Region',
    'Select a state/region...',
    'Cancel',
    'Add Suburb',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('locations page integrates top-level 3 location APIs and map view modal', async () => {
  const source = await readLocationsPage();

  for (const text of [
    'fetchAllCountries',
    'fetchAllStates',
    'fetchAllSuburbs',
    'toggleSuburbStatus',
    'AddCountryModal',
    'AddStateModal',
    'MapModal',
    'ConfirmDeleteModal',
    'ToastContainer',
  ]) {
    assert.match(source, new RegExp(text));
  }
});
