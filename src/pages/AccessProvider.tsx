import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Plus, X } from 'lucide-react';

const AVAILABLE_GROUPS = ['QA-Team', 'Dev-Team', 'BA-Team', 'PM-Team', 'Admin', 'Viewer', 'Release-Manager'];

export default function AccessProvider() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [groups, setGroups] = useState<string[]>([]);

  const toggleGroup = (g: string) => {
    setGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute('Access Provision', () =>
      api.user.provision({ username, email, groups })
    );
  };

  return (
    <ModuleLayout title="Access Provider" description="Provision user access to ALM sites and projects">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="jsmith"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jsmith@company.com"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Groups</label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_GROUPS.map(g => (
                <button key={g} type="button" onClick={() => toggleGroup(g)}
                  className={`flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    groups.includes(g) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}>
                  {groups.includes(g) ? <X className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" disabled={isRunning || !username || !email}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isRunning ? 'PROVISIONING...' : 'PROVISION ACCESS'}
        </button>
      </form>
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}
