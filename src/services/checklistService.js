// Match the CommonJS API services used by the app and Node service tests.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { authenticatedFetch, DEFAULT_API_BASE_URL } = require('./authService.js');

const slugify = (value) => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const types = { text: 'short_text', number: 'number_input', multiple_select: 'multi_select', yes_no: 'boolean_toggle' };
const componentNumbers = {
  content_block: 'C01', single_select: 'C02', multi_select: 'C03', counter: 'C04',
  short_text: 'C05', long_text: 'C06', number_input: 'C07', boolean_toggle: 'C08',
  location_input: 'C09', repeatable_text_list: 'C10', date_input: 'C11',
};
const getComponentNumber = (type) => {
  const number = componentNumbers[types[type] || type];
  if (!number) throw new Error('Select a supported checklist field type.');
  return number;
};
const uiTypes = { short_text: 'text', number_input: 'number', multi_select: 'multiple_select', boolean_toggle: 'yes_no' };
const base = (options) => (options.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
const request = async (path, method, body, options = {}) => {
  const { baseUrl, authenticatedFetch: fetcher = authenticatedFetch, ...rest } = options;
  const response = await fetcher(`${base({ baseUrl })}${path}`, {
    ...rest, method, headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (response.status === 204) return null;
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.detail || Object.values(payload).flat().join(' ') || 'Checklist request failed.');
  return payload;
};

const fetchChecklist = async (subcategoryId, options = {}) => {
  if (!/^\d+$/.test(String(subcategoryId)) || Number(subcategoryId) <= 0) throw new Error('Select a valid service.');
  let path = `/api/checklist-definitions/?subcategory=${encodeURIComponent(subcategoryId)}`;
  const definitions = [];
  const visited = new Set();
  while (path && !visited.has(path)) {
    visited.add(path);
    const page = await request(path, 'GET', null, options);
    definitions.push(...(Array.isArray(page) ? page : page.results || []));
    if (!page.next) break;
    const next = new URL(page.next, `${base(options)}${path}`);
    if (next.origin !== new URL(base(options)).origin || next.pathname !== '/api/checklist-definitions/') throw new Error('Invalid checklist pagination URL.');
    next.searchParams.set('subcategory', String(subcategoryId));
    path = `${next.pathname}${next.search}`;
  }
  const available = definitions.filter(d => d.status !== 'archived');
  available.sort((a, b) => Number(b.version || b.id) - Number(a.version || a.id));
  const selected = available.find(d => d.status === 'draft') || available[0];
  if (!selected) return { definition: null, questions: [] };
  const definition = await request(`/api/checklist-definitions/${encodeURIComponent(selected.id)}/`, 'GET', null, options);
  const questions = [...(definition.sections || [])].sort((a, b) => a.order - b.order).flatMap(section =>
    [...(section.components || [])].sort((a, b) => a.order - b.order).map(component => ({
      id: String(component.id), sectionId: String(section.id), question: component.label || component.title || '',
      componentNumber: component.component_number,
      type: uiTypes[component.component_type] || component.component_type, required: Boolean(component.required),
      order: component.order, options: [...(component.options || [])].sort((a, b) => a.order - b.order).map(option => option.label),
    })));
  return { definition, questions };
};

const addChecklistQuestion = async (subcategoryId, serviceName, question, options = {}) => {
  if (!question.question?.trim()) throw new Error('Field name is required.');
  const componentNumber = getComponentNumber(question.type);
  const componentType = types[question.type] || question.type;
  const choices = [...new Set((question.options || []).map(value => value.trim()).filter(Boolean))];
  if (['single_select', 'multi_select'].includes(componentType) && !choices.length) throw new Error('At least one option is required.');
  let { definition } = await fetchChecklist(subcategoryId, options);
  if (!definition) {
    definition = await request('/api/checklist-definitions/', 'POST', {
      subcategory: Number(subcategoryId), slug: `service-${subcategoryId}-checklist`, screen_title: `${serviceName} checklist`,
    }, options);
  } else if (definition.status === 'published') {
    const draft = await request(`/api/checklist-definitions/${definition.id}/new-version/`, 'POST', {}, options);
    definition = await request(`/api/checklist-definitions/${draft.id}/`, 'GET', null, options);
  }
  let section = definition.sections?.[0];
  if (!section) section = await request('/api/checklist-sections/', 'POST', {
    definition: definition.id, slug: 'requirements', title: 'Requirements', order: 1,
  }, options);
  const order = Math.max(0, ...(section.components || []).map(c => Number(c.order) || 0)) + 1;
  const suffix = globalThis.crypto.randomUUID().slice(0, 8);
  const component = await request('/api/checklist-components/', 'POST', {
    section: section.id, slug: `${slugify(question.question).slice(0, 40) || 'field'}-${suffix}`,
    component_number: componentNumber,
    component_type: componentType, label: question.question.trim(), required: Boolean(question.required), order,
  }, options);
  try {
    for (const [index, label] of choices.entries()) {
      if (!['single_select', 'multi_select'].includes(componentType)) break;
      await request('/api/checklist-options/', 'POST', {
        component: component.id, slug: `${slugify(label).slice(0, 40) || 'option'}-${index + 1}`, label, order: index + 1,
      }, options);
    }
  } catch (error) {
    try { await request(`/api/checklist-components/${component.id}/`, 'DELETE', null, options); }
    catch { throw new Error(`${error.message} The field was created with incomplete options; reload before retrying.`); }
    throw error;
  }
  return component;
};

const deleteChecklistQuestion = (id, options = {}) => request(`/api/checklist-components/${encodeURIComponent(id)}/`, 'DELETE', null, options);
const reorderChecklistQuestions = async (questions, options = {}) => {
  for (const [index, question] of questions.entries()) {
    await request(`/api/checklist-components/${encodeURIComponent(question.id)}/`, 'PATCH', { order: index + 1 }, options);
  }
};

const saveChecklistQuestions = async (subcategoryId, serviceName, questions, options = {}) => {
  for (const question of questions) {
    if (!question.question?.trim()) throw new Error('Field name is required.');
    getComponentNumber(question.type);
    if (['single_select', 'multiple_select', 'multi_select'].includes(question.type) && !question.options?.some(value => value.trim())) throw new Error('At least one option is required.');
  }
  const current = await fetchChecklist(subcategoryId, options);
  const sameContent = (a, b) => a.question === b.question && getComponentNumber(a.type) === getComponentNumber(b.type) && a.type === b.type && a.required === b.required && JSON.stringify(a.options) === JSON.stringify(b.options);
  if (current.questions.length === questions.length && questions.every((q, i) => sameContent(q, current.questions[i]))) return;
  if (current.definition && current.definition.status !== 'draft') throw new Error('Create a draft version before editing this published checklist. Use Add New Checklist Item to start a new version.');
  const retained = new Set();
  const saved = [];
  for (const [index, question] of questions.entries()) {
    const existing = current.questions.find(q => q.id === question.id) || current.questions.find(q => !retained.has(q.id) && sameContent(q, question));
    if (!existing) {
      const created = await addChecklistQuestion(subcategoryId, serviceName, question, options);
      saved.push({ ...question, id: String(created.id) });
      continue;
    }
    retained.add(existing.id);
    saved.push({ ...question, id: existing.id });
    await request(`/api/checklist-components/${existing.id}/`, 'PATCH', {
      label: question.question.trim(), component_type: types[question.type] || question.type,
      component_number: getComponentNumber(question.type),
      required: question.required, order: index + 1,
    }, options);
    if (JSON.stringify(existing.options) !== JSON.stringify(question.options)) {
      const component = await request(`/api/checklist-components/${existing.id}/`, 'GET', null, options);
      for (const option of component.options || []) await request(`/api/checklist-options/${option.id}/`, 'DELETE', null, options);
      if (['single_select', 'multiple_select', 'multi_select'].includes(question.type)) {
        for (const [i, label] of question.options.entries()) {
          await request('/api/checklist-options/', 'POST', { component: Number(existing.id), slug: `${slugify(label).slice(0, 40) || 'option'}-${i + 1}`, label, order: i + 1 }, options);
        }
      }
    }
  }
  for (const question of current.questions) {
    if (!retained.has(question.id)) await deleteChecklistQuestion(question.id, options);
  }
  await reorderChecklistQuestions(saved, options);
};

module.exports = { getComponentNumber, fetchChecklist, addChecklistQuestion, deleteChecklistQuestion, reorderChecklistQuestions, saveChecklistQuestions };
