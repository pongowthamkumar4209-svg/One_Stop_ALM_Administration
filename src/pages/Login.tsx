import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Shield, Server, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login({ serverUrl, username, password });
      login({ token: res.token, username: res.username, serverUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo login for preview purposes
  const handleDemoLogin = () => {
    login({
      token: 'demo-token',
      username: 'admin',
      serverUrl: 'https://alm.example.com',
      domain: 'DEFAULT',
      project: 'ALM_Demo',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid-pattern">
      <div className="w-full max-w-sm space-y-6 p-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded border border-border bg-card glow-primary">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ALM Operations Platform</h1>
          <p className="text-xs text-muted-foreground font-mono">SECURE AUTHENTICATION REQUIRED</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ALM Server URL</label>
            <div className="relative">
              <Server className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="url"
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                placeholder="https://alm.company.com"
                className="w-full rounded border border-border bg-card py-2 pl-8 pr-3 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="domain\\username"
              className="w-full rounded border border-border bg-card px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-border bg-card px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {error && (
            <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono">
              ✖ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'ESTABLISHING CONNECTION...' : 'CONNECT TO ALM'}
          </button>
        </form>

        {/* Demo Access */}
        <div className="border-t border-border pt-4">
          <button
            onClick={handleDemoLogin}
            className="w-full rounded border border-border bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            DEMO ACCESS (Preview Mode)
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground/60">
            v2.0.0 — Enterprise ALM Automation Suite
          </p>
        </div>
      </div>
    </div>
  );
}
