export type UserTaskHistoryRow = {
  routeId: string; id: string; title: string; service: string; date: string; dateCreated: string;
  status: string; poster: string; doer: string; amount: string; reward: string; milestone: string;
  isPoster: boolean; isDoer: boolean;
};
export type UserTaskHistoryFilters = {
  role: 'poster' | 'doer'; search?: string; status?: string; dateCreatedAfter?: string; dateCreatedBefore?: string;
};
export function fetchUserTaskHistory(userId: string, options?: { baseUrl?: string; authenticatedFetch?: typeof fetch; signal?: AbortSignal }): Promise<UserTaskHistoryRow[]>;
export function filterUserTaskHistory(rows: UserTaskHistoryRow[], filters: UserTaskHistoryFilters): UserTaskHistoryRow[];
