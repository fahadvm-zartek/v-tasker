export type AuthRouteName =
  | 'login'
  | 'logout'
  | 'passwordChange'
  | 'passwordReset'
  | 'passwordResetConfirm'
  | 'registration'
  | 'registrationResendEmail'
  | 'registrationVerifyEmail'
  | 'tokenRefresh'
  | 'tokenVerify';

export type AuthPayload = Record<string, unknown>;

export type AuthRequestOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
};

export type AuthSession = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

export type RegisterPayload = {
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  user_type_name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type StoredAuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
};

export class AuthApiError extends Error {
  status?: number;
  fieldErrors: Record<string, string>;
  details?: unknown;
}

export const DEFAULT_API_BASE_URL: string;
export const AUTH_API_PATHS: Record<AuthRouteName, string>;
export const AUTH_ENDPOINTS: Record<AuthRouteName, string>;
export const AUTH_STORAGE_KEYS: {
  authenticated: string;
  adminSession: string;
  token: string;
  accessToken: string;
  refreshToken: string;
  legacyToken: string;
  userProfile: string;
};

export function getAuthEndpoint(routeName: AuthRouteName, baseUrl?: string): string;
export function getLoginEndpoint(baseUrl?: string): string;
export function postAuthEndpoint(routeName: AuthRouteName, payload?: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function login(credentials: LoginPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function logout(payload?: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function authenticatedFetch(input: RequestInfo | URL, options?: RequestInit & AuthRequestOptions): Promise<Response>;
export function changePassword(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function resetPassword(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function confirmPasswordReset(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function register(payload: RegisterPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function resendVerificationEmail(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function verifyEmail(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function refreshToken(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function verifyToken(payload: AuthPayload, options?: AuthRequestOptions): Promise<AuthSession>;
export function getStoredAuthSession(storage?: Pick<Storage, 'getItem'>): StoredAuthSession;
export function getStoredUserProfile(storage?: Pick<Storage, 'getItem'>): UserProfile;
export function hasStoredAuthSession(storage?: Pick<Storage, 'getItem'>): boolean;
export function persistAuthSession(session: AuthSession, storage?: Pick<Storage, 'setItem'>): void;
export function persistUserProfile(profile: Partial<UserProfile>, storage?: Pick<Storage, 'setItem'>): UserProfile;
export function clearAuthSession(
  storage?: Pick<Storage, 'removeItem'>,
  sessionStorageRef?: Pick<Storage, 'clear'>,
  persistentStorageRef?: Pick<Storage, 'removeItem'>,
): void;

declare const authService: {
  AUTH_API_PATHS: typeof AUTH_API_PATHS;
  AUTH_ENDPOINTS: typeof AUTH_ENDPOINTS;
  AUTH_STORAGE_KEYS: typeof AUTH_STORAGE_KEYS;
  AuthApiError: typeof AuthApiError;
  DEFAULT_API_BASE_URL: typeof DEFAULT_API_BASE_URL;
  authenticatedFetch: typeof authenticatedFetch;
  changePassword: typeof changePassword;
  clearAuthSession: typeof clearAuthSession;
  confirmPasswordReset: typeof confirmPasswordReset;
  getStoredAuthSession: typeof getStoredAuthSession;
  getStoredUserProfile: typeof getStoredUserProfile;
  hasStoredAuthSession: typeof hasStoredAuthSession;
  getAuthEndpoint: typeof getAuthEndpoint;
  getLoginEndpoint: typeof getLoginEndpoint;
  login: typeof login;
  logout: typeof logout;
  persistAuthSession: typeof persistAuthSession;
  persistUserProfile: typeof persistUserProfile;
  postAuthEndpoint: typeof postAuthEndpoint;
  refreshToken: typeof refreshToken;
  register: typeof register;
  resendVerificationEmail: typeof resendVerificationEmail;
  resetPassword: typeof resetPassword;
  verifyEmail: typeof verifyEmail;
  verifyToken: typeof verifyToken;
};

export default authService;
