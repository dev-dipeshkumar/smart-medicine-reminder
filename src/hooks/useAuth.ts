'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  safeRedirect,
  getIsRedirecting,
  isProtectedRoute,
  isAuthRoute,
  setStoredUser,
  getStoredUser
} from '@/lib/auth-client';
import api from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number | null;
  phone?: string | null;
  healthDetails?: string | null;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  age?: number | null;
  phone?: string | null;
}

/**
 * Custom hook for authentication
 * Handles login, signup, logout, and route protection
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  // Check auth state and handle redirects
  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      const token = getToken();
      const authenticated = !!token;

      console.log('[useAuth] Initializing, authenticated:', authenticated, 'path:', pathname);

      // If on auth route (login/signup) and already logged in, redirect to dashboard
      if (isAuthRoute(pathname) && authenticated) {
        console.log('[useAuth] User already authenticated, redirecting to dashboard');
        safeRedirect(router, '/dashboard');
        setLoading(false);
        return;
      }

      // If on protected route and not logged in, redirect to login
      if (isProtectedRoute(pathname) && !authenticated) {
        console.log('[useAuth] User not authenticated, redirecting to login');
        safeRedirect(router, '/login');
        setLoading(false);
        return;
      }

      // If authenticated, fetch user profile
      if (authenticated) {
        // First try to use cached user data
        const cachedUser = getStoredUser() as User | null;
        if (cachedUser) {
          setUser(cachedUser);
          setLoading(false);
        }
        
        // Then fetch fresh data
        try {
          const response = await api.get('/user/profile');
          setUser(response.data);
          setStoredUser(response.data);
        } catch (error) {
          console.error('[useAuth] Failed to fetch user profile:', error);
          // Token might be invalid, clear it
          removeToken();
          if (isProtectedRoute(pathname)) {
            safeRedirect(router, '/login');
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [pathname, router]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[useAuth] Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      
      const { access_token, user: userData } = response.data;
      
      // Store token and user
      setToken(access_token);
      setStoredUser(userData);
      setUser(userData);
      
      console.log('[useAuth] Login successful, redirecting to dashboard');
      
      // Use safe redirect to prevent loops
      safeRedirect(router, '/dashboard');
      
      return { success: true };
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error || 'Login failed. Please try again.';
      console.error('[useAuth] Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [router]);

  // Signup function
  const signup = useCallback(async (data: SignupData) => {
    try {
      console.log('[useAuth] Attempting signup for:', data.email);
      await api.post('/auth/signup', data);
      
      console.log('[useAuth] Signup successful, redirecting to login');
      
      // Redirect to login with a flag
      safeRedirect(router, '/login?registered=true');
      
      return { success: true };
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error || 'Signup failed. Please try again.';
      console.error('[useAuth] Signup failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    console.log('[useAuth] Logging out');
    removeToken();
    setUser(null);
    safeRedirect(router, '/login');
  }, [router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) return;
    
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
      setStoredUser(response.data);
    } catch (error) {
      console.error('[useAuth] Failed to refresh user:', error);
    }
  }, []);

  return {
    user,
    loading,
    authenticated: !!user,
    login,
    signup,
    logout,
    refreshUser
  };
}

/**
 * Hook for protecting routes - redirects to login if not authenticated
 * Use in protected page components
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const checked = useRef(false);

  useEffect(() => {
    if (loading || checked.current) return;
    
    checked.current = true;
    
    if (!user && !getIsRedirecting()) {
      console.log('[useRequireAuth] No user, redirecting to login');
      safeRedirect(router, '/login');
    }
  }, [user, loading, router, pathname]);

  return { user, loading };
}

/**
 * Hook for auth pages - redirects to dashboard if already authenticated
 * Use in login/signup page components
 */
export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const checked = useRef(false);

  useEffect(() => {
    if (loading || checked.current) return;
    
    checked.current = true;
    
    if (user && !getIsRedirecting()) {
      console.log('[useRedirectIfAuthenticated] User exists, redirecting to dashboard');
      safeRedirect(router, '/dashboard');
    }
  }, [user, loading, router, pathname]);

  return { loading };
}
