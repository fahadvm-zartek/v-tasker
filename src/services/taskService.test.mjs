import assert from 'node:assert/strict';
import test from 'node:test';

import taskService from './taskService.js';

test('fetchTasksPage requests task filters and pagination from api/tasks', async () => {
  const calls = [];

  await taskService.fetchTasksPage({
    page: 2,
    pageSize: 25,
    search: 'cleaning',
    status: 'pending',
    state: 'NSW',
    suburb: 'Sydney',
    taskType: 'in_person',
    dateCreatedAfter: '2026-09-01',
    dateCreatedBefore: '2026-09-17',
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
  assert.equal(requestUrl.origin + requestUrl.pathname, 'https://api.example.com/api/tasks');
  assert.equal(requestUrl.searchParams.get('page'), '2');
  assert.equal(requestUrl.searchParams.get('page_size'), '25');
  assert.equal(requestUrl.searchParams.get('search'), 'cleaning');
  assert.equal(requestUrl.searchParams.get('status'), 'pending');
  assert.equal(requestUrl.searchParams.get('state'), 'NSW');
  assert.equal(requestUrl.searchParams.get('suburb'), 'Sydney');
  assert.equal(requestUrl.searchParams.get('task_type'), 'in_person');
  assert.equal(requestUrl.searchParams.get('date_created_after'), '2026-09-01');
  assert.equal(requestUrl.searchParams.get('date_created_before'), '2026-09-17');
  assert.equal(calls[0].options.method, 'GET');
});

test('normalizeTasksPage maps backend task data and replaces missing values with N/A', () => {
  const result = taskService.normalizeTasksPage({
    count: 2,
    next: 'https://api.example.com/api/tasks?page=2',
    previous: null,
    results: [
      {
        id: 42,
        title: 'End of lease clean',
        poster: { first_name: 'Sarah', last_name: 'Jones' },
        assignee: { full_name: 'Mike Taylor' },
        category: { name: 'In Person' },
        service: { name: 'Residential Cleaning' },
        status: 'in_progress',
        created_at: '2026-09-17T08:30:00Z',
      },
      { id: 43 },
    ],
  });

  assert.equal(result.count, 2);
  assert.equal(result.next, 'https://api.example.com/api/tasks?page=2');
  assert.equal(result.previous, null);
  assert.deepEqual(result.tasks[0], {
    serial: '1',
    id: '#42',
    routeId: '42',
    title: 'End of lease clean',
    poster: {
      name: 'Sarah Jones',
      initials: 'SJ',
      avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    },
    doer: {
      name: 'Mike Taylor',
      initials: 'MT',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    category: 'In Person',
    service: 'Residential Cleaning',
    status: 'in_progress',
    dateCreated: '17 Sep 2026',
  });
  assert.equal(result.tasks[1].title, 'N/A');
  assert.equal(result.tasks[1].poster.name, 'N/A');
  assert.equal(result.tasks[1].doer.name, 'N/A');
  assert.equal(result.tasks[1].category, 'N/A');
  assert.equal(result.tasks[1].service, 'N/A');
  assert.equal(result.tasks[1].status, 'N/A');
  assert.equal(result.tasks[1].dateCreated, 'N/A');
});

test('normalizeTasksPage handles poster_name, offer_count when doer is N/A, exact status, and date formatting', () => {
  const result = taskService.normalizeTasksPage({
    count: 1,
    results: [
      {
        id: 101,
        title: 'Fix garden fence',
        poster_name: 'John Smith',
        doer: null,
        offer_count: 3,
        status: 'open',
        date_created: '2026-09-17 16:23:12',
      },
    ],
  });

  assert.equal(result.tasks[0].poster.name, 'John Smith');
  assert.equal(result.tasks[0].doer.name, '3 Offers');
  assert.equal(result.tasks[0].status, 'open');
  assert.equal(result.tasks[0].dateCreated, '17 Sep 2026');
});

test('normalizeTasksPage exposes supplied metrics and uses N/A for unavailable counts', () => {
  const result = taskService.normalizeTasksPage({
    count: 7,
    results: [],
    metrics: {
      active: 3,
      pending: 2,
      completed: 1,
    },
  });

  assert.deepEqual(result.metrics, {
    totalTasks: '7',
    active: '3',
    pending: '2',
    noOffers: 'N/A',
    disputes: 'N/A',
    completed: '1',
  });
});

test('normalizeTaskDetail uses poster_name and normalizes status_timeline', () => {
  const detail = taskService.normalizeTaskDetail({
    id: 10,
    title: 'AC servicing',
    poster_name: 'new admin',
    status: 'IN_PROGRESS',
    status_timeline: [
      { title: 'Task Posted', timestamp: '2026-09-12 09:00:00', detail: 'Task created', tone: 'done' },
      { title: 'In Progress', timestamp: '2026-09-12 10:00:00', detail: 'Work started', tone: 'active' },
    ],
  });

  assert.equal(detail.poster.name, 'new admin');
  assert.equal(detail.statusTimeline.length, 2);
  assert.equal(detail.statusTimeline[0].title, 'Task Posted');
  assert.equal(detail.statusTimeline[0].tone, 'done');
  assert.equal(detail.statusTimeline[1].title, 'In Progress');
  assert.equal(detail.statusTimeline[1].tone, 'active');
});

