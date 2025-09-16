import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import ThemeToggle from '../ThemeToggle.jsx';
import PlanStatus from '../PlanStatus.jsx';

const ProfileMenu = ({ user, onLogout, compact = false }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef(null);

  const clearClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimeout.current = setTimeout(() => setOpen(false), 160);
  };

  React.useEffect(() => () => clearClose(), []);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-transparent transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
          <div className="text-xs text-slate-400">{user?.email || 'user@example.com'}</div>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute bottom-full right-0 z-40 mt-2 w-56 rounded-md border border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-lg py-2"
          role="menu"
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-2 border-b border-slate-800">
            <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-400">{user?.email || 'user@example.com'}</div>
          </div>
          <Link
            to="/settings/profile"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-transparent hover:text-white"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile Settings
          </Link>
          <Link
            to="/settings/notifications"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-transparent hover:text-white"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Notifications
          </Link>
          <div className="border-t border-slate-800 my-1" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-transparent hover:text-white"
            role="menuitem"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const navigationItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      active: ['/dashboard'].some(p => location.pathname.startsWith(p))
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
    },
    {
      name: 'Developer',
      path: '/developer',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      active: ['/developer','/developer/api-keys','/developer/api-docs','/developer/rate-limits','/developer/snippets'].some(p => location.pathname.startsWith(p))
    },
    {
      name: 'Settings',
      path: '/settings/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      active: location.pathname.startsWith('/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'w-64' : 'w-16'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-slate-800">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img
              src="/svg/logo-full-nb.svg"
              alt="Envoyou"
              className={`transition-all duration-300 ${sidebarExpanded ? 'h-8' : 'h-6'}`}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-slate-600 border border-slate-600'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className={`ml-3 transition-opacity duration-200 ${
                sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div className="border-t border-slate-800 p-3">
          <ProfileMenu user={user} onLogout={logout} compact={!sidebarExpanded} />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'}`}>
        {/* Minimal Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-transparent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo for mobile */}
          <div className="md:hidden">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img
                src="/svg/logo-nb.svg"
                alt="Envoyou"
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <PlanStatus compact />
            <ThemeToggle compact />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}