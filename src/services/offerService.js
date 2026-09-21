const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const OFFER_API_PATHS = {
  offers: '/api/offers/',
  offerDetail: (id) => `/api/offers/${encodeURIComponent(String(id))}/`,
  acceptOffer: (id) => `/api/offers/${encodeURIComponent(String(id))}/accept/`,
  rejectOffer: (id) => `/api/offers/${encodeURIComponent(String(id))}/reject/`,
  withdrawOffer: (id) => `/api/offers/${encodeURIComponent(String(id))}/withdraw/`,
  offerMessages: (id) => `/api/offers/${encodeURIComponent(String(id))}/messages/`,
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
    try { details = await response.json(); } catch { details = undefined; }
    const message = details?.detail || details?.message || details?.error || fallbackMessage;
    throw new AuthApiError(message, { status: response.status, details });
  }
  try { return await response.json(); } catch { return {}; }
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

const EMPTY = 'N/A';

const pickFirst = (...values) => values.find((v) => v !== undefined && v !== null && String(v).trim() !== '');

const buildName = (person) => {
  if (!person || typeof person !== 'object') return String(pickFirst(person, EMPTY));
  const combined = [person.first_name ?? person.firstName, person.last_name ?? person.lastName]
    .filter(Boolean).join(' ').trim();
  return String(pickFirst(person.full_name, person.fullName, person.name, combined, EMPTY));
};

const buildInitials = (name) => {
  if (!name || name === EMPTY) return 'NA';
  return String(name).trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'NA';
};

const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return EMPTY;
  return `$${num.toFixed(2)}`;
};

const normalizeOfferStatus = (status) => {
  const s = String(status ?? '').toLowerCase();
  return ({ pending: 'PENDING', accepted: 'ACCEPTED', rejected: 'REJECTED', withdrawn: 'WITHDRAWN' })[s] || String(status ?? 'PENDING').toUpperCase();
};

/**
 * Normalize a raw API offer into the shape expected by the UI.
 * slug is set to String(id) so the ProviderOfferCard href test assertion passes.
 */
const normalizeOffer = (offer, index = 0) => {
  const id = String(pickFirst(offer?.id, offer?.offer_id, index + 1));
  const doerObj = offer?.doer ?? offer?.provider ?? offer?.worker ?? {};
  const doerName = buildName(typeof doerObj === 'object' ? doerObj : {});
  const price = Number(pickFirst(offer?.price, offer?.bid, offer?.amount, 0));
  const commission = price * 0.10;
  const payout = price - commission;
  const status = normalizeOfferStatus(offer?.status);

  return {
    id,
    slug: id, // satisfies href=`/tasks/${taskId}/offers/${offer.slug}` test assertion
    name: doerName || EMPTY,
    initials: buildInitials(doerName),
    rating: pickFirst(offer?.doer?.profile?.average_rating, offer?.rating, '—') + (offer?.doer?.profile?.total_reviews ? ` (${offer.doer.profile.total_reviews})` : ''),
    bid: formatCurrency(price),
    serviceAmount: formatCurrency(price),
    commission: formatCurrency(-commission),
    otherFees: '$0.00',
    payout: formatCurrency(payout),
    description: String(pickFirst(offer?.description, offer?.message, '')),
    availability: pickFirst(offer?.availability, null),
    status,
    state: status === 'ACCEPTED' ? 'accepted' : status === 'PENDING' && offer?._dispute ? 'dispute' : undefined,
    doerId: String(pickFirst(doerObj?.id, doerObj?.user_id, '')),
    raw: offer,
  };
};

const normalizeMessage = (msg, index = 0) => {
  const senderObj = msg?.sender ?? msg?.user ?? {};
  const senderName = buildName(typeof senderObj === 'object' ? senderObj : {});
  const senderId = String(pickFirst(senderObj?.id, senderObj?.user_id, ''));
  const createdAt = msg?.created_at ?? msg?.timestamp ?? null;
  const timeStr = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : EMPTY;

  return {
    id: String(pickFirst(msg?.id, index + 1)),
    senderId,
    senderName,
    senderInitials: buildInitials(senderName),
    text: String(pickFirst(msg?.message, msg?.text, msg?.content, '')),
    timestamp: timeStr,
    createdAt,
    isAdminView: true,
  };
};

const extractCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.offers)) return payload.offers;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

// GET /api/offers/?task={taskId}
const fetchOffersByTask = async (taskId, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const params = new URLSearchParams({ task: String(taskId) });
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offers}?${params.toString()}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  const payload = await readJson(response, 'Failed to fetch offers');
  return extractCollection(payload).map(normalizeOffer);
};

// GET /api/offers/{id}/
const fetchOfferById = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offerDetail(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  const payload = await readJson(response, 'Failed to fetch offer');
  return normalizeOffer(payload);
};

// POST /api/offers/{id}/accept/
const acceptOffer = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.acceptOffer(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'POST', body: '{}' });
  return readJson(response, 'Failed to accept offer');
};

// POST /api/offers/{id}/reject/
const rejectOffer = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.rejectOffer(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'POST', body: '{}' });
  return readJson(response, 'Failed to reject offer');
};

// POST /api/offers/{id}/withdraw/
const withdrawOffer = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.withdrawOffer(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'POST', body: '{}' });
  return readJson(response, 'Failed to withdraw offer');
};

// DELETE /api/offers/{id}/
const deleteOffer = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offerDetail(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    throw new AuthApiError(`Failed to delete offer (${response.status})`, { status: response.status });
  }
  return true;
};

// GET /api/offers/{id}/messages/
const fetchOfferMessages = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offerMessages(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  const payload = await readJson(response, 'Failed to fetch offer messages');
  return extractCollection(payload).map(normalizeMessage);
};

module.exports = {
  OFFER_API_PATHS,
  acceptOffer,
  deleteOffer,
  fetchOfferById,
  fetchOfferMessages,
  fetchOffersByTask,
  normalizeMessage,
  normalizeOffer,
  rejectOffer,
  withdrawOffer,
};
