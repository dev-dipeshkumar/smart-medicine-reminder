'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Pill,
  CalendarCheck,
  Bot,
  Phone,
  User,
  LogOut,
  Menu,
  X,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { safeRedirect, getIsRedirecting } from '@/lib/auth-client';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/medicines', label: 'Medicines', icon: Pill },
  { path: '/status', label: 'Status', icon: CalendarCheck },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { path: '/emergency', label: 'Emergency', icon: Phone },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasRedirected = useRef(false);

  // Handle redirect if not authenticated
  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Prevent multiple redirects
    if (hasRedirected.current || getIsRedirecting()) return;
    
    // If no user after loading completes, redirect to login
    if (!user) {
      hasRedirected.current = true;
      console.log('[DashboardLayout] No user, redirecting to login');
      safeRedirect(router, '/login');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <HeartPulse className="w-8 h-8 text-[#0284c7] animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show redirecting message (redirect is handled by useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HeartPulse className="w-8 h-8 text-teal-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-[#0284c7]" />
          <span className="font-bold text-xl text-[#0c4a6e]">MediCare</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-[#e0f2fe]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-[#e0f2fe]">
            <HeartPulse className="w-10 h-10 text-[#0284c7]" />
            <div>
              <h1 className="font-bold text-xl text-[#0c4a6e]">MediCare</h1>
              <p className="text-xs text-[#0369a1]">AI Medicine Reminder</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-[#0284c7] text-white shadow-md'
                      : 'text-gray-600 hover:bg-[#e0f2fe] hover:text-[#0284c7]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#e0f2fe]">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center">
                <User className="w-5 h-5 text-[#0284c7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
