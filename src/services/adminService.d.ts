export interface AdminDashboardData {
  users?: {
    total?: number;
    normal_users?: number;
    student_users?: number;
    suspended_count?: number;
    expired_student_users?: number;
    verification_requests?: number;
    new_last_30_days?: number;
    by_type?: { TASK_DOER?: number; ADMIN?: number; BOTH?: number; TASK_POSTER?: number };
    normal?: number;
    student?: number;
    both?: number;
    doer?: number;
    poster?: number;
    verified?: number;
    unverified?: number;
    active?: number;
    inactive?: number;
    suspended?: number;
    pending_approvals?: number;
    expired_students?: number;
    reported_users?: number;
    reported?: number;
    [key: string]: any;
  };
  tasks?: {
    total?: number;
    active?: number;
    completed?: number;
    pending?: number;
    no_offers?: number;
    disputes?: number;
    cancellations?: number;
    deletion_rate?: number;
    cancellation_rate?: number;
    [key: string]: any;
  };
  offers?: Record<string, any>;
  payments?: {
    total_amount?: string | number;
    total_commission?: string | number;
    normal_commission?: string | number;
    student_commission?: string | number;
    cancellations_earnings?: string | number;
    [key: string]: any;
  };
  disputes?: {
    open?: number;
    under_review?: number;
    resolved?: number;
    closed?: number;
    total?: number;
    [key: string]: any;
  };
  top_categories?: Array<{
    name?: string;
    label?: string;
    value?: string | number;
    count?: number;
    percentage?: string | number;
  }>;
  top_suburbs?: any[];
  top_doers?: any[];
  top_posters?: any[];
  recent_disputes?: any[];
  recent_payments?: any[];
  [key: string]: any;
}

export interface AdminReportsData {
  period?: {
    from?: string;
    to?: string;
  };
  users?: Record<string, any>;
  tasks?: Record<string, any>;
  offers?: Record<string, any>;
  payments?: Record<string, any>;
  disputes?: Record<string, any>;
  [key: string]: any;
}

export declare const ADMIN_API_PATHS: {
  dashboard: string;
  reports: string;
};

export declare function fetchAdminDashboard(options?: {
  baseUrl?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<AdminDashboardData | null>;

export declare function fetchAdminReports(options?: {
  baseUrl?: string;
  from?: string;
  to?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<AdminReportsData | null>;
