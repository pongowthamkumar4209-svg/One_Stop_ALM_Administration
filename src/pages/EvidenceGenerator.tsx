import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Download } from 'lucide-react';

export default function EvidenceGenerator() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [domain, setDomain] = useState('');
  const [project, setProject] = useState('');
  const [inputFile, setInputFile] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute('Evidence Generator', () =>
      api.generate.evidence({ domain, project, inputFile })
    );
    if (result && typeof result === 'object' && 'downloadUrl' in result) {
      setDownloadUrl(result.downloadUrl as string);
    }
  };

  return (
    <ModuleLayout title="Evidence Generator" description="Generate test execution evidence Word documents from ALM test data">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ALM Domain" value={domain} onChange={setDomain} placeholder="DEFAULT" />
            <Field label="Project" value={project} onChange={setProject} placeholder="Mercury_Release_v4" />
          </div>
          <Field
            label="Input Excel File Path"
            value={inputFile}
            onChange={setInputFile}
            placeholder="C:\Users\nara\Desktop\TestInput.xlsx"
          />
          <p className="text-xs text-muted-foreground">
            📄 The Excel file should contain test case IDs (TS_TEST_ID) in column 10 and tester names in column 5.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isRunning || !inputFile}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
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

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
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
