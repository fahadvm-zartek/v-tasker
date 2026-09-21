const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const DISPUTE_API_PATHS = {
  disputes: '/api/disputes/',
  disputeDetail: (id) => `/api/disputes/${encodeURIComponent(String(id).replace(/^#/, ''))}/`,
  resolve: (id) => `/api/disputes/${encodeURIComponent(String(id).replace(/^#/, ''))}/resolve/`,
  addActivity: (id) => `/api/disputes/${encodeURIComponent(String(id).replace(/^#/, ''))}/add-activity/`,
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
  if (Array.isArray(payload?.disputes)) return payload.disputes;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeDispute = (dispute, index = 0) => {
  const id = String(dispute?.id ?? dispute?.dispute_id ?? index + 1);
  const formattedId = id.startsWith('#') ? id : `#DIS-${id}`;
  const taskId = String(dispute?.task ?? dispute?.task_id ?? 'N/A');
  const taskFormatted = taskId.startsWith('#') ? taskId : `#TSK-${taskId}`;
  const service = String(dispute?.task_title ?? dispute?.task_name ?? dispute?.service ?? 'N/A');
  const raisedBy = String(dispute?.raised_by_name ?? dispute?.raised_by ?? dispute?.created_by ?? 'N/A');
  const role = String(dispute?.raised_by_role ?? dispute?.role ?? 'Client');
  const against = String(dispute?.against_name ?? dispute?.against ?? 'N/A');
  const category = String(dispute?.category ?? dispute?.reason_category ?? 'Payment');
  const status = String(dispute?.status ?? 'Dispute Raised');
  const date = String(dispute?.created_at ?? dispute?.date ?? dispute?.date_filed ?? 'N/A');

  return {
    id: formattedId,
    rawId: id,
    task: taskFormatted,
    service,
    raisedBy,
    role,
    initials: raisedBy.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'NA',
    avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    against,
    category,
    status,
    date,
    raw: dispute,
  };
};

const fetchDisputesPage = async (options = {}) => {
  const { baseUrl, page = 1, pageSize = 10, search, status, task, ...requestOptions } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (task) params.set('task', String(task));

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${DISPUTE_API_PATHS.disputes}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch disputes');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? items.length);

    return {
      disputes: items.map(normalizeDispute),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      disputes: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

const fetchDisputeById = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${DISPUTE_API_PATHS.disputeDetail(id)}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch dispute details');
    return {
      raw: payload,
      summary: normalizeDispute(payload),
    };
  } catch (err) {
    return null;
  }
};

const resolveDispute = async (id, data = {}, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${DISPUTE_API_PATHS.resolve(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  const payload = await readJson(response, 'Failed to resolve dispute');
  return normalizeDispute(payload);
};

const addDisputeActivity = async (id, data = {}, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${DISPUTE_API_PATHS.addActivity(id)}`;

  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await readJson(response, 'Failed to add dispute activity');
};

module.exports = {
  DISPUTE_API_PATHS,
  addDisputeActivity,
  fetchDisputeById,
  fetchDisputesPage,
  normalizeDispute,
  resolveDispute,
};
