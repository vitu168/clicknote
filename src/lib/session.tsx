'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { bootstrapAuthToken, customAuth, type AuthUser } from '@/lib/customAuth';
import { userProfileService } from '@/lib/services/userProfileService';
import type { UserProfile } from '@/lib/types';

interface SessionContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, name: string) => Promise<AuthUser>;
  forgotPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: AuthUser) => {
    try {
      const p = await userProfileService.ensureProfile({
        id: u.userId,
        email: u.email,
        name: u.name ?? undefined,
      });
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    bootstrapAuthToken();
    const current = customAuth.getCurrentUser();
    setUser(current);
    if (current) loadProfile(current);
    setLoading(false);

    return customAuth.onChange(() => {
      const next = customAuth.getCurrentUser();
      setUser(next);
      if (next) loadProfile(next);
      else setProfile(null);
    });
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await customAuth.signIn(email, password);
    setUser(u);
    await loadProfile(u);
    return u;
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const u = await customAuth.signUp(email, password, name);
    setUser(u);
    await loadProfile(u);
    return u;
  }, [loadProfile]);

  const forgotPassword = useCallback(async (email: string) => {
    await customAuth.forgotPassword(email);
  }, []);

  const signOut = useCallback(async () => {
    await customAuth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  return (
    <SessionContext.Provider
      value={{ user, profile, loading, signIn, signUp, forgotPassword, signOut, refreshProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
