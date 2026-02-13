import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Download } from 'lucide-react';

export default function EvidenceGenerator() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [testSetId, setTestSetId] = useState('');
  const [runId, setRunId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute('Evidence Generator', () =>
      api.generate.evidence({ testSetId, runId })
    );
    if (result && typeof result === 'object' && 'downloadUrl' in result) {
      setDownloadUrl(result.downloadUrl as string);
    }
  };

  return (
    <ModuleLayout title="Evidence Generator" description="Generate test execution evidence packages from ALM run data">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Test Set ID</label>
              <input type="text" value={testSetId} onChange={e => setTestSetId(e.target.value)} placeholder="12345"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Run ID</label>
              <input type="text" value={runId} onChange={e => setRunId(e.target.value)} placeholder="67890"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isRunning || !testSetId || !runId}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isRunning ? 'GENERATING...' : 'GENERATE EVIDENCE'}
          </button>
          {downloadUrl && (
            <a href={downloadUrl} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Download className="h-3.5 w-3.5" /> Download Package
            </a>
          )}
        </div>
      </form>
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}
