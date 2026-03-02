import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

const TEST_TYPES = ['MANUAL', 'AUTOMATED', 'PERFORMANCE', 'SECURITY', 'API', 'REGRESSION'];

export default function TestTypeUpdate() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [testCaseIds, setTestCaseIds] = useState('');
  const [newTestType, setNewTestType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute('Test Type Update', () =>
      api.update.testType({ testCaseIds, newTestType })
    );
  };

  return (
    <ModuleLayout title="Test Type Update" description="Bulk update test case types in ALM">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded border border-border bg-card p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Test Case IDs</label>
            <textarea
              value={testCaseIds} onChange={e => setTestCaseIds(e.target.value)}
              placeholder="Enter IDs separated by commas: 1001, 1002, 1003"
              rows={3}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Test Type</label>
            <div className="flex flex-wrap gap-1.5">
              {TEST_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setNewTestType(t)}
                  className={`rounded border px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                    newTestType === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" disabled={isRunning || !testCaseIds || !newTestType}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isRunning ? 'UPDATING...' : 'UPDATE TEST TYPES'}
        </button>
      </form>
      <ExecutionConsole logs={logs} isRunning={isRunning} onClear={clearLogs} />
    </ModuleLayout>
  );
}
