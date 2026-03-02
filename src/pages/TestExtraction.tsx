import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Download } from 'lucide-react';

export default function TestExtraction() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [domain, setDomain] = useState('');
  const [project, setProject] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [source, setSource] = useState<'test_plan' | 'test_set'>('test_plan');
  const [testSetIds, setTestSetIds] = useState('');
  const [withAttachments, setWithAttachments] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute('Test Extraction', () =>
      api.extract.tests({ domain, project, folderPath, source, testSetIds, withAttachments })
    );
    if (result && typeof result === 'object' && 'downloadUrl' in result) {
      setDownloadUrl(result.downloadUrl as string);
    }
  };

  return (
    <ModuleLayout title="Test Extraction" description="Extract test cases from ALM Test Plan or Test Set folders">
      <div className="grid grid-cols-3 gap-3">
        <form onSubmit={handleSubmit} className="col-span-2 space-y-3">
          <div className="rounded border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Domain" value={domain} onChange={setDomain} placeholder="DEFAULT" />
              <Field label="Project" value={project} onChange={setProject} placeholder="MyProject" />
            </div>
            <Field label="Folder Path" value={folderPath} onChange={setFolderPath} placeholder="Subject\\Module1\\Tests" />
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</label>
              <div className="flex gap-3">
                {(['test_plan', 'test_set'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                      source === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {s === 'test_plan' ? 'Test Plan' : 'Test Set'}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Test Set IDs" value={testSetIds} onChange={setTestSetIds} placeholder="123, 456, 789" />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="attachments"
                checked={withAttachments}
                onChange={e => setWithAttachments(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <label htmlFor="attachments" className="text-xs text-muted-foreground">Include Attachments</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isRunning ? 'EXTRACTING...' : 'EXECUTE EXTRACTION'}
          </button>
        </form>

        <div className="space-y-3">
          {downloadUrl && (
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <a href={downloadUrl} className="flex items-center gap-2 text-xs text-primary font-medium hover:underline">
                <Download className="h-3.5 w-3.5" /> Download Results
              </a>
            </div>
          )}
        </div>
      </div>

      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  );
}
