import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const RateLimitMonitor = () => {
  const [rateLimits, setRateLimits] = useState({
    requestsPerMinute: 1000,
    requestsPerHour: 10000,
    requestsPerDay: 50000,
    currentUsage: {
      minute: 245,
      hour: 1250,
      day: 8750
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRateLimits = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRateLimits();
        setRateLimits(data);
      } catch (error) {
        console.error('Error fetching rate limits:', error);
        // Fallback to mock data if API fails
        setRateLimits({
          requestsPerMinute: 1000,
          requestsPerHour: 10000,
          requestsPerDay: 50000,
          currentUsage: {
            minute: 245,
            hour: 1250,
            day: 8750
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRateLimits();
  }, []);

  const getUsagePercentage = (current, limit) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card/50 rounded-lg p-6">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-3"></div>
                <div className="h-2 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-foreground">Rate Limits</h2>
        <p className="text-muted-foreground mt-1">Monitor your API usage and rate limit status</p>
      </div>

      {/* Current Plan */}
      <div className="bg-card/50 border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-primary-foreground mb-4">Current Plan: Developer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">1,000</div>
            <div className="text-sm text-muted-foreground">Requests/minute</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">10,000</div>
            <div className="text-sm text-muted-foreground">Requests/hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">50,000</div>
            <div className="text-sm text-muted-foreground">Requests/day</div>
          </div>
        </div>
      </div>

      {/* Rate Limit Status */}
      <div className="space-y-4">
        {/* Per Minute */}
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-primary-foreground font-medium">Requests per Minute</h4>
            <span className={`text-sm font-medium ${getStatusColor(getUsagePercentage(rateLimits.currentUsage.minute, rateLimits.requestsPerMinute))}`}>
              {rateLimits.currentUsage.minute} / {rateLimits.requestsPerMinute}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(rateLimits.currentUsage.minute, rateLimits.requestsPerMinute))}`}
              style={{ width: `${getUsagePercentage(rateLimits.currentUsage.minute, rateLimits.requestsPerMinute)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Resets in 45 seconds</span>
            <span>{Math.round(getUsagePercentage(rateLimits.currentUsage.minute, rateLimits.requestsPerMinute))}% used</span>
          </div>
        </div>

        {/* Per Hour */}
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-primary-foreground font-medium">Requests per Hour</h4>
            <span className={`text-sm font-medium ${getStatusColor(getUsagePercentage(rateLimits.currentUsage.hour, rateLimits.requestsPerHour))}`}>
              {rateLimits.currentUsage.hour} / {rateLimits.requestsPerHour}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(rateLimits.currentUsage.hour, rateLimits.requestsPerHour))}`}
              style={{ width: `${getUsagePercentage(rateLimits.currentUsage.hour, rateLimits.requestsPerHour)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Resets in 23 minutes</span>
            <span>{Math.round(getUsagePercentage(rateLimits.currentUsage.hour, rateLimits.requestsPerHour))}% used</span>
          </div>
        </div>

        {/* Per Day */}
        <div className="bg-card/50 border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-primary-foreground font-medium">Requests per Day</h4>
            <span className={`text-sm font-medium ${getStatusColor(getUsagePercentage(rateLimits.currentUsage.day, rateLimits.requestsPerDay))}`}>
              {rateLimits.currentUsage.day} / {rateLimits.requestsPerDay}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(rateLimits.currentUsage.day, rateLimits.requestsPerDay))}`}
              style={{ width: `${getUsagePercentage(rateLimits.currentUsage.day, rateLimits.requestsPerDay)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Resets in 14 hours</span>
            <span>{Math.round(getUsagePercentage(rateLimits.currentUsage.day, rateLimits.requestsPerDay))}% used</span>
          </div>
        </div>
      </div>

      {/* Rate Limit Headers */}
      <div className="bg-card/50 border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-primary-foreground mb-4">Rate Limit Headers</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Every API response includes these headers to help you monitor your usage:
        </p>
        <div className="space-y-3">
          <div className="bg-background/50 p-3 rounded border border-slate-600">
            <code className="text-emerald-400 text-sm">X-RateLimit-Limit: 1000</code>
            <p className="text-slate-500 text-xs mt-1">Maximum requests allowed in current window</p>
          </div>
          <div className="bg-background/50 p-3 rounded border border-slate-600">
            <code className="text-emerald-400 text-sm">X-RateLimit-Remaining: 755</code>
            <p className="text-slate-500 text-xs mt-1">Requests remaining in current window</p>
          </div>
          <div className="bg-background/50 p-3 rounded border border-slate-600">
            <code className="text-emerald-400 text-sm">X-RateLimit-Reset: 1640995200</code>
            <p className="text-slate-500 text-xs mt-1">Unix timestamp when the limit resets</p>
          </div>
        </div>
      </div>

      {/* Upgrade Plan */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-primary-foreground">Need Higher Limits?</h3>
            <p className="text-muted-foreground text-sm mt-1">Upgrade to Pro plan for 10x higher rate limits</p>
          </div>
          <button className="bg-primary hover:bg-emerald-700 text-primary-foreground px-6 py-2 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateLimitMonitor;