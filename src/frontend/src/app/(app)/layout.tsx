"use client";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const NAV_TABS = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <title>Home</title>
        <path d="M3 12L12 3l9 9" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/reminders",
    label: "Reminders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <title>Reminders</title>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <title>Search</title>
        <circle cx={11} cy={11} r={8} />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <title>History</title>
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <title>Profile</title>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx={12} cy={7} r={4} />
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const user = session?.user as
    | { name?: string; username?: string; email?: string; image?: string }
    | undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4.5 h-4.5 text-primary-foreground"
              >
                <title>Pill</title>
                <ellipse
                  cx={12}
                  cy={12}
                  rx={9}
                  ry={4.5}
                  transform="rotate(45 12 12)"
                />
                <line x1="4.8" y1="4.8" x2="19.2" y2="19.2" />
              </svg>
            </div>
            <span className="font-bold text-base text-foreground">
              MediRemind
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline indicator */}
            {!isOnline && (
              <div
                data-ocid="app.offline_indicator"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium"
                title="You are offline"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3 shrink-0"
                  aria-hidden="true"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
                <span>Offline</span>
              </div>
            )}
            {/* Notification active dot */}
            <div
              data-ocid="app.notif_status"
              className="w-2 h-2 rounded-full bg-success notif-pulse"
              title="Notification monitoring active"
            />
            <DarkModeToggle />
            <UserAvatar
              name={user?.name ?? user?.username ?? "U"}
              photoUrl={user?.image}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom tab navigation */}
      <nav
        data-ocid="app.tab_nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border"
      >
        <div className="max-w-2xl mx-auto flex">
          {NAV_TABS.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                data-ocid={`app.nav.${tab.label.toLowerCase()}_tab`}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
