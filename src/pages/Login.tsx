import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Loader2, Shield, Server, ChevronDown } from 'lucide-react';

type Step = 'login' | 'connect';

export default function Login() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [serverUrl, setServerUrl] = useState('');
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [domains,   setDomains]   = useState<string[]>([]);
  const [projects,  setProjects]  = useState<string[]>([]);
  const [domain,    setDomain]    = useState('');
  const [project,   setProject]   = useState('');
  const [step,      setStep]      = useState<Step>('login');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [mode,      setMode]      = useState<'real' | 'demo'>('demo');

  // ── Step 1: Login ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login({ serverUrl, username, password });
      localStorage.setItem('alm_token', res.token);
      setMode(res.mode as 'real' | 'demo');
      const domRes = await api.auth.getDomains();
      setDomains(domRes.domains);
      if (domRes.domains.length > 0) {
        setDomain(domRes.domains[0]);
        const projRes = await api.auth.getProjects(domRes.domains[0]);
        setProjects(projRes.projects);
        if (projRes.projects.length > 0) setProject(projRes.projects[0]);
      }
      setStep('connect');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Domain change ─────────────────────────────────────────────────────────
  const handleDomainChange = async (d: string) => {
    setDomain(d);
    setProject('');
    setProjects([]);
    try {
      const res = await api.auth.getProjects(d);
      setProjects(res.projects);
      if (res.projects.length > 0) setProject(res.projects[0]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Step 2: Connect to project ────────────────────────────────────────────
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.connectProject({ domain, project });
      const token = localStorage.getItem('alm_token')!;
      login({ token, username, serverUrl, domain, project });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Demo Access — skip connectProject, go straight to dashboard ───────────
  const handleDemoAccess = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.login({
        serverUrl: 'https://alm.example.com',
        username:  'demo',
        password:  'demo123'
      });
      localStorage.setItem('alm_token', res.token);
      login({ token: res.token, username: res.username,
              serverUrl: 'https://alm.example.com', domain: 'DEFAULT', project: 'ALM_Demo' });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Demo access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ALM Operations Platform</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {step === 'login' ? 'Secure Authentication Required' : 'Select Domain & Project'}
          </p>
        </div>

        {step === 'connect' && (
          <div className={`text-center text-xs px-3 py-1 rounded-full border ${
            mode === 'real'
              ? 'border-green-500/30 text-green-400 bg-green-500/10'
              : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
          }`}>
            {mode === 'real' ? '🟢 Connected to Real ALM' : '🟡 Demo Mode'}
          </div>
        )}

        {error && (
          <div className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="ALM Server URL" value={serverUrl} onChange={setServerUrl}
              placeholder="https://alm.company.com/qcbin" type="text" icon={<Server className="h-3.5 w-3.5" />} />
            <Field label="Username" value={username} onChange={setUsername}
              placeholder="domain\\username" type="text" />
            <Field label="Password" value={password} onChange={setPassword}
              placeholder="••••••••" type="password" />

            <button type="submit" disabled={loading}
              className="w-full rounded bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING...' : 'CONNECT TO ALM'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <button type="button" onClick={handleDemoAccess} disabled={loading}
              className="w-full rounded border border-border py-2.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-50">
              DEMO ACCESS (Preview Mode)
            </button>
          </form>
        )}

        {step === 'connect' && (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ALM Domain</label>
              <div className="relative">
                <select value={domain} onChange={e => handleDomainChange(e.target.value)}
                  className="w-full appearance-none rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</label>
              <div className="relative">
                <select value={project} onChange={e => setProject(e.target.value)}
                  className="w-full appearance-none rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <button type="submit" disabled={loading || !domain || !project}
              className="w-full rounded bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING TO PROJECT...' : 'CONNECT TO PROJECT'}
            </button>

            <button type="button" onClick={() => { setStep('login'); setError(''); }}
              className="w-full text-xs text-muted-foreground hover:text-primary transition-colors py-1">
              ← Back to Login
            </button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          v2.0.0 — Enterprise ALM Automation Suite
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type, icon }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type: string; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-muted-foreground">{icon}</div>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded border border-border bg-background py-2 text-sm placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  );
}
