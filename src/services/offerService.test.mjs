import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeOffer,
  normalizeMessage,
  fetchOffersByTask,
  fetchOfferMessages,
} from './offerService.js';

test('normalizeOffer parses currency strings and breakdown fields correctly', () => {
  const rawOffer = {
    id: 10,
    doer: { name: 'AC Master Tech', profile: { average_rating: '4.8', total_reviews: 42 } },
    price: '$150.00',
    service_amount: '150.00',
    commission_amount: '15.00',
    other_fees: '5.00',
    payout_amount: '130.00',
    description: 'Complete AC servicing & gas refill',
    status: 'PENDING',
  };

  const normalized = normalizeOffer(rawOffer);

  assert.equal(normalized.id, '10');
  assert.equal(normalized.name, 'AC Master Tech');
  assert.equal(normalized.rating, '4.8 (42)');
  assert.equal(normalized.bid, '$150.00');
  assert.equal(normalized.serviceAmount, '$150.00');
  assert.equal(normalized.commission, '-$15.00');
  assert.equal(normalized.otherFees, '-$5.00');
  assert.equal(normalized.payout, '$130.00');
  assert.equal(normalized.description, 'Complete AC servicing & gas refill');
  assert.equal(normalized.status, 'PENDING');
});

test('normalizeOffer handles string doer name and fallback commission calculations', () => {
  const rawOffer = {
    id: 13,
    doer: 'Sarah J.',
    price: 200,
    description: 'Electric repair',
    status: 'ACCEPTED',
  };

  const normalized = normalizeOffer(rawOffer);

  assert.equal(normalized.id, '13');
  assert.equal(normalized.name, 'Sarah J.');
  assert.equal(normalized.initials, 'SJ');
  assert.equal(normalized.bid, '$200.00');
  assert.equal(normalized.commission, '-$20.00');
  assert.equal(normalized.payout, '$180.00');
  assert.equal(normalized.state, 'accepted');
});

test('normalizeMessage extracts messages with flexible schema fields', () => {
  const rawMessage = {
    id: 'msg-101',
    author: { first_name: 'John', last_name: 'Doe' },
    content: 'Is access available at 9am?',
    created_at: '2026-09-22T10:30:00Z',
  };

  const normalized = normalizeMessage(rawMessage);

  assert.equal(normalized.id, 'msg-101');
  assert.equal(normalized.senderName, 'John Doe');
  assert.equal(normalized.senderInitials, 'JD');
  assert.equal(normalized.text, 'Is access available at 9am?');
  assert.ok(normalized.timestamp);
});

test('fetchOffersByTask handles single offer response or paginated payload', async () => {
  const mockFetch = async (url) => {
    if (url.includes('/api/offers/10/')) {
      return {
        ok: true,
        json: async () => ({
          id: 10,
          doer: 'AC Tech',
          price: 120,
          status: 'PENDING',
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        results: [
          { id: 10, doer: 'AC Tech', price: 120, status: 'PENDING' },
        ],
      }),
    };
  };

  const offers = await fetchOffersByTask('10', { authenticatedFetch: mockFetch });
  assert.equal(offers.length, 1);
  assert.equal(offers[0].id, '10');
  assert.equal(offers[0].name, 'AC Tech');
});

test('fetchOfferMessages normalizes offer messages collection', async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => [
      { id: 1, sender: { name: 'Alice' }, message: 'Hello!' },
      { id: 2, sender: { name: 'Bob' }, message: 'Hi there!' },
    ],
  });

  const messages = await fetchOfferMessages('10', { authenticatedFetch: mockFetch });
  assert.equal(messages.length, 2);
  assert.equal(messages[0].senderName, 'Alice');
  assert.equal(messages[1].text, 'Hi there!');
});
