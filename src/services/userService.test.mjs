import assert from 'node:assert/strict';
import test from 'node:test';

import userService from './userService.js';

test('user service builds the users list and detail endpoints', () => {
  assert.equal(userService.getUsersEndpoint('https://api.example.com/'), 'https://api.example.com/api/users');
  assert.equal(userService.getUserEndpoint('CUS-0041', 'https://api.example.com/'), 'https://api.example.com/api/users/CUS-0041');
});

test('fetchUsers requests api/users and normalizes the backend results payload with N/A fallbacks', async () => {
  const calls = [];
  const response = {
    ok: true,
    json: async () => ({
      count: 21,
      results: [
        {
          id: 22,
          first_name: 'new',
          last_name: 'admin',
          email: 'admin8@gmail.com',
          user_type_name: 'Admin',
          is_active: true,
        },
        {
          id: 21,
          first_name: '',
          last_name: '',
          email: 'admin2@gmail.com',
          user_type_name: 'Task Poster',
          is_active: true,
        },
      ],
    }),
  };

  const users = await userService.fetchUsers({
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async (url, options) => {
      calls.push({ url, options });
      return response;
    },
  });

  assert.equal(calls[0].url, 'https://api.example.com/api/users');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.headers.Accept, 'application/json');
  assert.deepEqual(users[0], {
    id: '22',
    name: 'new admin',
    initials: 'NA',
    avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    mobile: 'N/A',
    email: 'admin8@gmail.com',
    role: 'Admin',
    lastInteraction: 'N/A',
  });
  assert.deepEqual(users[1], {
    id: '21',
    name: 'N/A',
    initials: 'NA',
    avatarClass: 'bg-[#eedcff] text-[#8b5cf6]',
    mobile: 'N/A',
    email: 'admin2@gmail.com',
    role: 'Task Poster',
    lastInteraction: 'N/A',
  });
});

test('fetchUsersPage requests the selected users page and returns pagination metadata', async () => {
  const calls = [];
  const page = await userService.fetchUsersPage({
    page: 2,
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async (url, options) => {
      calls.push({ url, options });
      return {
        ok: true,
        json: async () => ({
          count: 21,
          next: null,
          previous: 'http://3.106.23.68/api/users/',
          results: [
            {
              id: 1,
              email: 'last@example.com',
              first_name: '',
              last_name: '',
              is_active: true,
            },
          ],
        }),
      };
    },
  });

  assert.equal(calls[0].url, 'https://api.example.com/api/users?page=2');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(page.count, 21);
  assert.equal(page.next, null);
  assert.equal(page.previous, 'http://3.106.23.68/api/users/');
  assert.equal(page.users.length, 1);
  assert.equal(page.users[0].name, 'N/A');
  assert.equal(page.users[0].role, 'N/A');
});

test('fetchUsersPage includes supported users list filter query parameters', async () => {
  const calls = [];

  await userService.fetchUsersPage({
    page: 3,
    pageSize: 25,
    search: 'admin',
    phone: '+61 400',
    userType: 'Admin',
    isActive: true,
    isEmailVerified: false,
    isPhoneVerified: true,
    ordering: '-date_joined',
    dateJoinedAfter: '2026-09-01T00:00:00.000Z',
    dateJoinedBefore: '2026-09-15T23:59:59.999Z',
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async (url, options) => {
      calls.push({ url, options });
      return {
        ok: true,
        json: async () => ({ count: 0, results: [] }),
      };
    },
  });

  const requestUrl = new URL(calls[0].url);

  assert.equal(requestUrl.origin + requestUrl.pathname, 'https://api.example.com/api/users');
  assert.equal(requestUrl.searchParams.get('page'), '3');
  assert.equal(requestUrl.searchParams.get('page_size'), '25');
  assert.equal(requestUrl.searchParams.get('search'), 'admin');
  assert.equal(requestUrl.searchParams.get('phone'), '+61 400');
  assert.equal(requestUrl.searchParams.get('user_type'), 'Admin');
  assert.equal(requestUrl.searchParams.get('is_active'), 'true');
  assert.equal(requestUrl.searchParams.get('is_email_verified'), 'false');
  assert.equal(requestUrl.searchParams.get('is_phone_verified'), 'true');
  assert.equal(requestUrl.searchParams.get('ordering'), '-date_joined');
  assert.equal(requestUrl.searchParams.get('date_joined_after'), '2026-09-01T00:00:00.000Z');
  assert.equal(requestUrl.searchParams.get('date_joined_before'), '2026-09-15T23:59:59.999Z');
});

test('fetchUserById requests api/users/{id} and keeps the raw details with a normalized summary', async () => {
  const calls = [];

  const user = await userService.fetchUserById('#CUS-0041', {
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async (url, options) => {
      calls.push({ url, options });
      return {
        ok: true,
        json: async () => ({
          data: {
            id: '#CUS-0041',
            full_name: 'Sarah Mitchell',
            member_id: 'CST-9824',
            role: 'both',
            phone: '+61 412 345 678',
            email: 'sarah.m@example.com',
          },
        }),
      };
    },
  });

  assert.equal(calls[0].url, 'https://api.example.com/api/users/CUS-0041');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(user.summary.name, 'Sarah Mitchell');
  assert.equal(user.summary.role, 'Both');
  assert.equal(user.raw.member_id, 'CST-9824');
});

test('fetchUserById normalizes the current backend user detail response shape', async () => {
  const user = await userService.fetchUserById(22, {
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async () => ({
      ok: true,
      json: async () => ({
        id: 22,
        email: 'admin8@gmail.com',
        phone: '+61 400 000 000',
        first_name: 'new',
        last_name: 'admin',
        user_type: {
          id: 1,
          name: 'ADMIN',
          description: 'System administrator',
        },
        is_active: true,
        is_phone_verified: true,
        is_email_verified: true,
        date_joined: '2026-09-15T07:15:19.105Z',
        updated_at: '2026-09-15T07:15:19.105Z',
        profile: {
          bio: 'Backend profile bio',
          suburb_display: 'Sydney NSW',
          tasks_completed: 8,
          tasks_posted: 3,
          completion_rate: '95',
          average_rating: '4.8',
          total_reviews: 12,
          is_verified: true,
        },
      }),
    }),
  });

  assert.equal(user.summary.id, '22');
  assert.equal(user.summary.name, 'new admin');
  assert.equal(user.summary.mobile, '+61 400 000 000');
  assert.equal(user.summary.email, 'admin8@gmail.com');
  assert.equal(user.summary.role, 'ADMIN');
  assert.equal(user.summary.lastInteraction, '2026-09-15T07:15:19.105Z');
  assert.equal(user.raw.profile.suburb_display, 'Sydney NSW');
});
