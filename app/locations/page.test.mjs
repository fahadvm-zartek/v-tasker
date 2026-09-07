import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readLocationsPage = () => readFile(new URL('./page.tsx', import.meta.url), 'utf8');
const readSidebar = () => readFile(new URL('../components/Sidebar.tsx', import.meta.url), 'utf8');

test('locations page renders the country state suburb manager from the provided reference', async () => {
  const source = await readLocationsPage();

  assert.doesNotMatch(source, /DashboardPlaceholderPage/);
  assert.match(source, /DashboardPageShell/);

  for (const text of [
    'Countries',
    'Search countries...',
    'Australia',
    '8 states',
    'United States',
    '50 states',
    'United Kingdom',
    '4 regions',
    'New Zealand',
    '16 regions',
    '+ Add New Country',
    'States / Regions',
    'Search states...',
    'Victoria',
    '89 suburbs',
    'New South Wales',
    '142 suburbs',
    'Queensland',
    '115 suburbs',
    'Western Australia',
    '76 suburbs',
    'South Australia',
    '64 suburbs',
    '+ Add New State',
    'Suburbs in New South Wales',
    '142 suburbs registered in this state',
    '+ Add Suburb',
    'Search suburbs...',
    'Suburb Name',
    'Map View',
    'Postcode',
    'Actions',
    'Alexandria',
    'View Map',
    '2015',
    'Annandale',
    '2038',
    'Balmain',
    '2041',
    'Bondi Beach',
    '2026',
    'Chatswood',
    '2067',
    'Darlinghurst',
    '2010',
    'Showing 1-20 of 142',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('sidebar exposes locations with a map pin icon', async () => {
  const source = await readSidebar();

  assert.match(source, /MapPin/);
  assert.match(source, /label: 'Locations', href: '\/locations', icon: MapPin/);
});

test('suburbs table fits the New South Wales panel without horizontal scrolling', async () => {
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
