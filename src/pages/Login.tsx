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

  // ── Demo Access ───────────────────────────────────────────────────────────
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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(180,0,0,0.12) 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 80% 20%, rgba(140,0,0,0.08) 0%, transparent 45%), #0d0d0d',
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Red glow top-left */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,0,0,0.08) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      {/* Red glow bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180,0,0,0.07) 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />

      <div className="w-full max-w-sm space-y-6 relative z-10">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl border"
            style={{
              background: 'rgba(200,0,0,0.15)',
              borderColor: 'rgba(200,0,0,0.35)',
              boxShadow: '0 0 24px rgba(200,0,0,0.2)',
            }}
          >
            <Shield className="h-7 w-7" style={{ color: '#e03030' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#f0f0f0' }}>
              ALM Operations Platform
            </h1>
            <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#888' }}>
              {step === 'login' ? 'Secure Authentication Required' : 'Select Domain & Project'}
            </p>
          </div>
        </div>

        {/* Mode badge */}
        {step === 'connect' && (
          <div
            className={`text-center text-xs px-3 py-1 rounded-full border ${
              mode === 'real'
                ? 'border-green-500/30 text-green-400 bg-green-500/10'
                : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
            }`}
          >
            {mode === 'real' ? '🟢 Connected to Real ALM' : '🟡 Demo Mode'}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded border px-3 py-2 text-xs"
            style={{ borderColor: 'rgba(200,0,0,0.4)', background: 'rgba(200,0,0,0.1)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {/* ── STEP 1: Login Form ── */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field
              label="ALM Server URL" value={serverUrl} onChange={setServerUrl}
              placeholder="https://alm.company.com/qcbin" type="text"
              icon={<Server className="h-3.5 w-3.5" />}
            />
            <Field label="Username" value={username} onChange={setUsername}
              placeholder="domain\\username" type="text" />
            <Field label="Password" value={password} onChange={setPassword}
              placeholder="••••••••" type="password" />

            <button
              type="submit" disabled={loading}
              className="w-full rounded py-2.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #cc0000, #990000)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 0 18px rgba(200,0,0,0.35)',
              }}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING...' : 'CONNECT TO ALM'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#2a2a2a' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 text-xs" style={{ background: '#0d0d0d', color: '#555' }}>or</span>
              </div>
            </div>

            <button
              type="button" onClick={handleDemoAccess} disabled={loading}
              className="w-full rounded py-2.5 text-xs font-medium transition-colors disabled:opacity-50"
              style={{ border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,0,0,0.4)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e03030';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
                (e.currentTarget as HTMLButtonElement).style.color = '#888';
              }}
            >
              DEMO ACCESS (Preview Mode)
            </button>
          </form>
        )}

        {/* ── STEP 2: Domain / Project Connect ── */}
        {step === 'connect' && (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>
                ALM Domain
              </label>
              <div className="relative">
                <select
                  value={domain} onChange={e => handleDomainChange(e.target.value)}
                  className="w-full appearance-none rounded px-3 py-2 text-sm focus:outline-none"
                  style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0' }}
                >
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: '#555' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>
                Project
              </label>
              <div className="relative">
                <select
                  value={project} onChange={e => setProject(e.target.value)}
                  className="w-full appearance-none rounded px-3 py-2 text-sm focus:outline-none"
                  style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0' }}
                >
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: '#555' }} />
              </div>
            </div>

            <button
              type="submit" disabled={loading || !domain || !project}
              className="w-full rounded py-2.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #cc0000, #990000)',
                color: '#fff',
                boxShadow: '0 0 18px rgba(200,0,0,0.35)',
              }}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING TO PROJECT...' : 'CONNECT TO PROJECT'}
            </button>

            <button
              type="button" onClick={() => { setStep('login'); setError(''); }}
              className="w-full text-xs py-1 transition-colors"
              style={{ color: '#666', background: 'none', border: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e03030')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666')}
            >
              ← Back to Login
            </button>
          </form>
        )}

        <p className="text-center text-xs" style={{ color: '#444' }}>
          v2.0.0 — Enterprise ALM Automation Suite
        </p>

        {/* ✅ WATERMARK */}
        <div className="text-center pt-2 border-t" style={{ borderColor: 'rgba(200,0,0,0.15)' }}>
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(200,0,0,0.5)' }}>
            ⚡ Owned &amp; Built by{' '}
            <span style={{ color: 'rgba(220,0,0,0.8)', fontWeight: 700 }}>Pongowtham</span>
          </p>
        </div>

      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type, icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type: string; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5" style={{ color: '#555' }}>{icon}</div>
        )}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded py-2 text-sm focus:outline-none transition-colors"
          style={{
            background: '#111',
            border: '1px solid #2a2a2a',
            color: '#f0f0f0',
            paddingLeft: icon ? '2.25rem' : '0.75rem',
            paddingRight: '0.75rem',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
          onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>
    </div>
  );
}
