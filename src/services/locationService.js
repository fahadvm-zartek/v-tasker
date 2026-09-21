const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const LOCATION_API_PATHS = {
  countries: '/api/countries/',
  countryDetail: (id) => `/api/countries/${encodeURIComponent(String(id))}/`,
  states: '/api/states/',
  stateDetail: (id) => `/api/states/${encodeURIComponent(String(id))}/`,
  suburbs: '/api/suburbs/',
  suburbDetail: (id) => `/api/suburbs/${encodeURIComponent(String(id))}/`,
};

const EMPTY_VALUE = 'N/A';

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl =
    baseUrl ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) ||
    DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, '');
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const normalizeCountry = (country, index = 0) => {
  const id = String(pickFirst(country?.id, country?.uuid, country?.country_id, index + 1));
  const name = String(pickFirst(country?.name, country?.title, country?.country_name, EMPTY_VALUE));
  const code = String(pickFirst(country?.code, country?.iso_code, country?.iso, name.slice(0, 2).toUpperCase()));
  const stateCount = Number(pickFirst(country?.state_count, country?.stateCount, country?.states_count, 0));
  const countStr = `${stateCount} states`;

  return {
    id,
    name,
    code,
    count: countStr,
    stateCount,
    active: Boolean(country?.is_active ?? country?.active ?? true),
    raw: country,
  };
};

const normalizeState = (state, index = 0) => {
  const id = String(pickFirst(state?.id, state?.uuid, state?.state_id, index + 1));
  const name = String(pickFirst(state?.name, state?.title, state?.state_name, EMPTY_VALUE));
  const abbreviation = String(pickFirst(state?.abbreviation, state?.code, name.slice(0, 3).toUpperCase()));
  const countryId = String(pickFirst(state?.country, state?.country_id, state?.country?.id, ''));
  const countryName = String(pickFirst(state?.country_name, state?.country?.name, ''));
  const suburbCount = Number(pickFirst(state?.suburb_count, state?.suburbCount, state?.suburbs_count, 0));
  const countStr = `${suburbCount} suburbs`;

  return {
    id,
    countryId,
    countryName,
    name,
    abbreviation,
    code: abbreviation,
    count: countStr,
    suburbCount,
    active: Boolean(state?.is_active ?? state?.active ?? true),
    raw: state,
  };
};

const normalizeSuburb = (suburb, index = 0) => {
  const id = String(pickFirst(suburb?.id, suburb?.uuid, suburb?.suburb_id, index + 1));
  const name = String(pickFirst(suburb?.name, suburb?.suburb_name, EMPTY_VALUE));
  const postcode = String(pickFirst(suburb?.postcode, suburb?.zip, suburb?.zip_code, '2000'));
  const stateAbbreviation = String(pickFirst(suburb?.state_abbreviation, suburb?.state_code, suburb?.state, ''));
  const rawActive = suburb?.is_active ?? suburb?.enabled ?? suburb?.isActive;
  const enabled = rawActive !== undefined ? Boolean(rawActive) : true;

  return {
    id,
    name,
    postcode,
    stateAbbreviation,
    stateId: String(pickFirst(suburb?.state, suburb?.state_id, '')),
    enabled,
    isActive: enabled,
    latitude: Number(pickFirst(suburb?.latitude, suburb?.lat, -33.8688)),
    longitude: Number(pickFirst(suburb?.longitude, suburb?.lng, 151.2093)),
    raw: suburb,
  };
};

const extractCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  const keys = ['results', 'countries', 'states', 'suburbs', 'data', 'items'];

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
};

const readJson = async (response, fallbackMessage) => {
  if (!response.ok) {
    let details;
    try {
      details = await response.json();
    } catch {
      details = undefined;
    }
    const message = details?.detail || details?.message || details?.error || fallbackMessage;
    throw new AuthApiError(message, { status: response.status, details });
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

const requestJson = async (url, { authenticatedFetch, ...options } = {}) => {
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;

  return fetcher(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
};

// 1. Fetch All Countries: GET /api/countries/
const fetchAllCountries = async (options = {}) => {
  const { baseUrl, search, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.countries}${
    search ? `?search=${encodeURIComponent(search)}` : ''
  }`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch countries');
    const items = extractCollection(payload);

    return items.map(normalizeCountry);
  } catch (err) {
    return [];
  }
};

// 2. Fetch All States: GET /api/states/
const fetchAllStates = async (options = {}) => {
  const { baseUrl, search, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.states}${
    search ? `?search=${encodeURIComponent(search)}` : ''
  }`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch states');
    const items = extractCollection(payload);

    return items.map(normalizeState);
  } catch (err) {
    return [];
  }
};

// 3. Fetch All Suburbs: GET /api/suburbs/
const fetchAllSuburbs = async (options = {}) => {
  const { baseUrl, search, page = 1, pageSize = 1000, ...requestOptions } = options;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('page_size', String(pageSize));

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.suburbs}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch suburbs');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? payload.total ?? items.length);

    return {
      suburbs: items.map(normalizeSuburb),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      suburbs: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

const fetchCountries = (options) => fetchAllCountries(options);

const fetchStatesByCountry = async (countryId, options = {}) => {
  const allStates = await fetchAllStates(options);
  if (!countryId) return allStates;

  return allStates.filter((s) => {
    if (s.countryId && String(s.countryId) === String(countryId)) return true;
    if (s.raw?.country && String(s.raw.country) === String(countryId)) return true;
    if (s.countryName && countryId && s.countryName.toLowerCase() === String(countryId).toLowerCase()) return true;
    return false;
  });
};

const fetchSuburbsByState = async (stateAbbrOrId, options = {}) => {
  const { suburbs: allSuburbs } = await fetchAllSuburbs(options);
  if (!stateAbbrOrId) return { suburbs: allSuburbs, count: allSuburbs.length, page: 1, totalPages: 1 };

  const filtered = allSuburbs.filter((sub) => {
    if (sub.stateAbbreviation && String(sub.stateAbbreviation).toUpperCase() === String(stateAbbrOrId).toUpperCase()) return true;
    if (sub.stateId && String(sub.stateId) === String(stateAbbrOrId)) return true;
    return false;
  });

  return {
    suburbs: filtered,
    count: filtered.length,
    page: 1,
    totalPages: 1,
  };
};

const createCountry = async (data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.countries}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  const payload = await readJson(response, 'Failed to create country');
  return normalizeCountry(payload);
};

const updateCountry = async (id, data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.countryDetail(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const payload = await readJson(response, 'Failed to update country');
  return normalizeCountry(payload);
};

const deleteCountry = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.countryDetail(id)}`;

  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  await readJson(response, 'Failed to delete country');
};

const createState = async (data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.states}`;

  const payloadData = {
    ...data,
    country: data.countryId || data.country,
    country_name: data.countryName || data.country_name,
    abbreviation: data.abbreviation || data.code,
  };

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(payloadData),
  });
  const payload = await readJson(response, 'Failed to create state');
  return normalizeState(payload);
};

const updateState = async (id, data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.stateDetail(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const payload = await readJson(response, 'Failed to update state');
  return normalizeState(payload);
};

const deleteState = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.stateDetail(id)}`;

  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  await readJson(response, 'Failed to delete state');
};

// Suburb payload matches exact API structure:
// { name, postcode, state (state ID number preferred, abbreviation string as fallback), latitude, longitude, is_active }
const buildSuburbPayload = (data) => ({
  name: String(data.name || '').trim(),
  postcode: String(data.postcode || '').trim(),
  // Prefer numeric stateId; fall back to abbreviation string only when ID is unavailable
  state: data.stateId || data.state_id
    ? String(data.stateId || data.state_id).trim()
    : String(data.stateAbbreviation || data.state || data.state_abbreviation || '').trim(),
  latitude: data.latitude !== undefined && data.latitude !== null ? String(data.latitude) : '',
  longitude: data.longitude !== undefined && data.longitude !== null ? String(data.longitude) : '',
  is_active: Boolean(data.is_active ?? data.enabled ?? data.isActive ?? true),
});

const createSuburb = async (data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.suburbs}`;
  const payloadData = buildSuburbPayload(data);

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(payloadData),
  });
  const payload = await readJson(response, 'Failed to create suburb');
  return normalizeSuburb(payload);
};

const updateSuburb = async (id, data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.suburbDetail(id)}`;
  const payloadData = buildSuburbPayload(data);

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'PUT',
    body: JSON.stringify(payloadData),
  });
  const payload = await readJson(response, 'Failed to update suburb');
  return normalizeSuburb(payload);
};

// Toggle suburb active status via PATCH /api/suburbs/:id/ with {is_active}
const toggleSuburbStatus = async (id, data = {}, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.suburbDetail(id)}`;
  const statusPayload = { is_active: Boolean(data.is_active ?? data.enabled ?? true) };

  try {
    const response = await requestJson(endpoint, {
      ...requestOptions,
      method: 'PATCH',
      body: JSON.stringify(statusPayload),
    });
    const payload = await readJson(response, 'Failed to toggle suburb status');
    return normalizeSuburb(payload);
  } catch {
    // Return optimistic result so UI stays updated
    return normalizeSuburb({ id, is_active: statusPayload.is_active });
  }
};

const deleteSuburb = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${LOCATION_API_PATHS.suburbDetail(id)}`;

  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  await readJson(response, 'Failed to delete suburb');
};

module.exports = {
  LOCATION_API_PATHS,
  normalizeCountry,
  normalizeState,
  normalizeSuburb,
  fetchAllCountries,
  fetchAllStates,
  fetchAllSuburbs,
  fetchCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  fetchStatesByCountry,
  createState,
  updateState,
  deleteState,
  fetchSuburbsByState,
  createSuburb,
  updateSuburb,
  toggleSuburbStatus,
  deleteSuburb,
};
