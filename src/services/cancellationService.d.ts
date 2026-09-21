export interface CancellationRow {
  id: string;
  rawId: string;
  task: string;
  service: string;
  type: string;
  initiatedBy: string;
  role: string;
  initials: string;
  avatarClass: string;
  reason: string;
  amount: string;
  status: string;
  isPaid: boolean;
  date: string;
  raw?: any;
}

export interface CancellationPageResult {
  cancellations: CancellationRow[];
  count: number;
  page: number;
  totalPages: number;
}

export declare const CANCELLATION_API_PATHS: {
  cancellationFees: string;
  cancellationFeeDetail: (id: string | number) => string;
};

export declare function normalizeCancellation(item: any, index?: number): CancellationRow;

export declare function fetchCancellationFeesPage(options?: {
  baseUrl?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  isPaid?: boolean;
  task?: string | number;
  user?: string | number;
  createdAfter?: string;
  createdBefore?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<CancellationPageResult>;
