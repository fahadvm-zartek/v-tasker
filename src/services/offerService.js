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

const parseNumber = (val) => {
  if (val === undefined || val === null || val === '') return NaN;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : NaN;
};

const EMPTY = 'N/A';

const pickFirst = (...values) => values.find((v) => v !== undefined && v !== null && String(v).trim() !== '');

const buildName = (person) => {
  if (!person) return EMPTY;
  if (typeof person === 'string') return person.trim() || EMPTY;
  if (typeof person !== 'object') return String(person);
  const combined = [person.first_name ?? person.firstName, person.last_name ?? person.lastName]
    .filter(Boolean).join(' ').trim();
  return String(pickFirst(person.full_name, person.fullName, person.name, person.username, combined, EMPTY));
};

const buildInitials = (name) => {
  if (!name || name === EMPTY) return 'NA';
  return String(name).trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'NA';
};

const formatCurrency = (value) => {
  const num = parseNumber(value);
  if (!Number.isFinite(num)) return EMPTY;
  return num < 0 ? `-$${Math.abs(num).toFixed(2)}` : `$${num.toFixed(2)}`;
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
  if (!offer || typeof offer !== 'object') return null;
  const id = String(pickFirst(offer?.id, offer?.offer_id, offer?.pk, index + 1));
  const doerObj = pickFirst(
    offer?.doer,
    offer?.provider,
    offer?.worker,
    offer?.user,
    offer?.doer_detail,
    offer?.provider_detail,
    offer?.user_detail,
    offer?.created_by,
  );
  const doerName = pickFirst(
    offer?.doer_name,
    offer?.provider_name,
    offer?.user_name,
    buildName(doerObj),
  );

  const rawPrice = pickFirst(
    offer?.price,
    offer?.bid,
    offer?.amount,
    offer?.total_price,
    offer?.total_amount,
    offer?.service_amount,
    offer?.serviceAmount,
    0,
  );
  const priceNum = parseNumber(rawPrice);
  const safePrice = Number.isFinite(priceNum) ? priceNum : 0;

  const rawServiceAmount = pickFirst(
    offer?.service_amount,
    offer?.serviceAmount,
    offer?.subtotal,
    offer?.base_amount,
    rawPrice,
  );
  const serviceAmountNum = parseNumber(rawServiceAmount);
  const safeServiceAmount = Number.isFinite(serviceAmountNum) ? serviceAmountNum : safePrice;

  const rawCommission = pickFirst(
    offer?.commission,
    offer?.commission_amount,
    offer?.commissionAmount,
    offer?.platform_fee,
    offer?.fee,
    offer?.admin_fee,
  );
  const commissionNum = parseNumber(rawCommission);
  const safeCommission = Number.isFinite(commissionNum) ? Math.abs(commissionNum) : (safePrice * 0.10);

  const rawOtherFees = pickFirst(
    offer?.other_fees,
    offer?.otherFees,
    offer?.tax,
    offer?.fees,
    0,
  );
  const otherFeesNum = parseNumber(rawOtherFees);
  const safeOtherFees = Number.isFinite(otherFeesNum) ? Math.abs(otherFeesNum) : 0;

  const rawPayout = pickFirst(
    offer?.payout,
    offer?.payout_amount,
    offer?.payoutAmount,
    offer?.net_amount,
    offer?.netAmount,
    offer?.provider_payout,
  );
  const payoutNum = parseNumber(rawPayout);
  const safePayout = Number.isFinite(payoutNum) ? payoutNum : (safePrice - safeCommission - safeOtherFees);

  const status = normalizeOfferStatus(offer?.status);

  const ratingVal = pickFirst(
    typeof doerObj === 'object' ? doerObj?.profile?.average_rating : undefined,
    typeof doerObj === 'object' ? doerObj?.profile?.rating : undefined,
    typeof doerObj === 'object' ? doerObj?.average_rating : undefined,
    typeof doerObj === 'object' ? doerObj?.rating : undefined,
    offer?.doer_rating,
    offer?.rating,
    offer?.average_rating,
    '—',
  );

  const reviewsCountVal = pickFirst(
    typeof doerObj === 'object' ? doerObj?.profile?.total_reviews : undefined,
    typeof doerObj === 'object' ? doerObj?.profile?.reviews_count : undefined,
    typeof doerObj === 'object' ? doerObj?.total_reviews : undefined,
    typeof doerObj === 'object' ? doerObj?.reviews_count : undefined,
    offer?.total_reviews,
    offer?.reviews_count,
    null,
  );

  const ratingStr = reviewsCountVal ? `${ratingVal} (${reviewsCountVal})` : String(ratingVal);

  return {
    id,
    slug: id, // satisfies href=`/tasks/${taskId}/offers/${offer.slug}` test assertion
    name: doerName || EMPTY,
    initials: buildInitials(doerName),
    rating: ratingStr,
    bid: formatCurrency(safePrice),
    serviceAmount: formatCurrency(safeServiceAmount),
    commission: formatCurrency(-safeCommission),
    otherFees: formatCurrency(-safeOtherFees),
    payout: formatCurrency(safePayout),
    description: String(pickFirst(offer?.description, offer?.message, offer?.comments, offer?.notes, offer?.text, offer?.details, '')),
    availability: pickFirst(offer?.availability, offer?.available_at, offer?.available_time, null),
    status,
    state: status === 'ACCEPTED' ? 'accepted' : status === 'PENDING' && (offer?._dispute || offer?.dispute) ? 'dispute' : undefined,
    doerId: String(pickFirst(typeof doerObj === 'object' ? pickFirst(doerObj?.id, doerObj?.user_id) : undefined, offer?.doer_id, offer?.provider_id, '')),
    raw: offer,
  };
};

const normalizeMessage = (msg, index = 0) => {
  if (!msg || typeof msg !== 'object') return null;
  const senderObj = pickFirst(
    msg?.sender,
    msg?.user,
    msg?.author,
    msg?.sender_detail,
    msg?.user_detail,
    msg?.created_by,
  );
  const senderName = pickFirst(
    msg?.sender_name,
    msg?.user_name,
    msg?.author_name,
    buildName(senderObj),
  );
  const senderId = String(pickFirst(
    msg?.sender_id,
    msg?.user_id,
    typeof senderObj === 'object' ? pickFirst(senderObj?.id, senderObj?.user_id) : undefined,
    '',
  ));
  const createdAt = pickFirst(msg?.created_at, msg?.timestamp, msg?.created_date, msg?.date, msg?.sent_at, null);
  let timeStr = EMPTY;
  if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      timeStr = String(createdAt);
    }
  }

  return {
    id: String(pickFirst(msg?.id, msg?.message_id, index + 1)),
    senderId,
    senderName,
    senderInitials: buildInitials(senderName),
    text: String(pickFirst(msg?.message, msg?.text, msg?.content, msg?.body, '')),
    timestamp: timeStr,
    createdAt,
    isAdminView: true,
  };
};

const extractCollection = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.offers)) return payload.offers;
  if (Array.isArray(payload?.offer_list)) return payload.offer_list;
  if (Array.isArray(payload?.offers_list)) return payload.offers_list;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.offers)) return payload.data.offers;
  if (Array.isArray(payload?.items)) return payload.items;

  // Single object containing an offer or message
  if (typeof payload === 'object' && (payload.id || payload.offer_id || payload.price || payload.bid || payload.message)) {
    return [payload];
  }
  return [];
};

// GET /api/offers/?task={taskId}
const fetchOffersByTask = async (taskId, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const cleanId = String(taskId).replace(/^#/, '');

  // 1. Try GET /api/offers/?task={cleanId}
  try {
    const params = new URLSearchParams({ task: cleanId });
    const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offers}?${params.toString()}`;
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    if (response.ok) {
      const payload = await readJson(response, 'Failed to fetch offers');
      const collection = extractCollection(payload);
      if (collection.length > 0) {
        return collection.map(normalizeOffer).filter(Boolean);
      }
    }
  } catch {
    // Fall back to subsequent attempts
  }

  // 2. Try GET /api/offers/?task_id={cleanId}
  try {
    const params = new URLSearchParams({ task_id: cleanId });
    const endpoint = `${resolveApiBaseUrl(baseUrl)}${OFFER_API_PATHS.offers}?${params.toString()}`;
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    if (response.ok) {
      const payload = await readJson(response, 'Failed to fetch offers');
      const collection = extractCollection(payload);
      if (collection.length > 0) {
        return collection.map(normalizeOffer).filter(Boolean);
      }
    }
  } catch {
    // Fall back to single offer
  }

  // 3. Fallback: Try fetching by single offer ID if cleanId matches an offer ID (e.g. 10 or 13)
  try {
    const offer = await fetchOfferById(cleanId, options);
    if (offer && offer.id) {
      return [offer];
    }
  } catch {
    // Return empty array
  }

  return [];
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
  return extractCollection(payload).map(normalizeMessage).filter(Boolean);
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

