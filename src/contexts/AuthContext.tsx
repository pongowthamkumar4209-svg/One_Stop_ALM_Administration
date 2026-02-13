import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthSession } from '@/types/alm';

interface AuthContextType {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = localStorage.getItem('alm_session');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((newSession: AuthSession) => {
    localStorage.setItem('alm_session', JSON.stringify(newSession));
    localStorage.setItem('alm_token', newSession.token);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('alm_session');
    localStorage.removeItem('alm_token');
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
