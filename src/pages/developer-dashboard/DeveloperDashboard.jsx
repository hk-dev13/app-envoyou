import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import DeveloperLayout from '../../components/developer/DeveloperLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  FileText,
  Key,
  BarChart3,
  Code,
  Gauge,
  Plus,
  ExternalLink,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import apiService from '../../services/apiService';

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEndpoints: 0,
    activeKeys: 0,
    totalRequests: 0,
    errorRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloperStats = async () => {
      try {
        setLoading(true);
        // Fetch real data from API
        const developerStats = await apiService.getDeveloperStats();
        setStats({
          totalEndpoints: developerStats.total_endpoints || 24,
          activeKeys: developerStats.active_keys || 0,
          totalRequests: developerStats.total_requests || 0,
          errorRate: developerStats.error_rate || 0
        });
      } catch (err) {
        console.error('Failed to fetch developer stats:', err);
        // Fallback to demo data
        setStats({
          totalEndpoints: 24,
          activeKeys: 2,
          totalRequests: 15420,
          errorRate: 0.02
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperStats();
  }, []);

  const quickActions = [
    {
      title: 'API Docs Portal',
      description: 'Unified guides & reference (opens new tab)',
      icon: FileText,
      href: 'https://docs.envoyou.com/',
      external: true,
      color: 'bg-blue-600'
    },
    {
      title: 'Manage API Keys',
      description: 'Create and manage your API keys',
      icon: Key,
      href: '/developer/api-keys',
      external: false,
      color: 'bg-emerald-600'
    },
    {
      title: 'View Analytics',
      description: 'Monitor your API usage and performance',
      icon: BarChart3,
      href: '/developer/analytics',
      external: false,
      color: 'bg-purple-600'
    },
    {
      title: 'Code Snippets',
      description: 'Ready-to-use code examples',
      icon: Code,
      href: '/developer/snippets',
      external: false,
      color: 'bg-orange-600'
    }
  ];

  return (
    <DeveloperLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-emerald-600 text-white text-xl">
                {user?.name?.[0] || user?.email?.[0] || 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.name || 'Developer'}! 👋
              </h1>
              <p className="text-slate-400 mt-1">
                Here&apos;s what&apos;s happening with your API today
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                  Pro Plan
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  API Access
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link to="/developer/api-keys">
                <Plus className="h-4 w-4 mr-2" />
                New API Key
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active API Keys</CardTitle>
              <Key className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.activeKeys}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Keys in use
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : `${(stats.errorRate * 100).toFixed(1)}%`}
              </div>
              <p className="text-xs text-emerald-400 mt-1">
                Below target
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Endpoints</CardTitle>
              <Gauge className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalEndpoints}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Available APIs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription>
              Jump to the most common developer tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.external ? undefined : action.href}
                    onClick={(e) => {
                      if (action.external) {
                        e.preventDefault();
                        window.open(action.href, '_blank', 'noopener');
                      }
                    }}
                    className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {action.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Analytics Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription>
                Your latest API interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">API key generated</p>
                    <p className="text-slate-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">1000 requests processed</p>
                    <p className="text-slate-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Rate limit warning</p>
                    <p className="text-slate-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Usage Overview</CardTitle>
              <CardDescription>
                Your API usage this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Requests</span>
                  <span className="text-white font-medium">15,420 / 50,000</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30.8%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Rate Limit</span>
                  <span className="text-white font-medium">245 / 1,000</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DeveloperLayout>
  );
};

export default DeveloperDashboard;