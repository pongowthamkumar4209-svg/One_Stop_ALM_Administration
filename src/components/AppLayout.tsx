import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FileSearch, Bug, RefreshCw, FileCheck,
  Download, UserPlus, Bell, LogOut, ChevronLeft, Shield
} from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/test-extraction', label: 'Test Extraction', icon: FileSearch },
  { path: '/defect-extraction', label: 'Defect Extraction', icon: Bug },
  { path: '/test-type-update', label: 'Test Type Update', icon: RefreshCw },
  { path: '/evidence-generator', label: 'Evidence Generator', icon: FileCheck },
  { path: '/attachment-downloader', label: 'Attachments', icon: Download },
  { path: '/access-provider', label: 'Access Provider', icon: UserPlus },
  { path: '/maintenance', label: 'Maintenance', icon: Bell },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { session, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-border bg-sidebar transition-all duration-200 ${collapsed ? 'w-14' : 'w-52'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-3">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          {!collapsed && <span className="text-sm font-bold tracking-tight truncate">ALM OPS</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-auto py-2 space-y-0.5 px-1.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 space-y-2">
          {!collapsed && session && (
            <div className="px-1.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <StatusIndicator status="connected" />
                <span className="text-xs text-muted-foreground truncate font-mono">{session.username}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={logout} className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
    </div>
  );
}
