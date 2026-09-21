const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const REWARDS_API_PATHS = {
  rewardConfigs: '/api/reward-configs/',
  rewardConfigDetail: (id) => `/api/reward-configs/${encodeURIComponent(String(id))}/`,
  rewardClaims: '/api/reward-claims/',
  rewardClaimDetail: (id) => `/api/reward-claims/${encodeURIComponent(String(id))}/`,
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
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const fetchRewardConfigs = async (options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardConfigs}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch reward configs');
    return extractCollection(payload);
  } catch (err) {
    return [];
  }
};

const createRewardConfig = async (data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardConfigs}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await readJson(response, 'Failed to create reward config');
};

const updateRewardConfig = async (id, data, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardConfigDetail(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return await readJson(response, 'Failed to update reward config');
};

const deleteRewardConfig = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardConfigDetail(id)}`;

  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  await readJson(response, 'Failed to delete reward config');
};

const fetchRewardClaims = async (options = {}) => {
  const { baseUrl, page = 1, pageSize = 10, ...requestOptions } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardClaims}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch reward claims');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? items.length);

    return {
      claims: items,
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      claims: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

const fetchRewardClaimById = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardClaimDetail(id)}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    return await readJson(response, 'Failed to fetch reward claim detail');
  } catch (err) {
    return null;
  }
};

const updateRewardClaimStatus = async (id, status, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${REWARDS_API_PATHS.rewardClaimDetail(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return await readJson(response, 'Failed to update reward claim status');
};

module.exports = {
  REWARDS_API_PATHS,
  createRewardConfig,
  deleteRewardConfig,
  fetchRewardClaimById,
  fetchRewardClaims,
  fetchRewardConfigs,
  updateRewardConfig,
  updateRewardClaimStatus,
};
