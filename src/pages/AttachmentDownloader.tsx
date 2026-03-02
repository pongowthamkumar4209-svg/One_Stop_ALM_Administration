import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Download } from 'lucide-react';

export default function AttachmentDownloader() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [testSetIds, setTestSetIds] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute('Attachment Download', () =>
      api.download.attachments({ testSetIds })
    );
    if (result && typeof result === 'object' && 'downloadUrl' in result) {
      setDownloadUrl(result.downloadUrl as string);
    }
  };

  return (
    <ModuleLayout title="Attachment Downloader" description="Bulk download test attachments from ALM as zip archives">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Test Set IDs</label>
            <textarea
              value={testSetIds} onChange={e => setTestSetIds(e.target.value)}
              placeholder="Enter Test Set IDs separated by commas: 101, 102, 103"
              rows={3}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isRunning || !testSetIds}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isRunning ? 'DOWNLOADING...' : 'DOWNLOAD ATTACHMENTS'}
          </button>
          {downloadUrl && (
            <a href={downloadUrl} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
              <Download className="h-3.5 w-3.5" /> Download ZIP
            </a>
          )}
        </div>
      </form>
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}
