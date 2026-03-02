interface Props {
  status: 'connected' | 'disconnected' | 'error' | 'healthy' | 'degraded' | 'down' | 'running' | 'success' | 'failed';
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { color: string; pulse: boolean }> = {
  connected: { color: 'bg-success', pulse: true },
  healthy: { color: 'bg-success', pulse: true },
  success: { color: 'bg-success', pulse: false },
  running: { color: 'bg-primary', pulse: true },
  disconnected: { color: 'bg-muted-foreground', pulse: false },
  error: { color: 'bg-destructive', pulse: true },
  failed: { color: 'bg-destructive', pulse: false },
  degraded: { color: 'bg-warning', pulse: true },
  down: { color: 'bg-destructive', pulse: true },
};

export function StatusIndicator({ status, label, size = 'sm' }: Props) {
  const cfg = statusConfig[status] || statusConfig.disconnected;
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`${dotSize} rounded-full ${cfg.color} ${cfg.pulse ? 'animate-pulse-glow' : ''}`} />
      {label && <span className="text-muted-foreground uppercase tracking-wide">{label}</span>}
    </span>
  );
}
