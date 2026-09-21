const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const USER_API_PATHS = {
  users: '/api/users',
  userDetail: (id) => `/api/users/${encodeURIComponent(normalizeRouteId(id))}`,
};

const avatarClasses = [
  'bg-[#eef2ff] text-[#1B3061]',
  'bg-[#eedcff] text-[#8b5cf6]',
  'bg-[#cbf7e6] text-[#059669]',
  'bg-[#ffe0e3] text-[#f43f5e]',
];

const EMPTY_VALUE = 'N/A';

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl =
    baseUrl ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) ||
    DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, '');
};

const normalizeRouteId = (id) => String(id ?? '').trim().replace(/^#/, '');

const appendQueryParam = (params, key, value) => {
  if (value === undefined || value === null || value === '') return;

  params.set(key, String(value));
};

const normalizeUsersQuery = (query) => {
  if (typeof query === 'number') {
    return { page: query };
  }

  return query || {};
};

const getUsersEndpoint = (baseUrl, query) => {
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${USER_API_PATHS.users}`;
  const queryOptions = normalizeUsersQuery(query);
  const params = new URLSearchParams();
  const pageNumber = Number(queryOptions.page);
  const pageSize = Number(queryOptions.pageSize);

  if (Number.isFinite(pageNumber) && pageNumber > 1) {
    params.set('page', String(pageNumber));
  }

  if (Number.isFinite(pageSize) && pageSize > 0) {
    params.set('page_size', String(pageSize));
  }

  appendQueryParam(params, 'date_joined_after', queryOptions.dateJoinedAfter);
  appendQueryParam(params, 'date_joined_before', queryOptions.dateJoinedBefore);
  appendQueryParam(params, 'is_active', queryOptions.isActive);
  appendQueryParam(params, 'is_email_verified', queryOptions.isEmailVerified);
  appendQueryParam(params, 'is_phone_verified', queryOptions.isPhoneVerified);
  appendQueryParam(params, 'ordering', queryOptions.ordering);
  appendQueryParam(params, 'phone', queryOptions.phone);
  appendQueryParam(params, 'search', queryOptions.search);
  appendQueryParam(params, 'user_type', queryOptions.userType);

  const queryString = params.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
};
const getUserEndpoint = (id, baseUrl) => `${resolveApiBaseUrl(baseUrl)}${USER_API_PATHS.userDetail(id)}`;

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const buildName = (user) => {
  const firstLast = [user.first_name, user.firstName, user.first, user.given_name]
    .concat([user.last_name, user.lastName, user.last, user.family_name])
    .filter(Boolean)
    .join(' ')
    .trim();

  return String(pickFirst(user.full_name, user.fullName, user.name, firstLast, EMPTY_VALUE));
};

const buildInitials = (name) => {
  if (String(name).trim() === EMPTY_VALUE) {
    return 'NA';
  }

  const words = String(name).replace(/[._-]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('');
  return initials || 'UU';
};

const normalizeRole = (role) => {
  const source = Array.isArray(role) ? role.join(' ') : String(role ?? '').toLowerCase();
  const original = Array.isArray(role) ? role.join(', ') : String(role ?? '').trim();

  if (!original) return EMPTY_VALUE;

  if (source.includes('both')) return 'Both';
  if (source.includes('poster')) return 'Task Poster';
  if (source.includes('doer') || source.includes('provider')) return 'Task Doer';

  return original;
};

const extractUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const extractUser = (payload) => payload?.user || payload?.data || payload;

const readJson = async (response) => {
  if (!response.ok) {
    throw new AuthApiError(`Users request failed with status ${response.status}.`, { status: response.status });
  }

  return response.json();
};

const normalizeUserSummary = (user, index = 0) => {
  const name = buildName(user);
  const id = String(pickFirst(user.id, user.uuid, user.user_id, user.userId, user.customer_id, user.customerId, index + 1));

  return {
    id,
    name,
    initials: String(pickFirst(user.initials, buildInitials(name))).toUpperCase(),
    avatarClass: String(pickFirst(user.avatarClass, user.avatar_class, avatarClasses[index % avatarClasses.length])),
    mobile: String(pickFirst(user.mobile, user.phone, user.phone_number, user.mobile_number, EMPTY_VALUE)),
    email: String(pickFirst(user.email, EMPTY_VALUE)),
    role: normalizeRole(pickFirst(user.user_type_name, user.user_type?.name, user.role, user.user_role, user.roles)),
    lastInteraction: String(pickFirst(user.lastInteraction, user.last_interaction, user.last_login, user.updated_at, EMPTY_VALUE)),
  };
};

const normalizeUserDetail = (payload) => {
  const raw = extractUser(payload);

  return {
    raw,
    summary: normalizeUserSummary(raw),
  };
};

const normalizeUsersPage = (payload) => {
  const users = extractUsers(payload).map(normalizeUserSummary);
  const count = Number(payload?.count);

  return {
    count: Number.isFinite(count) ? count : users.length,
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
    users,
  };
};

const fetchUsersPage = async (options = {}) => {
  const {
    authenticatedFetch,
    baseUrl,
    page,
    pageSize,
    dateJoinedAfter,
    dateJoinedBefore,
    isActive,
    isEmailVerified,
    isPhoneVerified,
    ordering,
    phone,
    search,
    userType,
    ...requestOptions
  } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const response = await fetcher(getUsersEndpoint(baseUrl, {
    page,
    pageSize,
    dateJoinedAfter,
    dateJoinedBefore,
    isActive,
    isEmailVerified,
    isPhoneVerified,
    ordering,
    phone,
    search,
    userType,
  }), {
    ...requestOptions,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(requestOptions.headers || {}),
    },
  });
  const payload = await readJson(response);

  return normalizeUsersPage(payload);
};

const fetchUsers = async (options = {}) => {
  const page = await fetchUsersPage(options);

  return page.users;
};

const fetchUserById = async (id, options = {}) => {
  const { authenticatedFetch, baseUrl, ...requestOptions } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const response = await fetcher(getUserEndpoint(id, baseUrl), {
    ...requestOptions,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(requestOptions.headers || {}),
    },
  });
  const payload = await readJson(response);

  return normalizeUserDetail(payload);
};

const activateUser = async (id, options = {}) => {
  const { authenticatedFetch, baseUrl, ...requestOptions } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}/api/users/${encodeURIComponent(normalizeRouteId(id))}/activate/`;
  const response = await fetcher(endpoint, {
    ...requestOptions,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(requestOptions.headers || {}),
    },
  });
  const payload = await readJson(response);
  return normalizeUserDetail(payload);
};

const suspendUser = async (id, options = {}) => {
  const { authenticatedFetch, baseUrl, ...requestOptions } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}/api/users/${encodeURIComponent(normalizeRouteId(id))}/suspend/`;
  const response = await fetcher(endpoint, {
    ...requestOptions,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(requestOptions.headers || {}),
    },
  });
  const payload = await readJson(response);
  return normalizeUserDetail(payload);
};

const changeUserType = async (id, data, options = {}) => {
  const { authenticatedFetch, baseUrl, ...requestOptions } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}/api/users/${encodeURIComponent(normalizeRouteId(id))}/change-type/`;
  const response = await fetcher(endpoint, {
    ...requestOptions,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(requestOptions.headers || {}),
    },
    body: JSON.stringify(data),
  });
  const payload = await readJson(response);
  return normalizeUserDetail(payload);
};

module.exports = {
  USER_API_PATHS,
  activateUser,
  changeUserType,
  fetchUserById,
  fetchUsersPage,
  fetchUsers,
  getUserEndpoint,
  getUsersEndpoint,
  normalizeUserDetail,
  normalizeUserSummary,
  normalizeUsersPage,
  suspendUser,
};
