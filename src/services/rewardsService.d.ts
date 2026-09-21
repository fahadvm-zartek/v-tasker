export declare const REWARDS_API_PATHS: {
  rewardConfigs: string;
  rewardConfigDetail: (id: string | number) => string;
  rewardClaims: string;
  rewardClaimDetail: (id: string | number) => string;
};

export declare function fetchRewardConfigs(options?: {
  baseUrl?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<any[]>;

export declare function createRewardConfig(
  data: any,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;

export declare function updateRewardConfig(
  id: string | number,
  data: any,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;

export declare function deleteRewardConfig(
  id: string | number,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<void>;

export declare function fetchRewardClaims(options?: {
  baseUrl?: string;
  page?: number;
  pageSize?: number;
  authenticatedFetch?: typeof fetch;
}): Promise<{ claims: any[]; count: number; page: number; totalPages: number }>;

export declare function fetchRewardClaimById(
  id: string | number,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;

export declare function updateRewardClaimStatus(
  id: string | number,
  status: string,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<any>;
