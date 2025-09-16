import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  BarChart3,
  Key,
  FileText,
  Code,
  Gauge,
  Home,
  Settings,
  Moon,
  Sun,
  User
} from 'lucide-react';

const DeveloperSidebar = ({ user, isDarkMode, toggleDarkMode }) => {
  const location = useLocation();

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      path: '/developer',
      icon: Home,
      description: 'Dashboard overview'
    },
    {
      id: 'api-docs',
      label: 'API Documentation',
      path: '/developer/api-docs',
      icon: FileText,
      description: 'Interactive API docs'
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      path: '/developer/api-keys',
      icon: Key,
      description: 'Manage your keys'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/developer/analytics',
      icon: BarChart3,
      description: 'Usage statistics'
    },
    {
      id: 'rate-limits',
      label: 'Rate Limits',
      path: '/developer/rate-limits',
      icon: Gauge,
      description: 'Monitor limits'
    },
    {
      id: 'snippets',
      label: 'Code Snippets',
      path: '/developer/snippets',
      icon: Code,
      description: 'Ready-to-use code'
    }
  ];

  const isActive = (path) => {
    if (path === '/developer') {
      return location.pathname === '/developer';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-transparent border-r border-slate-800">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold">Envoyou</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-emerald-600 text-white">
              {user?.name?.[0] || user?.email?.[0] || 'D'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Developer'}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'text-slate-600 border border-slate-600'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="truncate">{item.label}</div>
                <div className="text-xs text-slate-600 truncate">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-800" />

      {/* Footer Actions */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="w-full justify-start text-slate-600 hover:text-slate-400 hover:bg-transparent"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 mr-2" />
          ) : (
            <Moon className="h-4 w-4 mr-2" />
          )}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>

        <Link to="/settings/profile">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-600 hover:text-slate-400 hover:bg-transparent"
          >
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-600 hover:text-slate-400 hover:bg-transparent"
        >
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </Button>
      </div>
    </div>
  );
};

export default DeveloperSidebar;