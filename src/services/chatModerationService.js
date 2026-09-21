const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const CHAT_MODERATION_API_PATHS = {
  chatRooms: '/api/chat-rooms/',
  chatRoomDetail: (id) => `/api/chat-rooms/${encodeURIComponent(String(id))}/`,
  chatRoomMessages: (id) => `/api/chat-rooms/${encodeURIComponent(String(id))}/messages/`,
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
    try {
      details = await response.json();
    } catch {
      details = undefined;
    }
    const message = details?.detail || details?.message || details?.error || fallbackMessage;
    throw new AuthApiError(message, { status: response.status, details });
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
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

const extractCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.chat_rooms)) return payload.chat_rooms;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeChatRoom = (room, index = 0) => {
  const id = String(room?.id ?? index + 1);
  const taskId = String(room?.task_id ?? 'N/A');
  const taskTitle = String(room?.task_title ?? 'Chat Room');
  const posterName = String(room?.poster_name ?? 'Poster');
  const doerName = String(room?.doer_name ?? 'Doer');
  const isActive = Boolean(room?.is_active ?? true);
  const createdAt = room?.created_at ? new Date(room.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

  return {
    modId: `#ML-${id}`,
    contentId: `C-${taskId}`,
    user: posterName,
    preview: taskTitle,
    riskScore: '12 / 100',
    riskTone: 'success',
    violation: 'NONE',
    decision: 'ALLOW',
    status: isActive ? 'Auto-cleared' : 'Closed',
    timestamp: createdAt,
    raw: room,
  };
};

const fetchChatRoomsPage = async (options = {}) => {
  const { baseUrl, page = 1, pageSize = 10, search, isActive, task, ...requestOptions } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  if (search) params.set('search', search);
  if (isActive !== undefined) params.set('is_active', String(isActive));
  if (task) params.set('task', String(task));

  const endpoint = `${resolveApiBaseUrl(baseUrl)}${CHAT_MODERATION_API_PATHS.chatRooms}?${params.toString()}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    const payload = await readJson(response, 'Failed to fetch chat rooms');
    const items = extractCollection(payload);
    const count = Number(payload.count ?? items.length);

    return {
      rooms: items.map(normalizeChatRoom),
      count,
      page: Number(page),
      totalPages: Math.ceil(count / pageSize) || 1,
    };
  } catch (err) {
    return {
      rooms: [],
      count: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

const fetchChatRoomMessages = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const endpoint = `${resolveApiBaseUrl(baseUrl)}${CHAT_MODERATION_API_PATHS.chatRoomMessages(id)}`;

  try {
    const response = await requestJson(endpoint, { ...requestOptions, method: 'GET' });
    return await readJson(response, 'Failed to fetch chat room messages');
  } catch (err) {
    return [];
  }
};

module.exports = {
  CHAT_MODERATION_API_PATHS,
  fetchChatRoomMessages,
  fetchChatRoomsPage,
  normalizeChatRoom,
};
