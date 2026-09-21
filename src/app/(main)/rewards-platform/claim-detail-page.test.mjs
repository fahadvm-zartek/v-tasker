import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readDetailPage = () => readFile(new URL('./claims/[claimId]/page.tsx', import.meta.url), 'utf8');

test('reward claim detail page renders pending fulfillment form', async () => {
  const source = await readDetailPage();

  assert.match(source, /params: Promise<\{ claimId: string \}>/);
  assert.match(source, /claimDetails/);
  assert.match(source, /Pending/);

  for (const text of [
    'Rewards Platform',
    'Pending Claims',
    'Claim #',
    'Fulfill Reward',
    'Pending',
    'Recipient Details',
    'NAME',
    'John Doe',
    'SHIPPING ADDRESS',
    '123 Maple St',
    'Sydney NSW 2000',
    'Australia',
    'MILESTONE REACHED',
    'Gold Driver',
    'REWARD ITEM',
    'Premium Gear Pack',
    'Fulfillment Configuration',
    'Shipment Provider',
    'Shiprocket',
    'Tracking Number',
    'e.g. TRK-998234-AU',
    'Estimated Delivery Date',
    'mm/dd/yyyy',
    'Notes',
    'Ensure physical items are packed securely before confirming shipment.',
    'Cancel',
    'Mark as Shipped',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('reward claim detail page supports read-only fulfillment detail states', async () => {
  const source = await readDetailPage();

  for (const text of [
    'CLM-8825',
    'CLM-8826',
    'In Transit',
    'Completed',
    'Delivered',
    'Reward Fulfillment Detail - #',
    "contentClassName={isPending ? 'px-5 pb-10 pt-5' : 'flex min-h-[calc(100vh-76px)] items-center justify-center bg-[#7d8793] px-4 py-4'}",
    'max-w-[860px]',
    'min-h-[560px]',
    'Premium Fuel Voucher',
    'Milestone 2 Achieved (200 Tasks Completed)',
    'VALUE',
    '$50.00 USD',
    'VOUCHER CODE',
    'FV-2023-A7B9',
    'RECIPIENT INFORMATION',
    'CST-84920',
    'j.doe@example.com',
    '+1 (555) 123-4567',
    'SHIPPING DETAILS',
    'Delivery Address',
    '123 Innovation Drive',
    'Suite 400',
    'Tech City, CA 94016',
    'Method',
    'Express Courier (2-3 Business Days)',
    'Tracking Number',
    'TRK-994829103',
    'FULFILLMENT TIMELINE',
    'Reward Claimed',
    'Order Processed',
    'Shipped',
    'Download Invoice',
    'Contact User',
    'Update Status',
    'href="/rewards-platform?tab=milestones"',
  ]) {
    assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
