export declare const PAYMENT_API_PATHS: {
  allWallets: string;
  withdrawals: string;
  withdrawalDetail: (id: string | number) => string;
  approveWithdrawal: (id: string | number) => string;
  rejectWithdrawal: (id: string | number) => string;
};

export declare function fetchAllWallets(options?: {
  baseUrl?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<any[]>;

export declare function fetchWithdrawalsPage(options?: {
  baseUrl?: string;
  page?: number;
  pageSize?: number;
  status?: string;
  user?: string | number;
  search?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<{ withdrawals: any[]; count: number; page: number; totalPages: number }>;

export declare function approveWithdrawal(
  id: string | number,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;

export declare function rejectWithdrawal(
  id: string | number,
  reason?: string,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;
