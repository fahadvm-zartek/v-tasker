import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LOCATION_API_PATHS,
  normalizeCountry,
  normalizeState,
  normalizeSuburb,
  fetchAllCountries,
  fetchAllStates,
  fetchAllSuburbs,
  fetchStatesByCountry,
  fetchSuburbsByState,
} from './locationService.js';

test('locationService exports correct API endpoint builders', () => {
  assert.equal(LOCATION_API_PATHS.countries, '/api/countries/');
  assert.equal(LOCATION_API_PATHS.countryDetail('123'), '/api/countries/123/');
  assert.equal(LOCATION_API_PATHS.states, '/api/states/');
  assert.equal(LOCATION_API_PATHS.stateDetail('s-1'), '/api/states/s-1/');
  assert.equal(LOCATION_API_PATHS.suburbs, '/api/suburbs/');
  assert.equal(LOCATION_API_PATHS.suburbDetail('sub-5'), '/api/suburbs/sub-5/');
  assert.equal(LOCATION_API_PATHS.suburbStatus('sub-5'), '/api/suburbs/sub-5/status/');
});

test('normalizeCountry maps properties with fallbacks', () => {
  const normalized = normalizeCountry({ name: 'Australia', state_count: 8 });
  assert.equal(normalized.name, 'Australia');
  assert.equal(normalized.code, 'AU');
  assert.equal(normalized.stateCount, 8);
  assert.equal(normalized.count, '8 states');
});

test('normalizeState maps properties with fallbacks', () => {
  const normalized = normalizeState({ name: 'New South Wales', suburb_count: 142 });
  assert.equal(normalized.name, 'New South Wales');
  assert.equal(normalized.code, 'NEW');
  assert.equal(normalized.suburbCount, 142);
  assert.equal(normalized.count, '142 suburbs');
});

test('normalizeSuburb maps properties with fallbacks', () => {
  const normalized = normalizeSuburb({ suburb_name: 'Alexandria', postcode: '2015', is_active: true });
  assert.equal(normalized.name, 'Alexandria');
  assert.equal(normalized.postcode, '2015');
  assert.equal(normalized.enabled, true);
  assert.equal(normalized.isActive, true);
});

test('fetchAllCountries requests /api/countries/ endpoint', async () => {
  const mockFetch = async (url) => {
    assert.ok(url.includes('/api/countries/'));
    return {
      ok: true,
      json: async () => ({ results: [{ id: '1', name: 'India', code: 'IN' }] }),
    };
  };

  const countries = await fetchAllCountries({ authenticatedFetch: mockFetch });
  assert.ok(Array.isArray(countries));
  assert.equal(countries.length, 1);
  assert.equal(countries[0].name, 'India');
});

test('fetchAllStates and fetchStatesByCountry request /api/states/ endpoint and filter frontend', async () => {
  const mockFetch = async (url) => {
    assert.ok(url.includes('/api/states/'));
    return {
      ok: true,
      json: async () => ({ results: [{ id: 's-10', country_id: 'c-1', name: 'Maharashtra', code: 'MH' }] }),
    };
  };

  const states = await fetchStatesByCountry('c-1', { authenticatedFetch: mockFetch });
  assert.ok(Array.isArray(states));
  assert.equal(states.length, 1);
  assert.equal(states[0].name, 'Maharashtra');
});

test('fetchAllSuburbs and fetchSuburbsByState request /api/suburbs/ endpoint and filter frontend', async () => {
  const mockFetch = async (url) => {
    assert.ok(url.includes('/api/suburbs/'));
    return {
      ok: true,
      json: async () => ({ count: 1, results: [{ id: 'sub-100', state_id: 's-10', name: 'Andheri', postcode: '400053' }] }),
    };
  };

  const result = await fetchSuburbsByState('s-10', { authenticatedFetch: mockFetch });
  assert.ok(Array.isArray(result.suburbs));
  assert.equal(result.suburbs.length, 1);
  assert.equal(result.suburbs[0].name, 'Andheri');
  assert.equal(result.count, 1);
});
