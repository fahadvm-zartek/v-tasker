// Match the CommonJS service boundary used by taskService and authService.
/* eslint-disable @typescript-eslint/no-require-imports */
const { authenticatedFetch: defaultFetch, AuthApiError } = require('./authService');
const { getTasksEndpoint, normalizeTaskSummary, normalizeTaskDetail } = require('./taskService');

const participantKeys = {
  poster: ['poster_id', 'posterId', 'customer_id', 'poster', 'customer', 'created_by', 'owner'],
  doer: ['doer_id', 'doerId', 'provider_id', 'doer', 'provider', 'assignee', 'assigned_to', 'worker'],
};
const participantId = (task, role) => {
  for (const key of participantKeys[role]) {
    const value = task[key];
    // Generic participant fields can contain display names. Only explicit ID
    // fields, objects, numeric IDs, or UUIDs are safe identity evidence.
    if (typeof value === 'string' && !/(_id|Id)$/.test(key)
      && !/^\d+$/.test(value) && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value)) continue;
    const id = value && typeof value === 'object' ? value.user_id ?? value.user?.id ?? value.id ?? value.pk : value;
    if (id !== undefined && id !== null && String(id).trim()) return String(id);
  }
  return '';
};
const hasParticipant = (task, role) => Boolean(participantId(task, role))
  || participantKeys[role].some(key => task[key] === null);
const text = value => value == null || value === '' ? 'N/A' : String(value);

const fetchUserTaskHistory = async (userId, options = {}) => {
  if (!String(userId ?? '').trim()) throw new Error('A user ID is required.');
  const { authenticatedFetch = defaultFetch, baseUrl, signal } = options;
  const read = async url => {
    const response = await authenticatedFetch(url, { method: 'GET', signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new AuthApiError(`Task history request failed with status ${response.status}.`, { status: response.status });
    return response.json();
  };
  const rows = [];
  const seen = new Set();
  let loaded = 0;
  for (let page = 1; ; page++) {
    const payload = await read(getTasksEndpoint(baseUrl, { page, pageSize: 100 }));
    const batch = Array.isArray(payload) ? payload : payload.results ?? payload.tasks ?? payload.data?.tasks ?? payload.data ?? [];
    if (!Array.isArray(batch)) throw new Error('Unexpected task history response.');
    loaded += batch.length;
    // Resolve sparse list records in small batches to avoid overwhelming the API.
    for (let start = 0; start < batch.length; start += 4) {
      const resolved = await Promise.all(batch.slice(start, start + 4).map(async task => {
        if (hasParticipant(task, 'poster') && hasParticipant(task, 'doer')) return task;
        const id = task.id ?? task.task_id ?? task.uuid;
        if (id == null) throw new Error('Task history record has no task ID.');
        const endpoint = `${getTasksEndpoint(baseUrl).replace(/\/$/, '')}/${encodeURIComponent(id)}/`;
        const detail = await read(endpoint);
        return { ...task, ...(detail.data ?? detail) };
      }));
      for (const task of resolved) {
        const isPoster = participantId(task, 'poster') === String(userId);
        const isDoer = participantId(task, 'doer') === String(userId);
        if (!isPoster && !isDoer) continue;
        const summary = normalizeTaskSummary(task);
        const detail = normalizeTaskDetail(task);
        const routeId = String(task.id ?? task.task_id ?? task.uuid);
        if (seen.has(routeId)) continue;
        seen.add(routeId);
        rows.push({
          routeId, id: summary.id, title: summary.title, service: summary.service === 'N/A' ? summary.title : summary.service,
          date: summary.dateCreated, dateCreated: String(task.date_created ?? task.created_at ?? task.createdAt ?? task.posted_at ?? '').slice(0, 10), status: summary.status,
          poster: summary.poster.name, doer: summary.doer.name.replace(/^\d+ Offers?$/, 'Unassigned'),
          amount: detail.budget, reward: text(task.reward_points ?? task.reward?.points),
          milestone: text(task.milestone?.name ?? task.milestone_name ?? (typeof task.milestone === 'string' ? task.milestone : undefined)),
          isPoster, isDoer,
        });
      }
    }
    if (!batch.length || (!payload.next && loaded >= Number(payload.count ?? payload.total ?? loaded))) break;
  }
  return rows;
};

const filterUserTaskHistory = (rows, filters) => {
  const normalize = value => String(value ?? '').trim().toLowerCase();
  return rows.filter(row => (filters.role === 'poster' ? row.isPoster : row.isDoer)
    && (!filters.search || normalize([row.id, row.title, row.service, row.poster, row.doer].join(' ')).includes(normalize(filters.search)))
    && (!filters.status || normalize(row.status).replace(/[\s-]+/g, '_') === normalize(filters.status))
    && (!filters.dateCreatedAfter || (/^\d{4}-\d{2}-\d{2}$/.test(row.dateCreated) && row.dateCreated >= filters.dateCreatedAfter))
    && (!filters.dateCreatedBefore || (/^\d{4}-\d{2}-\d{2}$/.test(row.dateCreated) && row.dateCreated <= filters.dateCreatedBefore)));
};

module.exports = { fetchUserTaskHistory, filterUserTaskHistory };
