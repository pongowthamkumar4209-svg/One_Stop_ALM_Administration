import { useRef, useEffect } from 'react';
import type { ExecutionLog } from '@/types/alm';
import { Terminal, Trash2 } from 'lucide-react';

const levelColors: Record<string, string> = {
  info: 'text-muted-foreground',
  warn: 'text-warning',
  error: 'text-destructive',
  success: 'text-success',
};

const levelIcons: Record<string, string> = {
  info: '●',
  warn: '▲',
  error: '✖',
  success: '✔',
};

interface Props {
  logs: ExecutionLog[];
  isRunning: boolean;
  onClear: () => void;
}

export function ExecutionConsole({ logs, isRunning, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col rounded border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          EXECUTION CONSOLE
          {isRunning && (
            <span className="ml-2 inline-flex items-center gap-1 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              RUNNING
            </span>
          )}
        </div>
        <button onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-48 overflow-auto p-3 font-mono text-xs leading-relaxed">
        {logs.length === 0 && (
          <div className="text-muted-foreground/50 italic">Awaiting execution...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className={`flex gap-2 ${levelColors[log.level]}`}>
            <span className="shrink-0 text-muted-foreground/60 select-none">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="shrink-0 w-3 text-center">{levelIcons[log.level]}</span>
            {log.module && <span className="shrink-0 text-primary/70">[{log.module}]</span>}
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
