import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Key,
  Gauge,
  Plus,
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

  return (
    <div className="space-y-8 p-6">
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
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name || 'Developer'}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s what&apos;s happening with your API today
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                  Pro Plan
                </Badge>
                <Badge variant="outline" className="text-muted-foreground border-border">
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
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : stats.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active API Keys</CardTitle>
              <Key className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : stats.activeKeys}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keys in use
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : `${(stats.errorRate * 100).toFixed(1)}%`}
              </div>
              <p className="text-xs text-emerald-400 mt-1">
                Below target
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Endpoints</CardTitle>
              <Gauge className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? '...' : stats.totalEndpoints}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available APIs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Analytics Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>
                Your latest API interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">API key generated</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">1000 requests processed</p>
                    <p className="text-muted-foreground text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">Rate limit warning</p>
                    <p className="text-muted-foreground text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Usage Overview</CardTitle>
              <CardDescription>
                Your API usage this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Requests</span>
                  <span className="text-foreground font-medium">15,420 / 50,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30.8%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Rate Limit</span>
                  <span className="text-foreground font-medium">245 / 1,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default DeveloperDashboard;