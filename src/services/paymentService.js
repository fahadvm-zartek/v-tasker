const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const PAYMENT_API_PATHS = {
  allWallets: '/api/wallets/all/',
  withdrawals: '/api/withdrawals/',
  withdrawalDetail: (id) => `/api/withdrawals/${encodeURIComponent(String(id))}/`,
  approveWithdrawal: (id) => `/api/withdrawals/${encodeURIComponent(String(id))}/approve/`,
  rejectWithdrawal: (id) => `/api/withdrawals/${encodeURIComponent(String(id))}/reject/`,
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

const extractCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const fetchAllWallets = async (options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${PAYMENT_API_PATHS.allWallets}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch wallets');
    return extractCollection(payload);
  } catch (err) {
    return [];
  }
};

const fetchWithdrawalsPage = async (options = {}) => {
  const { baseUrl, page = 1, pageSize = 10, status, user, search, ...requestOptions } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  if (status) params.set('status', status);
  if (user) params.set('user', String(user));
  if (search) params.set('search', search);

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${PAYMENT_API_PATHS.withdrawals}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch withdrawals');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? items.length);

    return {
      withdrawals: items,
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      withdrawals: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

const approveWithdrawal = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${PAYMENT_API_PATHS.approveWithdrawal(id)}`;

  const response = await requestJson(endpoint, { ...requestOptions, method: 'POST' });
  return await readJson(response, 'Failed to approve withdrawal');
};

const rejectWithdrawal = async (id, reason = '', options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${PAYMENT_API_PATHS.rejectWithdrawal(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  return await readJson(response, 'Failed to reject withdrawal');
};

module.exports = {
  PAYMENT_API_PATHS,
  approveWithdrawal,
  fetchAllWallets,
  fetchWithdrawalsPage,
  rejectWithdrawal,
};
