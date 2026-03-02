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
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold tracking-tight" style={{ color: '#f0f0f0' }}>
            Operations Dashboard
          </h1>
          <p className="text-[10px] font-mono" style={{ color: '#555' }}>
            SYSTEM OVERVIEW — REAL-TIME MONITORING
          </p>
        </div>
        <StatusIndicator status="healthy" label="System Health" size="md" />
      </div>

      {/* Stats Grid — 2 cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded p-3 space-y-1"
            style={{
              background: '#111',
              border: '1px solid #222',
              borderTop: stat.highlight ? '1px solid rgba(200,0,0,0.4)' : '1px solid #222',
            }}
          >
            <div className="flex items-center gap-1.5" style={{ color: '#666' }}>
              <stat.icon className="h-3 w-3 shrink-0" />
              <span className="text-[9px] font-medium uppercase tracking-wider leading-tight">{stat.label}</span>
            </div>
            <div
              className="text-xs font-mono font-semibold truncate"
              style={{ color: stat.highlight ? '#f87171' : '#e0e0e0' }}
            >
              {stat.value}
            </div>
            {stat.status && <StatusIndicator status={stat.status} />}
          </div>
        ))}
      </div>

      {/* Execution History + Quick Actions — stacked on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Execution History */}
        <div className="md:col-span-2 rounded" style={{ background: '#111', border: '1px solid #222' }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#666' }}>
              Execution History
            </span>
          </div>
          <div>
            {mockHistory.map((entry, i) => {
              const Icon = moduleIcons[entry.module] || Activity;
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{ borderTop: i > 0 ? '1px solid #1a1a1a' : 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: '#555' }} />
                    <span className="text-xs font-medium" style={{ color: '#d0d0d0' }}>{entry.module}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono" style={{ color: '#555' }}>{entry.time}</span>
                    <StatusIndicator status={entry.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded" style={{ background: '#111', border: '1px solid #222' }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#666' }}>
              Quick Actions
            </span>
          </div>
          {/* 2-col grid on mobile, single col on desktop */}
          <div className="p-2 grid grid-cols-2 md:grid-cols-1 gap-1">
            {[
              { label: 'Extract Tests', icon: FileSearch, path: '/test-extraction' },
              { label: 'Extract Defects', icon: Bug, path: '/defect-extraction' },
              { label: 'Generate Evidence', icon: FileCheck, path: '/evidence-generator' },
              { label: 'Download Attachments', icon: Download, path: '/attachment-downloader' },
            ].map(action => (
              <a
                key={action.path}
                href={action.path}
                className="flex items-center gap-2 rounded px-2.5 py-2 text-xs transition-colors"
                style={{ color: '#777' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(200,0,0,0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#e03030';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#777';
                }}
              >
                <action.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="leading-tight">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Console */}
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />

      {/* Watermark */}
      <div className="text-center pt-1">
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(200,0,0,0.35)' }}>
          ⚡ Owned &amp; Built by{' '}
          <span style={{ color: 'rgba(220,0,0,0.6)', fontWeight: 700 }}>Pongowtham</span>
        </p>
      </div>
    </div>
  );
}
