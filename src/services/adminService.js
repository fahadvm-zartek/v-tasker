const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const ADMIN_API_PATHS = {
  dashboard: '/api/admin/dashboard/',
  reports: '/api/admin/reports/',
};

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl =
    baseUrl ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) ||
    DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, '');
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

const fetchAdminDashboard = async (options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${ADMIN_API_PATHS.dashboard}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    return await readJson(response, 'Failed to fetch admin dashboard data');
  } catch (err) {
    return null;
  }
};

const fetchAdminReports = async (options = {}) => {
  const { baseUrl, from, to, ...requestOptions } = options;
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const queryString = params.toString();
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${ADMIN_API_PATHS.reports}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    return await readJson(response, 'Failed to fetch admin reports');
  } catch (err) {
    return null;
  }
};

module.exports = {
  ADMIN_API_PATHS,
  fetchAdminDashboard,
  fetchAdminReports,
};
