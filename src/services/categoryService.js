const { AuthApiError, DEFAULT_API_BASE_URL, authenticatedFetch: defaultAuthenticatedFetch } = require('./authService.js');

const CATEGORY_API_PATHS = {
  categories: '/api/categories/',
  categoryDetail: (id) => `/api/categories/${encodeURIComponent(String(id))}/`,
  subcategories: '/api/subcategories/',
  subcategoryDetail: (id) => `/api/subcategories/${encodeURIComponent(String(id))}/`,
};

const EMPTY_VALUE = 'N/A';

const resolveApiBaseUrl = (baseUrl) => {
  const configuredBaseUrl =
    baseUrl ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined) ||
    DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, '');
};

const getCategoriesEndpoint = (baseUrl) => `${resolveApiBaseUrl(baseUrl)}${CATEGORY_API_PATHS.categories}`;
const getCategoryEndpoint = (id, baseUrl) => `${resolveApiBaseUrl(baseUrl)}${CATEGORY_API_PATHS.categoryDetail(id)}`;
const getSubcategoriesEndpoint = (baseUrl) => `${resolveApiBaseUrl(baseUrl)}${CATEGORY_API_PATHS.subcategories}`;
const getSubcategoryEndpoint = (id, baseUrl) => `${resolveApiBaseUrl(baseUrl)}${CATEGORY_API_PATHS.subcategoryDetail(id)}`;

const extractCollection = (payload, keys) => {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const normalizeKeyword = (keyword) => {
  if (typeof keyword === 'string') return keyword;

  return String(pickFirst(keyword?.keyword, keyword?.name, keyword?.label, keyword?.value, EMPTY_VALUE));
};

const normalizeChecklistQuestion = (question, index = 0) => ({
  id: String(pickFirst(question?.id, question?.uuid, `question-${index + 1}`)),
  question: String(pickFirst(question?.question, question?.label, question?.name, question?.field_name, EMPTY_VALUE)),
  type: String(pickFirst(question?.type, question?.question_type, question?.field_type, 'text')),
  required: Boolean(pickFirst(question?.required, question?.is_required, false)),
  options: extractCollection(question, ['options', 'choices']).map(normalizeKeyword),
  order: Number(pickFirst(question?.order, question?.sort_order, index + 1)),
});

const normalizeSubcategory = (subcategory, index = 0) => ({
  id: String(pickFirst(subcategory?.id, subcategory?.uuid, `subcategory-${index + 1}`)),
  categoryId: String(pickFirst(subcategory?.category, subcategory?.category_id, subcategory?.parent, EMPTY_VALUE)),
  name: String(pickFirst(subcategory?.name, subcategory?.title, EMPTY_VALUE)),
  description: String(pickFirst(subcategory?.description, '')),
  slug: String(pickFirst(subcategory?.slug, '')),
  isActive: Boolean(pickFirst(subcategory?.is_active, subcategory?.active, true)),
  order: Number(pickFirst(subcategory?.order, subcategory?.sort_order, index + 1)),
  keywords: extractCollection(subcategory, ['keywords', 'keyword_list', 'tags']).map(normalizeKeyword),
  checklist: extractCollection(subcategory, ['checklist', 'questions', 'checklist_questions', 'items']).map(normalizeChecklistQuestion),
  raw: subcategory,
});

const normalizeCategoryType = (categoryType) => {
  const normalized = String(categoryType || '').toUpperCase();

  if (normalized.includes('PROFESSIONAL')) return 'PROFESSIONAL';
  if (normalized.includes('ONLINE')) return 'ONLINE';
  return 'IN_PERSON';
};

const normalizeCategory = (category, index = 0) => ({
  id: String(pickFirst(category?.id, category?.uuid, `category-${index + 1}`)),
  name: String(pickFirst(category?.name, category?.title, EMPTY_VALUE)),
  description: String(pickFirst(category?.description, '')),
  slug: String(pickFirst(category?.slug, '')),
  categoryType: normalizeCategoryType(pickFirst(category?.category_type, category?.type, category?.service_type, category?.categoryType)),
  isActive: Boolean(pickFirst(category?.is_active, category?.active, true)),
  order: Number(pickFirst(category?.order, category?.sort_order, index + 1)),
  keywords: extractCollection(category, ['keywords', 'keyword_list', 'tags']).map(normalizeKeyword),
  subcategories: extractCollection(category, ['subcategories', 'sub_categories', 'children']).map(normalizeSubcategory),
  raw: category,
});

const normalizeCategoriesPage = (payload) => {
  const rawCategories = extractCollection(payload, ['value', 'results', 'data', 'categories']);
  const categories = rawCategories.map(normalizeCategory);

  return {
    count: Number(pickFirst(payload?.Count, payload?.count, payload?.total, categories.length)),
    categories,
  };
};

const buildQuestionPayload = (question, index) => ({
  id: question.id && !String(question.id).startsWith('question-') ? question.id : undefined,
  question: question.question,
  question_type: question.type,
  is_required: Boolean(question.required),
  order: index + 1,
  options: question.options || [],
});

const buildSubcategoryPayload = (subcategory) => ({
  category: subcategory.categoryId,
  name: String(subcategory.name || '').trim(),
  description: String(subcategory.description || '').trim(),
  is_active: subcategory.isActive ?? true,
  keywords: (subcategory.keywords || []).map((keyword) => String(keyword).trim()).filter(Boolean),
  checklist_questions: (subcategory.checklist || []).map(buildQuestionPayload),
});

const buildCategoryPayload = (category) => {
  const payload = {
    name: String(category.name || '').trim(),
    category_type: category.categoryType || 'IN_PERSON',
    description: String(category.description || '').trim(),
    is_active: category.isActive ?? true,
  };

  if (category.slug) {
    payload.slug = String(category.slug).trim();
  }

  if (category.icon) {
    payload.icon = String(category.icon).trim();
  }

  if (category.order !== undefined && category.order !== null && !isNaN(Number(category.order))) {
    payload.order = Number(category.order);
  }

  return payload;
};

const readJson = async (response, fallbackMessage) => {
  if (!response.ok) {
    let details;

    try {
      details = await response.json();
    } catch {
      details = undefined;
    }

    const message =
      details?.detail ||
      details?.message ||
      details?.error ||
      Object.values(details || {}).flat().join(' ') ||
      fallbackMessage;

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

const fetchCategoriesPage = async (options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getCategoriesEndpoint(baseUrl), {
    ...requestOptions,
    method: 'GET',
  });
  const payload = await readJson(response, 'Categories request failed.');

  return normalizeCategoriesPage(payload);
};

const fetchCategoryById = async (id, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getCategoryEndpoint(id, baseUrl), {
    ...requestOptions,
    method: 'GET',
  });
  const payload = await readJson(response, 'Category request failed.');

  return normalizeCategory(payload);
};

const createCategory = async (category, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getCategoriesEndpoint(baseUrl), {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(buildCategoryPayload(category)),
  });
  const payload = await readJson(response, 'Create category request failed.');

  return normalizeCategory(payload);
};

const updateCategory = async (id, category, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getCategoryEndpoint(id, baseUrl), {
    ...requestOptions,
    method: 'PATCH',
    body: JSON.stringify(buildCategoryPayload(category)),
  });
  const payload = await readJson(response, 'Update category request failed.');

  return normalizeCategory(payload);
};

const createSubcategory = async (subcategory, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getSubcategoriesEndpoint(baseUrl), {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify(buildSubcategoryPayload(subcategory)),
  });
  const payload = await readJson(response, 'Create subcategory request failed.');

  return normalizeSubcategory(payload);
};

const updateSubcategory = async (id, subcategory, options = {}) => {
  const { baseUrl, ...requestOptions } = options;
  const response = await requestJson(getSubcategoryEndpoint(id, baseUrl), {
    ...requestOptions,
    method: 'PATCH',
    body: JSON.stringify(buildSubcategoryPayload(subcategory)),
  });
  const payload = await readJson(response, 'Update subcategory request failed.');

  return normalizeSubcategory(payload);
};

module.exports = {
  CATEGORY_API_PATHS,
  buildCategoryPayload,
  buildSubcategoryPayload,
  createCategory,
  createSubcategory,
  fetchCategoriesPage,
  fetchCategoryById,
  getCategoriesEndpoint,
  getCategoryEndpoint,
  getSubcategoriesEndpoint,
  getSubcategoryEndpoint,
  normalizeCategoriesPage,
  normalizeCategory,
  normalizeSubcategory,
  updateCategory,
  updateSubcategory,
};
