import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import * as Tooltip from '@radix-ui/react-tooltip';
import ThemeToggle from '../ThemeToggle.jsx';
import PlanStatus from '../PlanStatus.jsx';
import Breadcrumbs from '../Breadcrumbs.jsx';

const ProfileMenu = ({ user, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const [focusIndex, setFocusIndex] = React.useState(0);

  const onKeyDown = (e) => {
    if (!open) return;
    const items = menuRef.current?.querySelectorAll('[data-menu-item="true"]');
    if (!items || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusIndex + 1) % items.length;
      setFocusIndex(next);
      items[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (focusIndex - 1 + items.length) % items.length;
      setFocusIndex(prev);
      items[prev].focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full p-2 rounded-lg hover:bg-accent/40 transition-colors grid place-items-center"
      >
        <div className="w-8 h-8 bg-primary/20 text-primary rounded-full grid place-items-center text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="sr-only">Open profile menu</span>
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 w-48 z-40 mb-2 rounded-md border border-border bg-popover/95 backdrop-blur-sm shadow-lg py-1"
          role="menu"
        >
          <Link
            to="/settings/profile"
            className="px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Profile
          </Link>
          <Link
            to="/settings/notifications"
            className="px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 012 21h13.78a3 3 0 002.553-1.658l.046-.092A17.925 17.925 0 0118.708 7.5 17.925 17.925 0 0112 3c-2.131 0-4.09.61-5.84 1.683M12 3v18"/></svg>
            Notifications
          </Link>
          <div className="border-t border-border my-1" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
            role="menuitem"
            data-menu-item="true"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0V7a2 2 0 114 0v1"/></svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile overlay
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    try {
      const v = localStorage.getItem('env.sidebarVisible');
      return v ? v === '1' : true;
    } catch {
      return true;
    }
  });
  // Desktop behavior: sidebarVisible = expanded (labels). When false = icon-only collapsed.

  React.useEffect(() => {
    try { localStorage.setItem('env.sidebarVisible', sidebarVisible ? '1' : '0'); } catch (e) { void e; }
  }, [sidebarVisible]);
  // Section tone removed for neutral style

  const navigationItems = React.useMemo(() => {
    const isDeveloperSection = location.pathname.startsWith('/developer');
    const isSettingsSection = location.pathname.startsWith('/settings');

    if (isDeveloperSection) {
      return [
        {
          name: 'Overview',
          path: '/developer',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          ),
          active: location.pathname === '/developer'
        },
        {
          name: 'API Docs',
          path: '/developer/api-docs',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/api-docs')
        },
        {
          name: 'API Keys',
          path: '/developer/api-keys',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/api-keys')
        },
        {
          name: 'Analytics',
          path: '/developer/analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V8a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 009.172 4H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/analytics')
        },
        {
          name: 'Rate Limits',
          path: '/developer/rate-limits',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/rate-limits')
        },
        {
          name: 'Snippets',
          path: '/developer/snippets',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          active: location.pathname.startsWith('/developer/snippets')
        }
      ];
    } else if (isSettingsSection) {
      return [
        {
          name: 'Profile',
          path: '/settings/profile',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/profile')
        },
        {
          name: 'Notifications',
          path: '/settings/notifications',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 012 21h13.78a3 3 0 002.553-1.658l.046-.092A17.925 17.925 0 0118.708 7.5 17.925 17.925 0 0112 3c-2.131 0-4.09.61-5.84 1.683M12 3v18" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/notifications')
        },
        {
          name: 'Security',
          path: '/settings/security',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          active: location.pathname.startsWith('/settings/security')
        }
      ];
    } else {
      // Dashboard section
      return [
        {
          name: 'Overview',
          path: '/dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          ),
          active: location.pathname === '/dashboard'
        },
        {
          name: 'Monitoring',
          path: '/dashboard/monitoring',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/monitoring')
        },
        {
          name: 'Analytics',
          path: '/dashboard/analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V8a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 009.172 4H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/analytics')
        },
        {
          name: 'Reporting',
          path: '/dashboard/reporting',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          active: location.pathname.startsWith('/dashboard/reporting')
        }
      ];
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card/90 backdrop-blur-xl border-r border-border/80 transition-all duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
        ${sidebarVisible ? 'w-64' : 'w-14'}`}
      >
        {/* Brand */}
        <div className="px-3 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/svg/logo-nb.svg" alt="Envoyou" className="h-6 w-auto rounded" />
              {sidebarVisible && <span className="text-foreground font-semibold tracking-wide">Envoyou</span>}
            </Link>
            <div />
          </div>
        </div>

        {/* Navigation */}
        <Tooltip.Provider delayDuration={200} skipDelayDuration={200}>
          <nav className="flex-1 px-2 md:px-3 py-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = item.active;
              const collapsed = !sidebarVisible;
              const base = collapsed
                ? 'group relative flex items-center justify-center h-10 w-full rounded-md transition-colors'
                : 'group relative flex items-center px-3 py-2 rounded-md transition-colors';
              const cls = isActive
                ? (collapsed ? 'text-foreground' : 'text-foreground bg-accent')
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/10';
              const link = (
                <Link key={item.path} to={item.path} className={`${base} ${cls}`}>
                  {isActive && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground/70" />
                  )}
                  <div className="flex-shrink-0 opacity-90 group-hover:opacity-100">{item.icon}</div>
                  <span className={`${sidebarVisible ? 'ml-3' : 'hidden'} transition-all duration-200`}>
                    {item.name}
                  </span>
                </Link>
              );
              return sidebarVisible ? (
                link
              ) : (
                <Tooltip.Root key={item.path}>
                  <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
                  <Tooltip.Content side="right" className="rounded-md bg-popover text-popover-foreground border border-border px-2 py-1 text-xs shadow-md">
                    {item.name}
                  </Tooltip.Content>
                </Tooltip.Root>
              );
            })}
          </nav>
        </Tooltip.Provider>

        {/* User + Settings at Bottom */}
        <div className="mt-auto border-t border-border/80 px-2 py-2">
          <div className="flex flex-col items-center gap-2">
            <ProfileMenu user={user} onLogout={logout} />
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    to="/settings/profile"
                    className="w-9 h-9 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Settings"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.065-2.572c-.94-1.543.827-3.31 2.37-2.37.94.558 2.146.178 2.573-1.066zM12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content side="right" className="rounded-md bg-popover text-popover-foreground border border-border px-2 py-1 text-xs shadow-md">Settings</Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </aside>

      {/* Edge hover handle for show/hide (desktop) */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-40 ${sidebarVisible ? 'ml-64' : 'ml-14'} w-2 hover:bg-border/40 transition-colors`}
        onClick={() => setSidebarVisible(v => !v)}
        style={{ cursor: 'ew-resize' }}
        aria-label="Toggle sidebar"
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
  <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'md:ml-64' : 'md:ml-14'}`}>
        {/* SaaS Header */}
        <header className="h-16 border-b border-border/80 bg-background/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          {/* Sidebar toggles */}
          <div className="flex items-center gap-1">
            {/* Mobile open */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-primary-foreground hover:bg-accent"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Left: Breadcrumbs */}
          <div className="flex-1 flex items-center min-w-0">
            <Breadcrumbs />
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden md:block">
              <PlanStatus compact />
            </div>
            <ThemeToggle compact />
            <Link
              to="/developer/api-keys"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              New Key
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Edge hover handle for show/hide (desktop) */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-40 ${sidebarVisible ? 'ml-64' : 'ml-14'} w-2 hover:bg-border/40 transition-colors`}
        onClick={() => setSidebarVisible(v => !v)}
        style={{ cursor: 'ew-resize' }}
        aria-label="Toggle sidebar"
      />
    </div>
  );
}