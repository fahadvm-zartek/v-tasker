const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const CANCELLATION_API_PATHS = {
  cancellationFees: '/api/cancellation-fees/',
  cancellationFeeDetail: (id) => `/api/cancellation-fees/${encodeURIComponent(String(id).replace(/^#/, ''))}/`,
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

const normalizeCancellation = (item, index = 0) => {
  const id = String(item?.id ?? index + 1);
  const formattedId = id.startsWith('#') ? id : `#CAN-${id}`;
  const taskId = String(item?.task ?? item?.task_id ?? 'N/A');
  const taskFormatted = taskId.startsWith('#') ? taskId : `#TSK-${taskId}`;
  const service = String(item?.task_title ?? item?.service ?? 'Task Cancellation');
  const userEmail = String(item?.user_email ?? item?.email ?? 'N/A');
  const initiatedBy = userEmail.split('@')[0] || 'User';
  const amount = item?.amount !== undefined ? `$${Number(item.amount).toFixed(2)}` : '$0.00';
  const reason = String(item?.reason ?? 'No reason provided');
  const isPaid = Boolean(item?.is_paid);
  const status = isPaid ? 'Cancelled & Settled' : 'Payment Cancelled';
  const date = item?.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  return {
    id: formattedId,
    rawId: id,
    task: taskFormatted,
    service,
    type: 'Task Cancellation',
    initiatedBy,
    role: 'Client',
    initials: initiatedBy.slice(0, 2).toUpperCase(),
    avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    reason,
    amount,
    status,
    isPaid,
    date,
    raw: item,
  };
};

const fetchCancellationFeesPage = async (options = {}) => {
  const { baseUrl, page = 1, pageSize = 10, search, isPaid, task, user, createdAfter, createdBefore, ...requestOptions } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  if (search) params.set('search', search);
  if (isPaid !== undefined) params.set('is_paid', String(isPaid));
  if (task) params.set('task', String(task));
  if (user) params.set('user', String(user));
  if (createdAfter) params.set('created_after', createdAfter);
  if (createdBefore) params.set('created_before', createdBefore);

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${CANCELLATION_API_PATHS.cancellationFees}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch cancellation fees');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? items.length);

    return {
      cancellations: items.map(normalizeCancellation),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      cancellations: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

module.exports = {
  CANCELLATION_API_PATHS,
  fetchCancellationFeesPage,
  normalizeCancellation,
};
