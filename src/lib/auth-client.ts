/**
 * Client-side authentication utilities
 * Centralized auth management to prevent redirect loops
 */

// Token key constant
const TOKEN_KEY = 'medicare_token';
const USER_KEY = 'medicare_user';

// Global flag to prevent multiple redirects
let isRedirecting = false;

/**
 * Get the stored auth token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the auth token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the auth token
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Get stored user data
 */
export function getStoredUser(): unknown {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Store user data
 */
export function setStoredUser(user: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear all auth data (logout)
 */
export function clearAuth(): void {
  removeToken();
  isRedirecting = false;
}

/**
 * Check if currently redirecting (to prevent loops)
 */
export function getIsRedirecting(): boolean {
  return isRedirecting;
}

/**
 * Set redirecting state
 */
export function setIsRedirecting(value: boolean): void {
  isRedirecting = value;
}

/**
 * Safe redirect that prevents loops
 * Only redirects once per auth action
 */
export function safeRedirect(router: { push: (url: string) => void }, url: string): void {
  if (isRedirecting) {
    console.log('[Auth] Redirect already in progress, skipping...');
    return;
  }
  
  isRedirecting = true;
  console.log('[Auth] Redirecting to:', url);
  
  // Reset the flag after a short delay
  setTimeout(() => {
    isRedirecting = false;
  }, 1000);
  
  router.push(url);
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = ['/', '/login', '/signup', '/landing'];

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/medicines',
  '/medicines/add',
  '/status',
  '/ai-assistant',
  '/emergency',
  '/profile'
];

/**
 * Auth routes (login/signup) that logged-in users shouldn't access
 */
export const AUTH_ROUTES = ['/login', '/signup'];

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/medicines/edit');
}

/**
 * Check if a path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is an auth route (login/signup)
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}
