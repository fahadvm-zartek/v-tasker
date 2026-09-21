import assert from 'node:assert/strict';
import test from 'node:test';

import authService from './authService.js';

const {
  AUTH_API_PATHS,
  AUTH_ENDPOINTS,
  DEFAULT_API_BASE_URL,
  getAuthEndpoint,
  clearAuthSession,
  login,
  logout,
  changePassword,
  resetPassword,
  confirmPasswordReset,
  register,
  resendVerificationEmail,
  verifyEmail,
  refreshToken,
  verifyToken,
  persistAuthSession,
  getStoredAuthSession,
  hasStoredAuthSession,
  authenticatedFetch,
  AuthApiError,
  getStoredUserProfile,
  persistUserProfile,
} = authService;

test('auth service exposes the backend auth API routes', () => {
  assert.equal(DEFAULT_API_BASE_URL, 'http://3.106.23.68');

  assert.deepEqual(AUTH_API_PATHS, {
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
  });

  assert.deepEqual(AUTH_ENDPOINTS, {
    login: 'http://3.106.23.68/api/auth/login/',
    logout: 'http://3.106.23.68/api/auth/logout/',
    passwordChange: 'http://3.106.23.68/api/auth/password/change/',
    passwordReset: 'http://3.106.23.68/api/auth/password/reset/',
    passwordResetConfirm: 'http://3.106.23.68/api/auth/password/reset/confirm/',
    registration: 'http://3.106.23.68/api/auth/registration/',
    registrationResendEmail: 'http://3.106.23.68/api/auth/registration/resend-email/',
    registrationVerifyEmail: 'http://3.106.23.68/api/auth/registration/verify-email/',
    tokenRefresh: 'http://3.106.23.68/api/auth/token/refresh/',
    tokenVerify: 'http://3.106.23.68/api/auth/token/verify/',
  });
});

test('getAuthEndpoint supports overriding the backend base URL', () => {
  assert.equal(getAuthEndpoint('login', 'https://api.example.com/'), 'https://api.example.com/api/auth/login/');
});

test('login posts trimmed email credentials to the backend login route', async () => {
  const requests = [];
  const fetcher = async (...args) => {
    requests.push(args);
    return Response.json({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  };

  const result = await login({ email: ' admin@example.com ', password: 'secret' }, { fetcher });

  assert.deepEqual(result, { accessToken: 'access-token', refreshToken: 'refresh-token' });
  assert.equal(requests.length, 1);
  assert.equal(requests[0][0], 'http://3.106.23.68/api/auth/login/');
  assert.deepEqual(requests[0][1], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: 'admin@example.com', password: 'secret' }),
  });
});

test('postAuthEndpoint surfaces backend field and general error messages', async () => {
  const fetcher = async () =>
    Response.json(
      {
        username: ['A user with that username already exists.'],
        password1: ['This password is too short.'],
        non_field_errors: ['Unable to log in with provided credentials.'],
        nested: { detail: 'Nested backend message.' },
      },
      { status: 400 },
    );

  await assert.rejects(
    () => login({ email: 'admin@example.com', password: 'secret' }, { fetcher }),
    (error) => {
      assert.equal(error instanceof AuthApiError, true);
      assert.equal(error.status, 400);
      assert.equal(error.fieldErrors.username, 'A user with that username already exists.');
      assert.equal(error.fieldErrors.password1, 'This password is too short.');
      assert.match(error.message, /Unable to log in with provided credentials\./);
      assert.match(error.message, /Nested backend message\./);
      return true;
    },
  );
});

test('register posts the admin registration payload to the backend registration route', async () => {
  const requests = [];
  const fetcher = async (...args) => {
    requests.push(args);
    return Response.json({ email: 'admin@example.com' });
  };

  const result = await register(
    {
      email: ' admin@example.com ',
      password1: 'secret123',
      password2: 'secret123',
      first_name: ' Admin ',
      last_name: ' User ',
      user_type_name: 'ADMIN',
    },
    { fetcher },
  );

  assert.deepEqual(result, { email: 'admin@example.com' });
  assert.equal(requests[0][0], 'http://3.106.23.68/api/auth/registration/');
  assert.equal(
    requests[0][1].body,
    JSON.stringify({
      email: 'admin@example.com',
      password1: 'secret123',
      password2: 'secret123',
      first_name: 'Admin',
      last_name: 'User',
      user_type_name: 'ADMIN',
    }),
  );
});

test('auth service methods post to their matching backend routes', async () => {
  const requests = [];
  const fetcher = async (...args) => {
    requests.push(args);
    return Response.json({ ok: true });
  };

  await logout({}, { fetcher });
  await changePassword({ old_password: 'old', new_password: 'new' }, { fetcher });
  await resetPassword({ email: 'admin@example.com' }, { fetcher });
  await confirmPasswordReset({ uid: 'uid', token: 'token', new_password: 'new' }, { fetcher });
  await register(
    {
      email: 'admin@example.com',
      password1: 'secret123',
      password2: 'secret123',
      first_name: '',
      last_name: '',
      user_type_name: 'ADMIN',
    },
    { fetcher },
  );
  await resendVerificationEmail({ email: 'admin@example.com' }, { fetcher });
  await verifyEmail({ key: 'verification-key' }, { fetcher });
  await refreshToken({ refresh: 'refresh-token' }, { fetcher });
  await verifyToken({ token: 'access-token' }, { fetcher });

  assert.deepEqual(
    requests.map(([url]) => url),
    [
      'http://3.106.23.68/api/auth/logout/',
      'http://3.106.23.68/api/auth/password/change/',
      'http://3.106.23.68/api/auth/password/reset/',
      'http://3.106.23.68/api/auth/password/reset/confirm/',
      'http://3.106.23.68/api/auth/registration/',
      'http://3.106.23.68/api/auth/registration/resend-email/',
      'http://3.106.23.68/api/auth/registration/verify-email/',
      'http://3.106.23.68/api/auth/token/refresh/',
      'http://3.106.23.68/api/auth/token/verify/',
    ],
  );
});

test('logout sends the stored refresh token expected by the backend', async () => {
  const requests = [];
  const storage = {
    getItem: (key) => (key === 'refreshToken' ? 'refresh-token' : null),
  };
  const fetcher = async (...args) => {
    requests.push(args);
    return Response.json({ ok: true });
  };

  await logout(undefined, { fetcher, storage });

  assert.equal(requests[0][0], 'http://3.106.23.68/api/auth/logout/');
  assert.equal(requests[0][1].body, JSON.stringify({ refresh: 'refresh-token' }));
});

test('authenticatedFetch attaches access token and refreshes expired access tokens', async () => {
  const calls = [];
  const storedValues = new Map([
    ['accessToken', 'expired-access'],
    ['refreshToken', 'refresh-token'],
  ]);
  const storage = {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => storedValues.set(key, value),
    removeItem: (key) => storedValues.delete(key),
  };
  const fetcher = async (url, init = {}) => {
    calls.push([url, init]);

    if (url === 'https://api.example.com/protected' && calls.length === 1) {
      return Response.json({ detail: 'Token expired' }, { status: 401 });
    }

    if (url === 'http://3.106.23.68/api/auth/token/refresh/') {
      return Response.json({ access: 'fresh-access' });
    }

    return Response.json({ ok: true });
  };

  const response = await authenticatedFetch('https://api.example.com/protected', { fetcher, storage });

  assert.equal(response.status, 200);
  assert.equal(calls[0][1].headers.Authorization, 'Bearer expired-access');
  assert.equal(calls[1][1].body, JSON.stringify({ refresh: 'refresh-token' }));
  assert.equal(calls[2][1].headers.Authorization, 'Bearer fresh-access');
  assert.equal(storedValues.get('accessToken'), 'fresh-access');
});

test('authenticatedFetch clears auth state when refresh token is invalid', async () => {
  const removedKeys = [];
  const storage = {
    getItem: (key) => (key === 'accessToken' ? 'expired-access' : key === 'refreshToken' ? 'bad-refresh' : null),
    setItem: () => {},
    removeItem: (key) => removedKeys.push(key),
  };
  const fetcher = async (url) =>
    url === 'http://3.106.23.68/api/auth/token/refresh/'
      ? Response.json({ detail: 'Refresh token invalid.' }, { status: 401 })
      : Response.json({ detail: 'Token expired' }, { status: 401 });

  await assert.rejects(
    () => authenticatedFetch('https://api.example.com/protected', { fetcher, storage }),
    /Refresh token invalid\./,
  );
  assert.deepEqual(removedKeys, [
    'v-tasker-authenticated',
    'v-tasker-admin-session',
    'authToken',
    'accessToken',
    'refreshToken',
    'token',
    'v-tasker-user-profile',
  ]);
});

test('persistAuthSession stores returned access and refresh tokens consistently', () => {
  const storedValues = new Map();
  const storage = {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => storedValues.set(key, value),
    removeItem: (key) => storedValues.delete(key),
  };

  persistAuthSession(
    { access: 'access-token', refresh: 'refresh-token', user: { username: 'admin_user' } },
    storage,
  );

  assert.equal(storedValues.get('v-tasker-authenticated'), 'true');
  assert.equal(storedValues.get('accessToken'), 'access-token');
  assert.equal(storedValues.get('refreshToken'), 'refresh-token');
  assert.equal(hasStoredAuthSession(storage), true);
  assert.deepEqual(getStoredAuthSession(storage), {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  });
});

test('profile helpers store and retrieve the authenticated user profile', () => {
  const storedValues = new Map();
  const storage = {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => storedValues.set(key, value),
  };

  persistAuthSession(
    {
      access: 'access-token',
      refresh: 'refresh-token',
      user: {
        username: 'admin_user',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
      },
    },
    storage,
  );

  assert.deepEqual(getStoredUserProfile(storage), {
    username: 'admin_user',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'System Administrator',
    phone: '',
    location: '',
    bio: '',
  });

  persistUserProfile(
    {
      username: 'admin_user',
      email: 'admin@example.com',
      firstName: 'Asha',
      lastName: 'Patel',
      role: 'Operations Lead',
      phone: '+61 400 000 000',
      location: 'Sydney, AU',
      bio: 'Runs admin operations.',
    },
    storage,
  );

  assert.deepEqual(getStoredUserProfile(storage), {
    username: 'admin_user',
    email: 'admin@example.com',
    firstName: 'Asha',
    lastName: 'Patel',
    role: 'Operations Lead',
    phone: '+61 400 000 000',
    location: 'Sydney, AU',
    bio: 'Runs admin operations.',
  });
});

test('clearAuthSession removes auth storage keys and clears session storage', () => {
  const removedKeys = [];
  const persistentRemovedKeys = [];
  const storage = {
    removeItem: (key) => removedKeys.push(key),
  };
  const persistentStorage = {
    removeItem: (key) => persistentRemovedKeys.push(key),
  };
  const sessionStorage = {
    cleared: false,
    clear() {
      this.cleared = true;
    },
  };

  clearAuthSession(storage, sessionStorage, persistentStorage);

  assert.deepEqual(removedKeys, [
    'v-tasker-authenticated',
    'v-tasker-admin-session',
    'authToken',
    'accessToken',
    'refreshToken',
    'token',
    'v-tasker-user-profile',
  ]);
  assert.deepEqual(persistentRemovedKeys, removedKeys);
  assert.equal(sessionStorage.cleared, true);
});
