import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FileSearch, Bug, RefreshCw, FileCheck,
  Download, UserPlus, Bell, LogOut, ChevronLeft, Shield, Menu, X
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 border-b px-3 py-3" style={{ borderColor: '#1a1a1a' }}>
        <Shield className="h-5 w-5 shrink-0" style={{ color: '#e03030' }} />
        {(!collapsed || onNavClick) && (
          <span className="text-sm font-bold tracking-tight truncate" style={{ color: '#f0f0f0' }}>ALM OPS</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto py-2 space-y-0.5 px-1.5">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium transition-colors"
              style={{
                background: active ? 'rgba(200,0,0,0.15)' : 'transparent',
                color: active ? '#e03030' : '#888',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(200,0,0,0.08)';
                  (e.currentTarget as HTMLElement).style.color = '#ccc';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#888';
                }
              }}
              title={collapsed && !onNavClick ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {(!collapsed || onNavClick) && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-2 space-y-2" style={{ borderColor: '#1a1a1a' }}>
        {(!collapsed || onNavClick) && session && (
          <div className="px-1.5 space-y-1">
            <div className="flex items-center gap-1.5">
              <StatusIndicator status="connected" />
              <span className="text-xs font-mono truncate" style={{ color: '#666' }}>{session.username}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          {!onNavClick && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded p-1 transition-colors"
              style={{ color: '#666' }}
            >
              <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
          <button
            onClick={logout}
            className="rounded p-1 transition-colors"
            style={{ color: '#666' }}
            title="Logout"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e03030')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666')}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>

      {/* ── MOBILE: top navbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: '#e03030' }} />
          <span className="text-sm font-bold" style={{ color: '#f0f0f0' }}>ALM OPS</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#888' }}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── MOBILE: slide-over drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="md:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col"
            style={{ background: '#0d0d0d', borderRight: '1px solid #1a1a1a' }}>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* ── DESKTOP: sidebar ── */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-200 ${collapsed ? 'w-14' : 'w-52'}`}
        style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 pt-16 md:pt-4">
        {children}
      </main>
    </div>
  );
}
