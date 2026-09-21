const DEFAULT_API_BASE_URL = 'http://3.106.23.68';

const AUTH_API_PATHS = {
  login: '/api/auth/login/',
  logout: '/api/auth/logout/',
  passwordChange: '/api/auth/password/change/',
  passwordReset: '/api/auth/password/reset/',
  passwordResetConfirm: '/api/auth/password/reset/confirm/',
  registration: '/api/auth/registration/',
  registrationResendEmail: '/api/auth/registration/resend-email/',
  registrationVerifyEmail: '/api/auth/registration/verify-email/',
  tokenRefresh: '/api/auth/token/refresh/',
  tokenVerify: '/api/auth/token/verify/',
};

const AUTH_STORAGE_KEYS = {
  authenticated: 'v-tasker-authenticated',
  adminSession: 'v-tasker-admin-session',
  token: 'authToken',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  legacyToken: 'token',
  userProfile: 'v-tasker-user-profile',
};

class AuthApiError extends Error {
  constructor(message, { status, fieldErrors = {}, details } = {}) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.details = details;
  }
}

const getDefaultTokenStorage = () => (typeof window !== 'undefined' ? window.sessionStorage : undefined);
const getDefaultPersistentStorage = () => (typeof window !== 'undefined' ? window.localStorage : undefined);

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl =
    baseUrl ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) ||
    DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, '');
};

const getAuthEndpoint = (routeName, baseUrl) => {
  const path = AUTH_API_PATHS[routeName];

  if (!path) {
    throw new Error(`Unknown auth API route: ${routeName}`);
  }

  return `${resolveApiBaseUrl(baseUrl)}${path}`;
};

const AUTH_ENDPOINTS = Object.fromEntries(
  Object.keys(AUTH_API_PATHS).map((routeName) => [routeName, getAuthEndpoint(routeName)]),
);

const normalizeErrorValue = (value) => {
  if (!value) {
    return [];
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeErrorValue);
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(normalizeErrorValue);
  }

  return [String(value)];
};

const parseBackendErrors = (data, fallbackMessage) => {
  if (!data || typeof data !== 'object') {
    return { message: fallbackMessage, fieldErrors: {} };
  }

  const fieldErrors = {};
  const generalMessages = [];

  Object.entries(data).forEach(([key, value]) => {
    const messages = normalizeErrorValue(value);

    if (!messages.length) {
      return;
    }

    if (['message', 'detail', 'error', 'non_field_errors'].includes(key)) {
      generalMessages.push(...messages);
      return;
    }

    fieldErrors[key] = messages.join(' ');
  });

  const fieldMessages = Object.values(fieldErrors);
  const message = [...generalMessages, ...fieldMessages].filter(Boolean).join(' ') || fallbackMessage;

  return { message, fieldErrors };
};

const readErrorDetails = async (response) => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const data = await response.json();
    return { ...parseBackendErrors(data, fallbackMessage), details: data };
  } catch {
    return { message: fallbackMessage, fieldErrors: {}, details: undefined };
  }
};

const postAuthEndpoint = async (routeName, payload = {}, options = {}) => {
  const fetcher = options.fetcher || fetch;
  const response = await fetcher(getAuthEndpoint(routeName, options.baseUrl), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetails = await readErrorDetails(response);
    throw new AuthApiError(errorDetails.message, {
      status: response.status,
      fieldErrors: errorDetails.fieldErrors,
      details: errorDetails.details,
    });
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

const login = ({ email, password }, options = {}) =>
  postAuthEndpoint('login', { email: email.trim(), password }, options);

const getStoredAuthSession = (storage = getDefaultTokenStorage()) => ({
  accessToken: storage?.getItem(AUTH_STORAGE_KEYS.accessToken) || storage?.getItem(AUTH_STORAGE_KEYS.token) || null,
  refreshToken: storage?.getItem(AUTH_STORAGE_KEYS.refreshToken) || null,
});

const hasStoredAuthSession = (storage = getDefaultTokenStorage()) => {
  const session = getStoredAuthSession(storage);
  return Boolean(session.accessToken && session.refreshToken);
};

const logout = (payload, options = {}) => {
  const session = getStoredAuthSession(options.storage);
  const nextPayload = payload ?? { refresh: session.refreshToken };

  return postAuthEndpoint('logout', nextPayload, options);
};

const changePassword = (payload, options = {}) => postAuthEndpoint('passwordChange', payload, options);

const resetPassword = (payload, options = {}) => postAuthEndpoint('passwordReset', payload, options);

const confirmPasswordReset = (payload, options = {}) =>
  postAuthEndpoint('passwordResetConfirm', payload, options);

const register = (payload, options = {}) =>
  postAuthEndpoint(
    'registration',
    {
      ...payload,
      email: payload.email.trim(),
      first_name: payload.first_name?.trim?.() ?? payload.first_name,
      last_name: payload.last_name?.trim?.() ?? payload.last_name,
    },
    options,
  );

const resendVerificationEmail = (payload, options = {}) =>
  postAuthEndpoint('registrationResendEmail', payload, options);

const verifyEmail = (payload, options = {}) => postAuthEndpoint('registrationVerifyEmail', payload, options);

const refreshToken = (payload, options = {}) => postAuthEndpoint('tokenRefresh', payload, options);

const verifyToken = (payload, options = {}) => postAuthEndpoint('tokenVerify', payload, options);

const getAccessTokenFromSession = (session) => session?.access || session?.accessToken || session?.token || null;
const getRefreshTokenFromSession = (session) => session?.refresh || session?.refreshToken || null;

const normalizeUserProfile = (profile = {}) => ({
  username: String(profile?.username || '').trim() || 'admin',
  email: String(profile?.email || '').trim() || 'admin@alwaysvalentines.com',
  firstName: String(profile?.firstName || profile?.first_name || '').trim() || 'Admin',
  lastName: String(profile?.lastName || profile?.last_name || '').trim() || 'User',
  role: String(profile?.role || '').trim() || 'System Administrator',
  phone: String(profile?.phone || '').trim(),
  location: String(profile?.location || '').trim(),
  bio: String(profile?.bio || '').trim(),
});

const getStoredUserProfile = (storage = getDefaultTokenStorage()) => {
  const storedProfile = storage?.getItem(AUTH_STORAGE_KEYS.userProfile);

  if (!storedProfile) {
    return normalizeUserProfile();
  }

  try {
    return normalizeUserProfile(JSON.parse(storedProfile));
  } catch {
    return normalizeUserProfile();
  }
};

const persistUserProfile = (profile, storage = getDefaultTokenStorage()) => {
  const normalizedProfile = normalizeUserProfile(profile);
  storage?.setItem(AUTH_STORAGE_KEYS.userProfile, JSON.stringify(normalizedProfile));

  return normalizedProfile;
};

const persistAuthSession = (session, storage = getDefaultTokenStorage()) => {
  const accessToken = getAccessTokenFromSession(session);
  const refreshToken = getRefreshTokenFromSession(session);

  storage?.setItem(AUTH_STORAGE_KEYS.authenticated, 'true');
  storage?.setItem(AUTH_STORAGE_KEYS.adminSession, JSON.stringify({
    authenticatedAt: new Date().toISOString(),
    user: session?.user ?? session?.email ?? null,
  }));

  if (accessToken) {
    storage?.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  }

  if (refreshToken) {
    storage?.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  }

  if (session?.user || session?.email || session?.username) {
    persistUserProfile(session?.user || session, storage);
  }
};

const clearAuthSession = (
  storage = getDefaultTokenStorage(),
  sessionStorageRef = typeof window !== 'undefined' ? window.sessionStorage : undefined,
  persistentStorageRef = getDefaultPersistentStorage(),
) => {
  const keys = [
    AUTH_STORAGE_KEYS.authenticated,
    AUTH_STORAGE_KEYS.adminSession,
    AUTH_STORAGE_KEYS.token,
    AUTH_STORAGE_KEYS.accessToken,
    AUTH_STORAGE_KEYS.refreshToken,
    AUTH_STORAGE_KEYS.legacyToken,
    AUTH_STORAGE_KEYS.userProfile,
  ];

  keys.forEach((key) => {
    storage?.removeItem(key);
    persistentStorageRef?.removeItem(key);
  });

  sessionStorageRef?.clear();
};

const refreshAccessToken = async (options = {}) => {
  const storage = options.storage || getDefaultTokenStorage();
  const { refreshToken: storedRefreshToken } = getStoredAuthSession(storage);

  if (!storedRefreshToken) {
    throw new AuthApiError('Refresh token is missing.', { status: 401 });
  }

  const session = await refreshToken({ refresh: storedRefreshToken }, options);
  const nextAccessToken = getAccessTokenFromSession(session);

  if (!nextAccessToken) {
    throw new AuthApiError('Access token missing from refresh response.', { status: 401, details: session });
  }

  storage?.setItem(AUTH_STORAGE_KEYS.accessToken, nextAccessToken);

  return nextAccessToken;
};

const authenticatedFetch = async (url, options = {}) => {
  const fetcher = options.fetcher || fetch;
  const storage = options.storage || getDefaultTokenStorage();
  const fetchOptions = { ...options };
  delete fetchOptions.fetcher;
  delete fetchOptions.storage;
  delete fetchOptions.baseUrl;
  const session = getStoredAuthSession(storage);
  const headers = { ...(fetchOptions.headers || {}) };

  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetcher(url, { ...fetchOptions, headers });

  if (response.status !== 401) {
    return response;
  }

  try {
    const nextAccessToken = await refreshAccessToken({ ...options, storage, fetcher });
    return fetcher(url, {
      ...fetchOptions,
      headers: {
        ...(fetchOptions.headers || {}),
        Authorization: `Bearer ${nextAccessToken}`,
      },
    });
  } catch (error) {
    clearAuthSession(storage);
    throw error;
  }
};

module.exports = {
  AUTH_API_PATHS,
  AUTH_ENDPOINTS,
  AUTH_STORAGE_KEYS,
  AuthApiError,
  DEFAULT_API_BASE_URL,
  authenticatedFetch,
  changePassword,
  clearAuthSession,
  confirmPasswordReset,
  getStoredAuthSession,
  hasStoredAuthSession,
  getAuthEndpoint,
  getLoginEndpoint: (baseUrl) => getAuthEndpoint('login', baseUrl),
  login,
  logout,
  getStoredUserProfile,
  persistAuthSession,
  persistUserProfile,
  postAuthEndpoint,
  refreshToken,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
  verifyToken,
};
