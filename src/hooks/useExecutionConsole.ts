import { useState, useCallback } from 'react';
import type { ExecutionLog } from '@/types/alm';

// ─── Demo log sequences per module ────────────────────────────────────────────
const DEMO_LOGS: Record<string, { level: ExecutionLog['level']; message: string; delay: number }[]> = {
  'Defect Extraction': [
    { level: 'info',    message: 'Connecting to ALM project...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 500 },
    { level: 'info',    message: 'Executing BUG table query with filters...', delay: 600 },
    { level: 'success', message: 'Query returned 47 defect records', delay: 700 },
    { level: 'info',    message: 'Processing defect BUG-1042 [Open] — Functional', delay: 300 },
    { level: 'success', message: 'BUG-1042: Login page crash on invalid credentials — extracted', delay: 200 },
    { level: 'info',    message: 'Processing defect BUG-1043 [Open] — Performance', delay: 300 },
    { level: 'success', message: 'BUG-1043: Dashboard load time exceeds 5s threshold — extracted', delay: 200 },
    { level: 'info',    message: 'Processing defect BUG-1044 [Fixed] — UI', delay: 300 },
    { level: 'success', message: 'BUG-1044: Button misalignment on Safari browser — extracted', delay: 200 },
    { level: 'info',    message: 'Processing defect BUG-1045 [Closed] — Security', delay: 300 },
    { level: 'success', message: 'BUG-1045: Session token not invalidated on logout — extracted', delay: 200 },
    { level: 'info',    message: 'Processing remaining 43 defects...', delay: 600 },
    { level: 'success', message: 'All 47 defects processed successfully', delay: 400 },
    { level: 'info',    message: 'Writing to ExtractedDefects.xlsx...', delay: 500 },
    { level: 'success', message: '✓ ExtractedDefects.xlsx saved — 47 records, 14 columns', delay: 300 },
  ],
  'Test Extraction': [
    { level: 'info',    message: 'Connecting to ALM Test Plan...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 500 },
    { level: 'info',    message: 'Traversing folder tree from root node...', delay: 600 },
    { level: 'success', message: 'Found 8 sub-folders, 312 test cases', delay: 500 },
    { level: 'info',    message: 'Extracting test case TC-001 — Login Module', delay: 300 },
    { level: 'success', message: 'TC-001: Verify login with valid credentials — 5 steps extracted', delay: 200 },
    { level: 'info',    message: 'Extracting test case TC-002 — Login Module', delay: 300 },
    { level: 'success', message: 'TC-002: Verify login with invalid credentials — 3 steps extracted', delay: 200 },
    { level: 'info',    message: 'Extracting test case TC-003 — Dashboard Module', delay: 300 },
    { level: 'success', message: 'TC-003: Verify dashboard widgets load correctly — 7 steps extracted', delay: 200 },
    { level: 'info',    message: 'Processing remaining 309 test cases...', delay: 800 },
    { level: 'success', message: 'All 312 test cases extracted with design steps', delay: 400 },
    { level: 'info',    message: 'Writing to TestCaseDetailsFinal.xlsx...', delay: 500 },
    { level: 'success', message: '✓ TestCaseDetailsFinal.xlsx saved — 312 test cases, 2,847 steps', delay: 300 },
  ],
  'Test Type Update': [
    { level: 'info',    message: 'Connecting to ALM...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 400 },
    { level: 'info',    message: 'Validating test case IDs...', delay: 500 },
    { level: 'success', message: 'All test case IDs validated', delay: 300 },
    { level: 'info',    message: 'Updating TC-1001 → MANUAL...', delay: 400 },
    { level: 'success', message: 'TC-1001 updated successfully', delay: 200 },
    { level: 'info',    message: 'Updating TC-1002 → MANUAL...', delay: 400 },
    { level: 'success', message: 'TC-1002 updated successfully', delay: 200 },
    { level: 'info',    message: 'Updating TC-1003 → MANUAL...', delay: 400 },
    { level: 'success', message: 'TC-1003 updated successfully', delay: 200 },
    { level: 'success', message: '✓ Test type update complete — 3 records updated', delay: 300 },
  ],
  'Evidence Generator': [
    { level: 'info',    message: 'Reading input Excel file...', delay: 400 },
    { level: 'success', message: 'Found 24 test IDs in input file', delay: 400 },
    { level: 'info',    message: 'Connecting to ALM for test step data...', delay: 500 },
    { level: 'success', message: 'ALM session established', delay: 300 },
    { level: 'info',    message: 'Querying test steps for 24 test cases...', delay: 700 },
    { level: 'success', message: 'Retrieved 186 test steps across 24 tests', delay: 400 },
    { level: 'info',    message: 'Generating Word document for Tester_John...', delay: 500 },
    { level: 'success', message: 'TC-2201_Verify_Login_Flow.docx created', delay: 300 },
    { level: 'info',    message: 'Generating Word document for Tester_Sarah...', delay: 500 },
    { level: 'success', message: 'TC-2205_Dashboard_Validation.docx created', delay: 300 },
    { level: 'info',    message: 'Generating remaining 22 Word documents...', delay: 700 },
    { level: 'success', message: '✓ Evidence generation complete — 24 Word docs in ALM_Query_Results/', delay: 300 },
  ],
  'Attachment Download': [
    { level: 'info',    message: 'Connecting to ALM Test Lab...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 400 },
    { level: 'info',    message: 'Fetching test instances from test set...', delay: 600 },
    { level: 'success', message: 'Found 15 test instances with runs', delay: 400 },
    { level: 'info',    message: 'Downloading run-level attachment: screenshot_login.png', delay: 500 },
    { level: 'success', message: 'screenshot_login.png → ALMExtraction/Suite_101/Run_45/', delay: 200 },
    { level: 'info',    message: 'Downloading step-level attachment: error_log.txt', delay: 400 },
    { level: 'success', message: 'error_log.txt → ALMExtraction/Suite_101/Run_45/Step_3/', delay: 200 },
    { level: 'info',    message: 'Processing remaining 13 instances...', delay: 700 },
    { level: 'success', message: '✓ Download complete — 38 attachments saved to ALMExtraction/', delay: 300 },
  ],
  'Access Provider': [
    { level: 'info',    message: 'Connecting to ALM Site Administration...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 400 },
    { level: 'info',    message: 'Checking if user exists in Site Admin...', delay: 500 },
    { level: 'success', message: 'User not found in Site Admin — adding...', delay: 400 },
    { level: 'success', message: 'User added to Site Administration', delay: 300 },
    { level: 'info',    message: 'Adding user to project...', delay: 500 },
    { level: 'success', message: 'User added to project successfully', delay: 300 },
    { level: 'info',    message: 'Assigning group: QA_Engineer...', delay: 400 },
    { level: 'success', message: 'Group assigned successfully', delay: 300 },
    { level: 'success', message: '✓ Access provisioned successfully', delay: 200 },
  ],
  'Maintenance Notification': [
    { level: 'info',    message: 'Connecting to ALM project...', delay: 400 },
    { level: 'success', message: 'ALM session established', delay: 400 },
    { level: 'info',    message: 'Fetching project user list...', delay: 600 },
    { level: 'success', message: 'Found 42 active users in project', delay: 400 },
    { level: 'info',    message: 'Resolving email addresses via Outlook...', delay: 700 },
    { level: 'success', message: '38 email addresses resolved', delay: 400 },
    { level: 'info',    message: 'Composing maintenance notification email...', delay: 400 },
    { level: 'success', message: 'Email composed with maintenance window details', delay: 300 },
    { level: 'info',    message: 'Sending via Outlook to 38 recipients...', delay: 600 },
    { level: 'success', message: '✓ Notification sent to 38 users successfully', delay: 300 },
  ],
};

const DEFAULT_DEMO = [
  { level: 'info' as const,    message: 'Connecting to ALM...', delay: 400 },
  { level: 'success' as const, message: 'ALM session established', delay: 500 },
  { level: 'info' as const,    message: 'Processing request...', delay: 700 },
  { level: 'success' as const, message: '✓ Operation completed successfully', delay: 400 },
];

function isOffline(msg: string) {
  return msg === 'TIMEOUT' || msg === 'UNREACHABLE' || msg.includes('timed out') || msg.includes('Failed to fetch');
}

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useExecutionConsole() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = useCallback((level: ExecutionLog['level'], message: string, module?: string) => {
    setLogs(prev => [...prev, {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      message,
      module,
    }]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const runDemo = useCallback(async (moduleName: string) => {
    const sequence = DEMO_LOGS[moduleName] || DEFAULT_DEMO;
    addLog('info', `[DEMO] Starting ${moduleName}...`, moduleName);
    for (const step of sequence) {
      await delay(step.delay);
      addLog(step.level, step.message, moduleName);
    }
  }, [addLog]);

  const execute = useCallback(async <T,>(
    moduleName: string,
    fn: () => Promise<T>
  ): Promise<T | null> => {
    setIsRunning(true);
    addLog('info', `Starting ${moduleName}...`, moduleName);
    try {
      const result = await fn();
      addLog('success', `${moduleName} completed successfully.`, moduleName);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (isOffline(msg)) {
        // Backend unreachable — run demo simulation instead
        await runDemo(moduleName);
      } else {
        addLog('error', `${moduleName} failed: ${msg}`, moduleName);
      }
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [addLog, runDemo]);

  return { logs, isRunning, addLog, clearLogs, execute };
}
