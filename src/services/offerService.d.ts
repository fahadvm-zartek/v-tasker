import type { AuthRequestOptions } from './authService';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type NormalizedOffer = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  rating: string;
  bid: string;
  serviceAmount: string;
  commission: string;
  otherFees: string;
  payout: string;
  description: string;
  availability: string | null;
  status: OfferStatus;
  state?: 'accepted' | 'dispute' | undefined;
  doerId: string;
  raw: Record<string, unknown>;
};

export type NormalizedMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  text: string;
  timestamp: string;
  createdAt: string | null;
  isAdminView: boolean;
};

export type OfferRequestOptions = AuthRequestOptions & {
  authenticatedFetch?: typeof fetch;
  baseUrl?: string;
};

export const OFFER_API_PATHS: {
  offers: string;
  offerDetail: (id: string | number) => string;
  acceptOffer: (id: string | number) => string;
  rejectOffer: (id: string | number) => string;
  withdrawOffer: (id: string | number) => string;
  offerMessages: (id: string | number) => string;
};

export function normalizeOffer(offer: Record<string, unknown>, index?: number): NormalizedOffer;
export function normalizeMessage(msg: Record<string, unknown>, index?: number): NormalizedMessage;
export function fetchOffersByTask(taskId: string | number, options?: OfferRequestOptions): Promise<NormalizedOffer[]>;
export function fetchOfferById(id: string | number, options?: OfferRequestOptions): Promise<NormalizedOffer>;
export function acceptOffer(id: string | number, options?: OfferRequestOptions): Promise<unknown>;
export function rejectOffer(id: string | number, options?: OfferRequestOptions): Promise<unknown>;
export function withdrawOffer(id: string | number, options?: OfferRequestOptions): Promise<unknown>;
export function deleteOffer(id: string | number, options?: OfferRequestOptions): Promise<boolean>;
export function fetchOfferMessages(id: string | number, options?: OfferRequestOptions): Promise<NormalizedMessage[]>;
