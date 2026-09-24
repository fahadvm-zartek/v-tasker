import assert from 'node:assert/strict';
import test from 'node:test';

import taskService from './taskService.js';

test('fetchTasksPage retains combined filters across pages and serializes both offers choices', async () => {
  for (const hasOffers of [true, false]) {
    for (const page of [1, 3]) {
      await taskService.fetchTasksPage({
        baseUrl: 'https://api.vtasker.com.au/', page, pageSize: 10,
        search: 'clean room', suburb: 'Bondi Beach', state: 'NSW', status: 'active',
        hasOffers, dateCreatedAfter: '2026-09-01', dateCreatedBefore: '2026-09-24',
        authenticatedFetch: async (url, options) => {
          const params = new URL(url).searchParams;
          assert.equal(params.get('has_offers'), String(hasOffers));
          assert.equal(params.get('page') || '1', String(page));
          assert.equal(params.get('search'), 'clean room');
          assert.equal(params.get('suburb'), 'Bondi Beach');
          assert.equal(params.get('state'), 'NSW');
          assert.equal(params.get('status'), 'active');
          assert.equal(params.get('date_created_after'), '2026-09-01');
          assert.equal(params.get('date_created_before'), '2026-09-24');
          assert.equal('hasOffers' in options, false);
          return { ok: true, json: async () => ({ results: [], count: 0 }) };
        },
      });
    }
  }
  assert.equal(new URL(taskService.getTasksEndpoint('https://api.example.com')).search, '');
});

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

test('timeline preserves API labels, exceptional events, order and null timestamps', () => {
  const events = [
    { label: 'Task Posted', description: 'Posted by customer', timestamp: '2026-09-24 10:00:00', status: 'completed' },
    { label: 'Dispute', description: 'Review requested', timestamp: '2026-09-24 11:00:00', status: 'completed' },
    { label: 'Task Deleted', description: 'Removed by admin', timestamp: null, status: 'pending', time: 'ignored', tone: 'done' },
    { label: 'Review Completed', description: 'Awaiting review', timestamp: null, status: 'pending' },
  ];
  const result = taskService.normalizeTaskDetail({ id: 1, status_timeline: events }).statusTimeline;
  assert.deepEqual(result.map(item => item.title), events.map(item => item.label));
  assert.deepEqual(result.map(item => item.detail), events.map(item => item.description));
  assert.deepEqual(result.map(item => item.status), events.map(item => item.status));
  assert.deepEqual(result.map(item => item.tone), ['done', 'done', 'pending', 'pending']);
  assert.equal(result[2].time, 'N/A');
  assert.equal(result[3].time, 'N/A');
  assert.equal(taskService.normalizeTaskDetail({ id: 1, timeline: [{ title: 'Completed' }] }).statusTimeline, null);
  assert.deepEqual(taskService.normalizeTaskDetail({ id: 1, status_timeline: [] }).statusTimeline, []);
});

test('normalizeTaskDetail uses poster_name and normalizes status_timeline', () => {
  const detail = taskService.normalizeTaskDetail({
    id: 10,
    title: 'AC servicing',
    poster_name: 'new admin',
    status: 'IN_PROGRESS',
    status_timeline: [
      { label: 'Task Posted', timestamp: '2026-09-12 09:00:00', description: 'Task created', status: 'completed' },
      { label: 'In Progress', timestamp: '2026-09-12 10:00:00', description: 'Work started', status: 'in_progress' },
    ],
  });

  assert.equal(detail.poster.name, 'new admin');
  assert.equal(detail.statusTimeline.length, 2);
  assert.equal(detail.statusTimeline[0].title, 'Task Posted');
  assert.equal(detail.statusTimeline[0].tone, 'done');
  assert.equal(detail.statusTimeline[1].title, 'In Progress');
  assert.equal(detail.statusTimeline[1].tone, 'active');
});

