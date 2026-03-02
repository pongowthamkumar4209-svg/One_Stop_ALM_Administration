import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Loader2, Shield, Server, ChevronDown, WifiOff, Wifi } from 'lucide-react';

type Step = 'login' | 'connect';

const DEMO_DOMAINS = ['DEFAULT', 'CN_DOMAIN', 'QA_DOMAIN'];
const DEMO_PROJECTS: Record<string, string[]> = {
  DEFAULT:   ['Mercury_Release_v4', 'Mercury_Release_v3'],
  CN_DOMAIN: ['CN_Rail_Main', 'CN_Rail_QA'],
  QA_DOMAIN: ['QA_Project_1', 'QA_Project_2'],
};

function isOfflineError(msg: string) {
  return msg === 'TIMEOUT' || msg === 'UNREACHABLE' || msg.includes('timed out') || msg.includes('Failed to fetch');
}

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

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
  const [mode,      setMode]      = useState<'real' | 'demo' | 'offline'>('demo');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => setBackendOnline(r.ok))
      .catch(() => setBackendOnline(false));
  }, []);

  const goOfflineDemo = (u = 'demo') => {
    const token = 'offline-demo-' + Date.now();
    login({ token, username: u || 'demo', serverUrl: serverUrl || 'demo', domain: 'DEFAULT', project: 'ALM_Demo' });
    navigate('/');
  };

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
      if (isOfflineError(err.message)) {
        // Backend offline — silently fall through to demo connect step
        setMode('offline');
        setDomains(DEMO_DOMAINS);
        setDomain(DEMO_DOMAINS[0]);
        setProjects(DEMO_PROJECTS[DEMO_DOMAINS[0]]);
        setProject(DEMO_PROJECTS[DEMO_DOMAINS[0]][0]);
        setStep('connect');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = async (d: string) => {
    setDomain(d);
    setProject('');
    if (mode === 'offline') {
      const p = DEMO_PROJECTS[d] || ['Default_Project'];
      setProjects(p);
      setProject(p[0]);
      return;
    }
    try {
      const res = await api.auth.getProjects(d);
      setProjects(res.projects);
      if (res.projects.length > 0) setProject(res.projects[0]);
    } catch (err: any) {
      if (isOfflineError(err.message)) {
        const p = DEMO_PROJECTS[d] || ['Default_Project'];
        setProjects(p);
        setProject(p[0]);
      } else {
        setError(err.message);
      }
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'offline') {
        login({ token: 'offline-demo-' + Date.now(), username: username || 'demo', serverUrl: serverUrl || 'demo', domain, project });
        navigate('/');
        return;
      }
      await api.auth.connectProject({ domain, project });
      login({ token: localStorage.getItem('alm_token')!, username, serverUrl, domain, project });
      navigate('/');
    } catch (err: any) {
      if (isOfflineError(err.message)) {
        login({ token: 'offline-demo-' + Date.now(), username: username || 'demo', serverUrl: serverUrl || 'demo', domain, project });
        navigate('/');
      } else {
        setError(err.message || 'Connection failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(180,0,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(140,0,0,0.08) 0%, transparent 45%), #0d0d0d' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative z-10">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border"
            style={{ background: 'rgba(200,0,0,0.15)', borderColor: 'rgba(200,0,0,0.35)', boxShadow: '0 0 24px rgba(200,0,0,0.2)' }}>
            <Shield className="h-7 w-7" style={{ color: '#e03030' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#f0f0f0' }}>ALM Operations Platform</h1>
            <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#888' }}>
              {step === 'login' ? 'Secure Authentication Required' : 'Select Domain & Project'}
            </p>
          </div>
        </div>

        {/* Backend status */}
        {step === 'login' && backendOnline !== null && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono"
              style={{
                background: backendOnline ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
                border: backendOnline ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(251,191,36,0.25)',
                color: backendOnline ? '#4ade80' : '#fbbf24',
              }}>
              {backendOnline
                ? <><Wifi className="h-3 w-3" /> Backend Online — Live &amp; Demo available</>
                : <><WifiOff className="h-3 w-3" /> Backend Offline — Demo mode only</>}
            </div>
          </div>
        )}

        {/* Mode badge on connect step */}
        {step === 'connect' && (
          <div className={`text-center text-xs px-3 py-1 rounded-full border ${
            mode === 'real' ? 'border-green-500/30 text-green-400 bg-green-500/10'
                           : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
            {mode === 'real' ? '🟢 Connected to Real ALM' : '🟡 Demo Mode — Simulated Data'}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded border px-3 py-2 text-xs"
            style={{ borderColor: 'rgba(200,0,0,0.4)', background: 'rgba(200,0,0,0.1)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="ALM Server URL" value={serverUrl} onChange={setServerUrl}
              placeholder="https://alm.company.com/qcbin" type="text"
              icon={<Server className="h-3.5 w-3.5" />} />
            <Field label="Username" value={username} onChange={setUsername} placeholder="domain\\username" type="text" />
            <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />

            <button type="submit" disabled={loading}
              className="w-full rounded py-2.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #cc0000, #990000)', color: '#fff', boxShadow: loading ? 'none' : '0 0 18px rgba(200,0,0,0.35)' }}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING...' : 'CONNECT TO ALM'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#2a2a2a' }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-xs" style={{ background: '#0d0d0d', color: '#555' }}>or</span>
              </div>
            </div>

            <button type="button" onClick={() => goOfflineDemo('demo')} disabled={loading}
              className="w-full rounded py-2.5 text-xs font-medium transition-colors disabled:opacity-50"
              style={{ border: '1px solid #2a2a2a', color: '#888', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,0,0,0.4)'; (e.currentTarget as HTMLElement).style.color = '#e03030'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.color = '#888'; }}>
              DEMO ACCESS (Preview Mode)
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 'connect' && (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>ALM Domain</label>
              <div className="relative">
                <select value={domain} onChange={e => handleDomainChange(e.target.value)}
                  className="w-full appearance-none rounded px-3 py-2 text-sm focus:outline-none"
                  style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0' }}>
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: '#555' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>Project</label>
              <div className="relative">
                <select value={project} onChange={e => setProject(e.target.value)}
                  className="w-full appearance-none rounded px-3 py-2 text-sm focus:outline-none"
                  style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0' }}>
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: '#555' }} />
              </div>
            </div>

            <button type="submit" disabled={loading || !domain || !project}
              className="w-full rounded py-2.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #cc0000, #990000)', color: '#fff', boxShadow: '0 0 18px rgba(200,0,0,0.35)' }}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? 'CONNECTING TO PROJECT...' : 'CONNECT TO PROJECT'}
            </button>

            <button type="button" onClick={() => { setStep('login'); setError(''); }}
              className="w-full text-xs py-1 transition-colors"
              style={{ color: '#666', background: 'none', border: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e03030')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666')}>
              ← Back to Login
            </button>
          </form>
        )}

        <p className="text-center text-xs" style={{ color: '#444' }}>v2.0.0 — Enterprise ALM Automation Suite</p>

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

function Field({ label, value, onChange, placeholder, type, icon }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type: string; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5" style={{ color: '#555' }}>{icon}</div>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded py-2 text-sm focus:outline-none transition-colors"
          style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', paddingLeft: icon ? '2.25rem' : '0.75rem', paddingRight: '0.75rem' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(200,0,0,0.5)')}
          onBlur={e  => (e.target.style.borderColor = '#2a2a2a')} />
      </div>
    </div>
  );
}
