"use client";

import { signOut, useSession } from "next-auth/react";

export interface AuthUser {
  id: string;
  username: string;
  email?: string | null;
  fullName?: string | null;
  name?: string | null;
  image?: string | null;
}

export interface NextAuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export function useNextAuth(): NextAuthState {
  const { data: session, status } = useSession();

  const rawUser = session?.user as Record<string, unknown> | undefined;

  const user: AuthUser | null = rawUser
    ? {
        id: (rawUser.id as string) ?? "",
        username:
          (rawUser.username as string) ?? (rawUser.name as string) ?? "",
        email: (rawUser.email as string | null | undefined) ?? null,
        fullName: (rawUser.fullName as string | null | undefined) ?? null,
        name: (rawUser.name as string | null | undefined) ?? null,
        image: (rawUser.image as string | null | undefined) ?? null,
      }
    : null;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout: () => signOut({ callbackUrl: "/login" }),
  };
}
