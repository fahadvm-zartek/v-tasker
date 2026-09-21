import assert from 'node:assert/strict';
import test from 'node:test';

import categoryService from './categoryService.js';

test('category service builds categories and subcategories endpoints', () => {
  assert.equal(categoryService.getCategoriesEndpoint('https://api.example.com/'), 'https://api.example.com/api/categories/');
  assert.equal(categoryService.getCategoryEndpoint(1, 'https://api.example.com/'), 'https://api.example.com/api/categories/1/');
  assert.equal(categoryService.getSubcategoriesEndpoint('https://api.example.com/'), 'https://api.example.com/api/subcategories/');
  assert.equal(categoryService.getSubcategoryEndpoint(5, 'https://api.example.com/'), 'https://api.example.com/api/subcategories/5/');
});

test('fetchCategoriesPage normalizes the backend categories payload with nested subcategories', async () => {
  const calls = [];
  const page = await categoryService.fetchCategoriesPage({
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: async (url, options) => {
      calls.push({ url, options });
      return {
        ok: true,
        json: async () => ({
          value: [
            {
              id: 1,
              name: 'Cleaning',
              slug: 'cleaning',
              category_type: 'IN_PERSON',
              description: '',
              is_active: true,
              order: 1,
              subcategories: [
                {
                  id: 1,
                  category: 1,
                  name: 'House Cleaning',
                  slug: 'house-cleaning',
                  keywords: ['deep cleaning'],
                  checklist_questions: [
                    {
                      id: 9,
                      question: 'How many rooms?',
                      question_type: 'number',
                      is_required: true,
                      options: [],
                      order: 1,
                    },
                  ],
                },
              ],
              keywords: [],
            },
          ],
          Count: 33,
        }),
      };
    },
  });

  assert.equal(calls[0].url, 'https://api.example.com/api/categories/');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.headers.Accept, 'application/json');
  assert.equal(page.count, 33);
  assert.equal(page.categories[0].id, '1');
  assert.equal(page.categories[0].categoryType, 'IN_PERSON');
  assert.equal(page.categories[0].subcategories[0].name, 'House Cleaning');
  assert.equal(page.categories[0].subcategories[0].keywords[0], 'deep cleaning');
  assert.equal(page.categories[0].subcategories[0].checklist[0].question, 'How many rooms?');
  assert.equal(page.categories[0].subcategories[0].checklist[0].type, 'number');
});

test('createSubcategory and updateSubcategory send backend payloads for keywords and checklist questions', async () => {
  const calls = [];
  const payload = {
    categoryId: '1',
    name: 'Deep Cleaning',
    description: 'Detailed cleaning',
    keywords: ['house cleaning', 'deep cleaning'],
    checklist: [
      {
        id: 'question-1',
        question: 'Cleaning type',
        type: 'single_select',
        required: true,
        options: ['Regular', 'Deep Cleaning'],
      },
    ],
  };
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 5, category: 1, name: 'Deep Cleaning' }),
    };
  };

  await categoryService.createSubcategory(payload, {
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: fetcher,
  });
  await categoryService.updateSubcategory(5, payload, {
    baseUrl: 'https://api.example.com/',
    authenticatedFetch: fetcher,
  });

  assert.equal(calls[0].url, 'https://api.example.com/api/subcategories/');
  assert.equal(calls[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    category: '1',
    name: 'Deep Cleaning',
    description: 'Detailed cleaning',
    is_active: true,
    keywords: ['house cleaning', 'deep cleaning'],
    checklist_questions: [
      {
        question: 'Cleaning type',
        question_type: 'single_select',
        is_required: true,
        order: 1,
        options: ['Regular', 'Deep Cleaning'],
      },
    ],
  });
  assert.equal(calls[1].url, 'https://api.example.com/api/subcategories/5/');
  assert.equal(calls[1].options.method, 'PATCH');
});

test('createCategory sends the backend payload for a main service category', async () => {
  const calls = [];

  const category = await categoryService.createCategory(
    {
      name: 'Cleaning',
      description: 'Home and office cleaning',
      categoryType: 'IN_PERSON',
      keywords: ['cleaning', 'home cleaning'],
    },
    {
      baseUrl: 'https://api.example.com/',
      authenticatedFetch: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          json: async () => ({ id: 7, name: 'Cleaning', category_type: 'IN_PERSON' }),
        };
      },
    },
  );

  assert.equal(calls[0].url, 'https://api.example.com/api/categories/');
  assert.equal(calls[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    name: 'Cleaning',
    description: 'Home and office cleaning',
    category_type: 'IN_PERSON',
    is_active: true,
  });
  assert.equal(category.id, '7');
  assert.equal(category.name, 'Cleaning');
  assert.equal(category.categoryType, 'IN_PERSON');
});

test('updateCategory sends the backend payload for an existing main service category', async () => {
  const calls = [];

  const category = await categoryService.updateCategory(
    7,
    {
      name: 'Cleaning Updated',
      description: 'Updated description',
      categoryType: 'IN_PERSON',
    },
    {
      baseUrl: 'https://api.example.com/',
      authenticatedFetch: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          json: async () => ({ id: 7, name: 'Cleaning Updated', category_type: 'IN_PERSON' }),
        };
      },
    },
  );

  assert.equal(calls[0].url, 'https://api.example.com/api/categories/7/');
  assert.equal(calls[0].options.method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    name: 'Cleaning Updated',
    description: 'Updated description',
    category_type: 'IN_PERSON',
    is_active: true,
  });
  assert.equal(category.id, '7');
  assert.equal(category.name, 'Cleaning Updated');
});
