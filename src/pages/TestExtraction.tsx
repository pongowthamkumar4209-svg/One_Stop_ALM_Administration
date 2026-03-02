import { useState } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { useExecutionConsole } from '@/hooks/useExecutionConsole';
import { api } from '@/services/api';
import { Loader2, Download } from 'lucide-react';

export default function TestExtraction() {
  const { logs, isRunning, clearLogs, execute } = useExecutionConsole();
  const [folderPath, setFolderPath] = useState('');
  const [source, setSource] = useState<'test_plan' | 'test_set'>('test_plan');
  const [testSetIds, setTestSetIds] = useState('');
  const [withAttachments, setWithAttachments] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute('Test Extraction', () =>
      api.extract.tests({ domain: '', project: '', folderPath, source, testSetIds, withAttachments })
    );
    if (result && typeof result === 'object' && 'downloadUrl' in result) {
      setDownloadUrl(result.downloadUrl as string);
    }
  };

  const isTestPlan = source === 'test_plan';
  const isTestSet  = source === 'test_set';

  return (
    <ModuleLayout title="Test Extraction" description="Extract test cases from ALM Test Plan or Test Set folders">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-3">
          <div className="rounded p-4 space-y-4" style={{ background: '#111', border: '1px solid #222' }}>

            {/* Source toggle — put first so user picks before filling fields */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888' }}>
                Source
              </label>
              <div className="flex gap-2">
                {(['test_plan', 'test_set'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className="rounded px-4 py-1.5 text-xs font-medium transition-all"
                    style={{
                      border: source === s ? '1px solid rgba(200,0,0,0.6)' : '1px solid #2a2a2a',
                      background: source === s ? 'rgba(200,0,0,0.15)' : 'transparent',
                      color: source === s ? '#e03030' : '#777',
                      boxShadow: source === s ? '0 0 10px rgba(200,0,0,0.15)' : 'none',
                    }}
                  >
                    {s === 'test_plan' ? 'Test Plan' : 'Test Set'}
                  </button>
                ))}
              </div>
            </div>

            {/* Folder Path — disabled when Test Set is selected */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: isTestSet ? '#444' : '#888' }}
              >
                Folder Path
                {isTestSet && (
                  <span className="ml-2 normal-case" style={{ color: '#555', fontWeight: 400 }}>
                    (only for Test Plan)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={folderPath}
                onChange={e => setFolderPath(e.target.value)}
                placeholder="Subject\\Module1\\Tests"
                disabled={isTestSet}
                className="w-full rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors"
                style={{
                  background: isTestSet ? '#0a0a0a' : '#0d0d0d',
                  border: '1px solid #2a2a2a',
                  color: isTestSet ? '#444' : '#f0f0f0',
                  cursor: isTestSet ? 'not-allowed' : 'text',
                  opacity: isTestSet ? 0.5 : 1,
                }}
                onFocus={e => { if (!isTestSet) e.target.style.borderColor = 'rgba(200,0,0,0.5)'; }}
                onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>

            {/* Test Set IDs — disabled when Test Plan is selected */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: isTestPlan ? '#444' : '#888' }}
              >
                Test Set IDs
                {isTestPlan && (
                  <span className="ml-2 normal-case" style={{ color: '#555', fontWeight: 400 }}>
                    (only for Test Set)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={testSetIds}
                onChange={e => setTestSetIds(e.target.value)}
                placeholder="123, 456, 789"
                disabled={isTestPlan}
                className="w-full rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors"
                style={{
                  background: isTestPlan ? '#0a0a0a' : '#0d0d0d',
                  border: '1px solid #2a2a2a',
                  color: isTestPlan ? '#444' : '#f0f0f0',
                  cursor: isTestPlan ? 'not-allowed' : 'text',
                  opacity: isTestPlan ? 0.5 : 1,
                }}
                onFocus={e => { if (!isTestPlan) e.target.style.borderColor = 'rgba(200,0,0,0.5)'; }}
                onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>

            {/* Include Attachments */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="attachments"
                checked={withAttachments}
                onChange={e => setWithAttachments(e.target.checked)}
                className="rounded"
                style={{ accentColor: '#cc0000' }}
              />
              <label htmlFor="attachments" className="text-xs" style={{ color: '#888' }}>
                Include Attachments
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isRunning}
            className="flex items-center gap-2 rounded px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #cc0000, #990000)',
              color: '#fff',
              boxShadow: isRunning ? 'none' : '0 0 16px rgba(200,0,0,0.35)',
            }}
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isRunning ? 'EXTRACTING...' : 'EXECUTE EXTRACTION'}
          </button>
        </form>

        {/* Download */}
        <div className="space-y-3">
          {downloadUrl && (
            <div className="rounded p-3" style={{ background: 'rgba(200,0,0,0.08)', border: '1px solid rgba(200,0,0,0.25)' }}>
              <a href={downloadUrl} className="flex items-center gap-2 text-xs font-medium hover:underline" style={{ color: '#e03030' }}>
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
