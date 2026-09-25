const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const TASK_API_PATHS = {
  tasks: '/api/tasks',
  taskDetail: (id) => `/api/tasks/${encodeURIComponent(String(id).replace(/^#/, ''))}/`,
  cancelTask: (id) => `/api/tasks/${encodeURIComponent(String(id).replace(/^#/, ''))}/cancel/`,
  taskQuestions: (id) => `/api/tasks/${encodeURIComponent(String(id).replace(/^#/, ''))}/questions/`,
  questionReply: (taskId, questionPk) => `/api/tasks/${encodeURIComponent(String(taskId).replace(/^#/, ''))}/questions/${encodeURIComponent(String(questionPk))}/reply/`,
  increaseBudget: (id) => `/api/tasks/${encodeURIComponent(String(id).replace(/^#/, ''))}/increase-budget/`,
  taskReceipt: (id) => `/api/tasks/${encodeURIComponent(String(id).replace(/^#/, ''))}/receipt/`,
};
const EMPTY_VALUE = 'N/A';

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl = baseUrl || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) || DEFAULT_API_BASE_URL;
  return configuredBaseUrl.replace(/\/+$/, '');
};

const appendQueryParam = (params, key, value) => {
  if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
};

const getTasksEndpoint = (baseUrl, query = {}) => {
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.tasks}`;
  const params = new URLSearchParams();
  const pageNumber = Number(query.page);
  const pageSize = Number(query.pageSize);
  if (Number.isFinite(pageNumber) && pageNumber > 1) params.set('page', String(pageNumber));
  if (Number.isFinite(pageSize) && pageSize > 0) params.set('page_size', String(pageSize));
  appendQueryParam(params, 'search', query.search);
  appendQueryParam(params, 'status', query.status);
  appendQueryParam(params, 'state', query.state);
  appendQueryParam(params, 'suburb', query.suburb);
  appendQueryParam(params, 'task_type', query.taskType);
  appendQueryParam(params, 'has_offers', query.hasOffers);
  appendQueryParam(params, 'date_created_after', query.dateCreatedAfter);
  appendQueryParam(params, 'date_created_before', query.dateCreatedBefore);
  const queryString = params.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const buildName = (person) => {
  if (!person || typeof person !== 'object') return String(pickFirst(person, EMPTY_VALUE));
  const combinedName = [person.first_name ?? person.firstName, person.last_name ?? person.lastName].filter(Boolean).join(' ').trim();
  return String(pickFirst(person.full_name, person.fullName, person.name, combinedName, EMPTY_VALUE));
};

const buildInitials = (name) => {
  if (name === EMPTY_VALUE) return 'NA';
  return String(name).trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'NA';
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDateCreated = (dateValue) => {
  const original = String(dateValue ?? '').trim();
  if (!original || original === EMPTY_VALUE) return EMPTY_VALUE;

  const match = original.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, monthStr, dayStr] = match;
    const monthIndex = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);
    if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
      return `${day} ${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }

  const parsed = new Date(original.replace(' ', 'T'));
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const month = MONTH_NAMES[parsed.getMonth()];
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return original;
};

const extractTasks = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.tasks)) return payload.data.tasks;
  return [];
};

const normalizeTaskSummary = (task, index = 0) => {
  const rawId = String(pickFirst(task.task_id, task.taskId, task.reference, task.id, task.uuid, index + 1));
  const posterName = buildName(pickFirst(task.poster_name, task.posterName, task.poster, task.customer, task.created_by, task.owner));
  
  let doerName = buildName(pickFirst(task.doer_name, task.doerName, task.doer, task.provider, task.assignee, task.worker));
  const offerCount = pickFirst(task.offer_count, task.offerCount, task.offers_count, task.offersCount);

  if ((doerName === EMPTY_VALUE || !doerName || doerName.trim() === '') && offerCount !== undefined && offerCount !== null && String(offerCount).trim() !== '') {
    const num = Number(offerCount);
    if (!isNaN(num)) {
      doerName = `${num} ${num === 1 ? 'Offer' : 'Offers'}`;
    } else if (typeof offerCount === 'string') {
      doerName = offerCount.includes('Offer') ? offerCount : `${offerCount} Offers`;
    }
  }

  const status = String(pickFirst(task.status, EMPTY_VALUE));
  const dateCreated = formatDateCreated(pickFirst(task.date_created, task.created_at, task.createdAt, task.posted_at, EMPTY_VALUE));

  return {
    serial: String(index + 1),
    id: rawId.startsWith('#') ? rawId : `#${rawId}`,
    routeId: rawId.replace(/^#/, ''),
    title: String(pickFirst(task.title, task.name, task.task_title, EMPTY_VALUE)),
    poster: { name: posterName, initials: buildInitials(posterName), avatarClass: 'bg-[#eef2ff] text-[#1B3061]' },
    doer: { name: doerName, initials: buildInitials(doerName), avatarClass: 'bg-[#e5e7eb] text-[#334155]' },
    category: String(pickFirst(task.category?.name, task.category_name, task.category, task.task_type, EMPTY_VALUE)),
    service: String(pickFirst(task.subcategory_name, task.service?.name, task.service_name, task.subcategory?.name, task.sub_category_name, EMPTY_VALUE)),
    status,
    dateCreated,
  };
};

const normalizeMetric = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-US') : EMPTY_VALUE;
};

const normalizeTasksPage = (payload) => {
  const tasks = extractTasks(payload).map(normalizeTaskSummary);
  const count = Number(payload?.count ?? payload?.total);
  const normalizedCount = Number.isFinite(count) ? count : tasks.length;
  const metrics = payload?.metrics ?? payload?.summary ?? {};
  return {
    count: normalizedCount,
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
    tasks,
    metrics: {
      totalTasks: normalizeMetric(pickFirst(metrics.total_tasks, metrics.totalTasks, normalizedCount)),
      active: normalizeMetric(metrics.active),
      pending: normalizeMetric(metrics.pending),
      noOffers: normalizeMetric(pickFirst(metrics.no_offers, metrics.noOffers)),
      disputes: normalizeMetric(pickFirst(metrics.disputes, metrics.dispute)),
      completed: normalizeMetric(metrics.completed),
    },
  };
};

const fetchTasksPage = async (options = {}) => {
  const { authenticatedFetch, baseUrl, page, pageSize, search, status, state, suburb, taskType, hasOffers, dateCreatedAfter, dateCreatedBefore, ...requestOptions } = options;
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const response = await fetcher(getTasksEndpoint(baseUrl, { page, pageSize, search, status, state, suburb, taskType, hasOffers, dateCreatedAfter, dateCreatedBefore }), {
    ...requestOptions,
    method: 'GET',
    headers: { Accept: 'application/json', ...(requestOptions.headers || {}) },
  });
  if (!response.ok) throw new AuthApiError(`Tasks request failed with status ${response.status}.`, { status: response.status });
  return normalizeTasksPage(await response.json());
};

// The listing API documents pagination/search only. Apply the admin filters to
// the complete collection, never just the current page of results.
const fetchFilteredTasksPage = async (options = {}) => {
  const { authenticatedFetch, baseUrl, page = 1, pageSize = 10, search, status, state, suburb, suburbName, stateSuburbs = [], taskType, hasOffers, dateCreatedAfter, dateCreatedBefore, ...requestOptions } = options;
  if (![search, status, state, suburb, taskType, dateCreatedAfter, dateCreatedBefore].some(Boolean) && hasOffers === undefined) {
    return fetchTasksPage({ ...requestOptions, authenticatedFetch, baseUrl, page, pageSize });
  }
  const fetcher = authenticatedFetch || defaultAuthenticatedFetch;
  const records = [];
  let firstPayload;
  for (let apiPage = 1; ; apiPage++) {
    const response = await fetcher(getTasksEndpoint(baseUrl, { page: apiPage, pageSize: 100 }), {
      ...requestOptions, method: 'GET', headers: { Accept: 'application/json', ...(requestOptions.headers || {}) },
    });
    if (!response.ok) throw new AuthApiError(`Tasks request failed with status ${response.status}.`, { status: response.status });
    const payload = await response.json();
    firstPayload ??= payload;
    const batch = extractTasks(payload);
    records.push(...batch);
    if (!batch.length || (!payload.next && records.length >= Number(payload.count ?? payload.total ?? records.length))) break;
  }
  const normalize = (value) => String(value ?? '').trim().toLowerCase();
  const matchesLocation = (value, candidates) => !value || candidates.some(candidate => normalize(candidate) === normalize(value));
  const filtered = records.filter(raw => {
    const task = normalizeTaskSummary(raw);
    const location = raw.suburb ?? raw.location?.suburb;
    const region = raw.state ?? location?.state ?? raw.location?.state;
    const offerCount = Number(raw.offer_count ?? raw.offerCount ?? raw.offers_count ?? raw.offersCount ?? (Array.isArray(raw.offers) ? raw.offers.length : NaN));
    const offersPresent = raw.has_offers === true || raw.has_offers === 'true' || offerCount > 0;
    const offersAbsent = raw.has_offers === false || raw.has_offers === 'false' || offerCount === 0;
    const created = String(raw.date_created ?? raw.created_at ?? raw.createdAt ?? raw.posted_at ?? '').slice(0, 10);
    return (!search || normalize([task.id, task.title, task.poster.name, task.doer.name].join(' ')).includes(normalize(search)))
      && (!status || normalize(task.status).replace(/[\s-]+/g, '_') === normalize(status).replace(/[\s-]+/g, '_'))
      && (matchesLocation(suburb, [typeof location === 'object' ? undefined : location, location?.id, location?.name, raw.suburb_id, raw.suburb_name])
        || (suburbName && matchesLocation(suburbName, [typeof location === 'string' ? location : undefined, location?.name, raw.suburb_name])))
      && (matchesLocation(state, [typeof region === 'object' ? undefined : region, region?.id, region?.code, region?.name, raw.state_id, raw.state_name, raw.state_code])
        || stateSuburbs.some(value => matchesLocation(value, [typeof location === 'object' ? undefined : location, location?.id, location?.name, raw.suburb_id, raw.suburb_name])))
      && (!taskType || normalize(raw.task_type ?? raw.location_type) === normalize(taskType))
      && (hasOffers === undefined || (hasOffers ? offersPresent : offersAbsent))
      && (!dateCreatedAfter || (created !== '' && created >= dateCreatedAfter))
      && (!dateCreatedBefore || (created !== '' && created <= dateCreatedBefore));
  });
  const start = (page - 1) * pageSize;
  return {
    ...normalizeTasksPage(firstPayload), count: filtered.length,
    tasks: filtered.slice(start, start + pageSize).map((task, index) => normalizeTaskSummary(task, start + index)),
    next: start + pageSize < filtered.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
  };
};

// ─── Task Detail Helpers ───────────────────────────────────────────────────────

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

const normalizeTimelineItem = (item) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  const status = typeof item.status === 'string' ? item.status : '';
  const normalizedStatus = status.toLowerCase();
  const tone = normalizedStatus === 'completed' ? 'done'
    : ['active', 'in_progress'].includes(normalizedStatus) ? 'active'
    : ['cancelled', 'canceled', 'deleted', 'dispute', 'disputed', 'failed'].includes(normalizedStatus) ? 'danger'
    : 'pending';
  return {
    title: String(item.label ?? EMPTY_VALUE),
    detail: String(item.description ?? ''),
    time: item.timestamp == null ? EMPTY_VALUE : formatDateCreated(item.timestamp),
    status,
    tone,
  };
};
const normalizeTaskDetail = (task) => {
  if (!task || typeof task !== 'object' || Object.keys(task).length === 0) return null;
  const rawId = String(pickFirst(task.id, task.task_id, task.uuid, 'unknown'));
  const poster = task.poster ?? task.customer ?? task.created_by ?? task.owner ?? {};
  const doer = task.doer ?? task.provider ?? task.assignee ?? task.worker ?? null;
  const posterName = String(pickFirst(task.poster_name, task.posterName, task.customer_name, task.customerName, buildName(poster)));

  const rawTimeline = task.status_timeline;
  const statusTimeline = Array.isArray(rawTimeline)
    ? rawTimeline.map(normalizeTimelineItem).filter(Boolean)
    : null;
  const budgetValue = pickFirst(task.budget, task.price);
  const budgetAmount = budgetValue === undefined ? NaN : Number(String(budgetValue).replace(/[$,]/g, ''));
  const viewsValue = pickFirst(task.views_count, task.views, task.view_count, task.total_task_viewers);
  const viewsCount = viewsValue === undefined ? NaN : Number(viewsValue);

  return {
    id: rawId,
    displayId: rawId.startsWith('#') ? rawId : `#${rawId}`,
    title: String(pickFirst(task.title, task.name, EMPTY_VALUE)),
    description: String(pickFirst(task.description, task.details, '')),
    category: String(pickFirst(task.category?.name, task.category_name, task.category, EMPTY_VALUE)),
    subcategory: String(pickFirst(task.subcategory?.name, task.sub_category_name, '')),
    budget: Number.isFinite(budgetAmount)
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(budgetAmount)
      : EMPTY_VALUE,
    dueDate: String(pickFirst(task.due_date, task.deadline, task.date_due, EMPTY_VALUE)),
    locationType: String(pickFirst(task.location_type, '')),
    address: String(pickFirst(task.address, task.location_address, '')),
    suburb: String(pickFirst(task.suburb?.name, task.suburb_name, task.suburb, '')),
    state: String(pickFirst(task.suburb?.state?.abbreviation, task.state, '')),
    status: String(pickFirst(task.status, EMPTY_VALUE)),
    priority: String(pickFirst(task.priority, '')),
    poster: {
      id: String(pickFirst(poster?.id, poster?.user_id, task.poster_id, task.posterId, '')),
      name: posterName,
      email: String(pickFirst(poster?.email, task.poster_email, task.posterEmail, '')),
    },
    doer: doer ? {
      id: String(pickFirst(doer?.id, doer?.user_id, '')),
      name: buildName(doer),
      email: String(pickFirst(doer?.email, '')),
    } : null,
    images: Array.isArray(task.images) ? task.images : [],
    viewsCount: Number.isInteger(viewsCount) && viewsCount >= 0 ? viewsCount : null,
    dateCreated: String(pickFirst(task.date_created, task.created_at, EMPTY_VALUE)),
    statusTimeline,
    raw: task,
  };
};

const normalizeQuestion = (question, index = 0) => {
  const askerObj = question?.user ?? question?.asker ?? question?.poster ?? {};
  const askerName = buildName(typeof askerObj === 'object' ? askerObj : {});
  const createdAt = question?.created_at ?? question?.timestamp ?? null;
  const timeAgo = createdAt ? (() => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    if (hours >= 24) return `${Math.floor(hours / 24)} DAY${Math.floor(hours / 24) > 1 ? 'S' : ''} AGO`;
    if (hours >= 1) return `${hours} HOUR${hours > 1 ? 'S' : ''} AGO`;
    return `${mins || 1} MIN${mins !== 1 ? 'S' : ''} AGO`;
  })() : '';

  const replyObj = question?.reply ?? question?.answer ?? (Array.isArray(question?.replies) ? question.replies[0] : null);
  const replierObj = replyObj?.user ?? replyObj?.replier ?? {};
  const replierName = buildName(typeof replierObj === 'object' ? replierObj : {});
  const replyCreatedAt = replyObj?.created_at ?? replyObj?.timestamp ?? null;
  const replyTimeAgo = replyCreatedAt ? (() => {
    const diff = Date.now() - new Date(replyCreatedAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    if (hours >= 1) return `${hours} HOUR${hours > 1 ? 'S' : ''} AGO`;
    return `${mins || 1} MIN${mins !== 1 ? 'S' : ''} AGO`;
  })() : '';

  return {
    id: String(pickFirst(question?.id, index + 1)),
    author: askerName || 'Anonymous',
    initials: buildInitials(askerName) || 'AN',
    question: String(pickFirst(question?.question, question?.content, question?.text, '')),
    timestamp: timeAgo || String(pickFirst(question?.created_at, '')),
    likes: Number(question?.likes ?? question?.vote_count ?? 0),
    reply: replyObj ? {
      author: replierName || 'Task Poster',
      initials: buildInitials(replierName) || 'TP',
      text: String(pickFirst(replyObj?.reply, replyObj?.content, replyObj?.text, '')),
      timestamp: replyTimeAgo,
      moderated: Boolean(replyObj?.is_moderated ?? false),
    } : undefined,
  };
};

// GET /api/tasks/{id}/
const fetchTaskById = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.taskDetail(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  const payload = await readJson(response, 'Failed to fetch task details');
  return normalizeTaskDetail(payload);
};

// DELETE /api/tasks/{id}/
const deleteTask = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.taskDetail(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    throw new AuthApiError(`Failed to delete task (${response.status})`, { status: response.status });
  }
  return true;
};

// POST /api/tasks/{id}/cancel/
const cancelTask = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.cancelTask(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'POST', body: '{}' });
  return readJson(response, 'Failed to cancel task');
};

// GET /api/tasks/{id}/questions/
const fetchTaskQuestions = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.taskQuestions(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  const payload = await readJson(response, 'Failed to fetch task questions');
  const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.results) ? payload.results : []);
  return items.map(normalizeQuestion);
};

// POST /api/tasks/{id}/questions/{pk}/reply/
const replyToQuestion = async (taskId, questionPk, data = {}, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.questionReply(taskId, questionPk)}`;
  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return readJson(response, 'Failed to reply to question');
};

// POST /api/tasks/{id}/increase-budget/
const increaseBudget = async (id, data = {}, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.increaseBudget(id)}`;
  const response = await requestJson(endpoint, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return readJson(response, 'Failed to increase budget');
};

// GET /api/tasks/{id}/receipt/
const fetchTaskReceipt = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${TASK_API_PATHS.taskReceipt(id)}`;
  const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
  return readJson(response, 'Failed to fetch task receipt');
};

module.exports = {
  fetchFilteredTasksPage,
  TASK_API_PATHS,
  cancelTask,
  deleteTask,
  fetchTaskById,
  fetchTaskQuestions,
  fetchTasksPage,
  fetchTaskReceipt,
  getTasksEndpoint,
  increaseBudget,
  normalizeQuestion,
  normalizeTaskDetail,
  normalizeTaskSummary,
  normalizeTasksPage,
  replyToQuestion,
};
