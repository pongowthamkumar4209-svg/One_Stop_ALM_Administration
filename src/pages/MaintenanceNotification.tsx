import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function MaintenanceNotification() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [project, setProject] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute('Maintenance Notification', () =>
      api.maintenance.notify({ fromDate, toDate, timeWindow, project, reason })
    );
  };

  return (
    <ModuleLayout title="Maintenance Notification" description="Send maintenance window notifications via Outlook">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To Date</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time Window</label>
              <input type="text" value={timeWindow} onChange={e => setTimeWindow(e.target.value)} placeholder="22:00 - 06:00"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</label>
            <input type="text" value={project} onChange={e => setProject(e.target.value)} placeholder="ALM_Production"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Scheduled database maintenance and server patching"
              rows={3}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
          </div>
        </div>
        <button type="submit" disabled={isRunning || !fromDate || !toDate || !reason}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isRunning ? 'SENDING...' : 'SEND NOTIFICATION'}
        </button>
      </form>
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}
