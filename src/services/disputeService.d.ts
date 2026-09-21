export interface DisputeSummary {
  id: string;
  rawId: string;
  task: string;
  service: string;
  raisedBy: string;
  role: string;
  initials: string;
  avatarClass: string;
  against: string;
  category: string;
  status: string;
  date: string;
  raw?: any;
}

export interface DisputePageResult {
  disputes: DisputeSummary[];
  count: number;
  page: number;
  totalPages: number;
}

export declare const DISPUTE_API_PATHS: {
  disputes: string;
  disputeDetail: (id: string | number) => string;
  resolve: (id: string | number) => string;
  addActivity: (id: string | number) => string;
};

export declare function normalizeDispute(dispute: any, index?: number): DisputeSummary;

export declare function fetchDisputesPage(options?: {
  baseUrl?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  task?: string | number;
  authenticatedFetch?: typeof fetch;
}): Promise<DisputePageResult>;

export declare function fetchDisputeById(
  id: string | number,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<{ raw: any; summary: DisputeSummary } | null>;

export declare function resolveDispute(
  id: string | number,
  data?: {
    status?: string;
    resolution_summary?: string;
    refund_amount?: string | number;
    release_amount_to_doer?: string | number;
    [key: string]: any;
  },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<DisputeSummary>;

export declare function addDisputeActivity(
  id: string | number,
  data?: {
    activity_type?: string;
    comment?: string;
    evidence?: string;
    [key: string]: any;
  },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;
