import { useState, useCallback } from 'react';
import type { ExecutionLog } from '@/types/alm';

export function useExecutionConsole() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = useCallback((level: ExecutionLog['level'], message: string, module?: string) => {
    const log: ExecutionLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      message,
      module,
    };
    setLogs(prev => [...prev, log]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

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
      addLog('error', `${moduleName} failed: ${msg}`, moduleName);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [addLog]);

  return { logs, isRunning, addLog, clearLogs, execute };
}
