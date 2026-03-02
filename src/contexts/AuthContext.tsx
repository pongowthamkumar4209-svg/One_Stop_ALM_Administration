import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthSession } from '@/types/alm';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface AuthContextType {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isValidating: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  // On mount — validate stored token against the backend
  useEffect(() => {
    const validateSession = async () => {
      const storedSession = localStorage.getItem('alm_session');
      const storedToken   = localStorage.getItem('alm_token');

      if (!storedSession || !storedToken) {
        // Nothing stored — clean start
        setIsValidating(false);
        return;
      }

      try {
        // Ping the backend health endpoint first (fast, no auth needed)
        const healthRes = await fetch(`${API_BASE.replace('/api', '')}/api/health`, {
          signal: AbortSignal.timeout(3000),
        });

        if (!healthRes.ok) {
          throw new Error('Backend not reachable');
        }

        // Backend is up — now validate the actual token
        const domainRes = await fetch(`${API_BASE}/auth/domains`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          signal: AbortSignal.timeout(3000),
        });

        if (domainRes.ok) {
          // Token is still valid — restore session
          setSession(JSON.parse(storedSession));
        } else {
          // Token rejected by backend — clear it
          clearStorage();
        }
      } catch {
        // Backend offline or timeout — clear stale session so user isn't stuck
        clearStorage();
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  const clearStorage = () => {
    localStorage.removeItem('alm_session');
    localStorage.removeItem('alm_token');
  };

  const login = useCallback((newSession: AuthSession) => {
    localStorage.setItem('alm_session', JSON.stringify(newSession));
    localStorage.setItem('alm_token', newSession.token);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setSession(null);
  }, []);

  // Show nothing while validating to avoid flash of wrong page
  if (isValidating) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(200,0,0,0.2)',
            borderTop: '2px solid #cc0000',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p
          style={{
            color: '#444',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, isValidating, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
