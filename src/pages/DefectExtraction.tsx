import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Open', 'Fixed', 'Closed', 'Reopen', 'Rejected', 'Deferred'];
const PRIORITY_OPTIONS = ['1-Low', '2-Medium', '3-High', '4-Very High', '5-Urgent'];
const SEVERITY_OPTIONS = ['1-Low', '2-Medium', '3-High', '4-Very High', '5-Urgent'];

export default function DefectExtraction() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [statusList, setStatusList] = useState<string[]>([]);
  const [priority, setPriority] = useState('');
  const [severity, setSeverity] = useState('');
  const [category, setCategory] = useState('');

  const toggleStatus = (s: string) => {
    setStatusList(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute('Defect Extraction', () =>
      api.extract.defects({ statusList, priority, severity, category })
    );
  };

  return (
    <ModuleLayout title="Defect Extraction" description="Extract defects from ALM with filtering options">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Filter</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s} type="button" onClick={() => toggleStatus(s)}
                  className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusList.includes(s) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SelectField label="Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
            <SelectField label="Severity" value={severity} onChange={setSeverity} options={SEVERITY_OPTIONS} />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
              <input
                type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Functional"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isRunning}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isRunning ? 'EXTRACTING...' : 'EXTRACT DEFECTS'}
        </button>
      </form>

      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
