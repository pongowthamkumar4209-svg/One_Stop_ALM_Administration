import { useAuth } from '@/contexts/AuthContext';
import { StatusIndicator } from '@/components/StatusIndicator';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import {
  Activity, Clock, AlertTriangle, Server,
  FileSearch, Bug, RefreshCw, FileCheck, Download, UserPlus, Bell
} from 'lucide-react';

const mockHistory = [
  { id: '1', module: 'Test Extraction', status: 'success' as const, time: '2 min ago' },
  { id: '2', module: 'Defect Extraction', status: 'success' as const, time: '15 min ago' },
  { id: '3', module: 'Evidence Generator', status: 'failed' as const, time: '1 hour ago' },
  { id: '4', module: 'Test Type Update', status: 'success' as const, time: '3 hours ago' },
  { id: '5', module: 'Attachment Download', status: 'success' as const, time: '5 hours ago' },
];

const moduleIcons: Record<string, typeof Activity> = {
  'Test Extraction': FileSearch,
  'Defect Extraction': Bug,
  'Evidence Generator': FileCheck,
  'Test Type Update': RefreshCw,
  'Attachment Download': Download,
  'Access Provider': UserPlus,
  'Maintenance': Bell,
};

export default function Dashboard() {
  const { session } = useAuth();
  const { logs, isRunning, clearLogs } = useExecutionConsole();

  const stats = [
    { label: 'CONNECTION', value: session?.serverUrl || '—', icon: Server, status: 'connected' as const },
    { label: 'ACTIVE USER', value: session?.username || '—', icon: Activity },
    { label: 'ACTIVE PROJECT', value: session?.project || 'ALM_Demo', icon: Activity },
    { label: 'LAST EXECUTION', value: '2 min ago', icon: Clock },
    { label: 'ERRORS (24H)', value: '3', icon: AlertTriangle, highlight: true },
  ];

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Operations Dashboard</h1>
          <p className="text-xs text-muted-foreground font-mono">SYSTEM OVERVIEW — REAL-TIME MONITORING</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator status="healthy" label="System Health" size="md" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <stat.icon className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className={`text-sm font-mono font-semibold truncate ${stat.highlight ? 'text-warning' : ''}`}>
              {stat.value}
            </div>
            {stat.status && <StatusIndicator status={stat.status} />}
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-3">
        {/* Execution History */}
        <div className="col-span-2 rounded border border-border bg-card">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Execution History
            </span>
          </div>
          <div className="divide-y divide-border">
            {mockHistory.map(entry => {
              const Icon = moduleIcons[entry.module] || Activity;
              return (
                <div key={entry.id} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{entry.module}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground font-mono">{entry.time}</span>
                    <StatusIndicator status={entry.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded border border-border bg-card">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </span>
          </div>
          <div className="p-2 space-y-1">
            {[
              { label: 'Extract Tests', icon: FileSearch, path: '/test-extraction' },
              { label: 'Extract Defects', icon: Bug, path: '/defect-extraction' },
              { label: 'Generate Evidence', icon: FileCheck, path: '/evidence-generator' },
              { label: 'Download Attachments', icon: Download, path: '/attachment-downloader' },
            ].map(action => (
              <a
                key={action.path}
                href={action.path}
                className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Console */}
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </div>
  );
}
