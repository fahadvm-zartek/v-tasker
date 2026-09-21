import type { AuthRequestOptions } from './authService';

export type UserRole = string;

export type UserSummary = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  mobile: string;
  email: string;
  role: UserRole;
  lastInteraction: string;
};

export type UserDetail = {
  raw: Record<string, unknown>;
  summary: UserSummary;
};

export type UsersPageResult = {
  count: number;
  next: string | null;
  previous: string | null;
  users: UserSummary[];
};

export type UserRequestOptions = AuthRequestOptions & {
  authenticatedFetch?: typeof fetch;
  page?: number;
  pageSize?: number;
  dateJoinedAfter?: string;
  dateJoinedBefore?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  ordering?: string;
  phone?: string;
  search?: string;
  userType?: string;
};

export const USER_API_PATHS: {
  users: string;
  userDetail: (id: string) => string;
};

export function getUsersEndpoint(baseUrl?: string, query?: number | UserRequestOptions): string;
export function getUserEndpoint(id: string, baseUrl?: string): string;
export function normalizeUserSummary(user: Record<string, unknown>, index?: number): UserSummary;
export function normalizeUserDetail(payload: unknown): UserDetail;
export function normalizeUsersPage(payload: unknown): UsersPageResult;
export function fetchUsersPage(options?: UserRequestOptions): Promise<UsersPageResult>;
export function fetchUsers(options?: UserRequestOptions): Promise<UserSummary[]>;
export function fetchUserById(id: string, options?: UserRequestOptions): Promise<UserDetail>;
export function activateUser(id: string, options?: UserRequestOptions): Promise<UserDetail>;
export function suspendUser(id: string, options?: UserRequestOptions): Promise<UserDetail>;
export function changeUserType(id: string, data?: Record<string, unknown>, options?: UserRequestOptions): Promise<UserDetail>;

declare const userService: {
  USER_API_PATHS: typeof USER_API_PATHS;
  activateUser: typeof activateUser;
  changeUserType: typeof changeUserType;
  fetchUserById: typeof fetchUserById;
  fetchUsersPage: typeof fetchUsersPage;
  fetchUsers: typeof fetchUsers;
  getUserEndpoint: typeof getUserEndpoint;
  getUsersEndpoint: typeof getUsersEndpoint;
  normalizeUserDetail: typeof normalizeUserDetail;
  normalizeUserSummary: typeof normalizeUserSummary;
  normalizeUsersPage: typeof normalizeUsersPage;
  suspendUser: typeof suspendUser;
};

export default userService;
