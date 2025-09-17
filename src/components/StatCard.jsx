import React from 'react';
import SparklineChart from './SparklineChart';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive', // 'positive', 'negative', 'neutral'
  icon: Icon,
  sparklineData,
  onClick,
  loading = false
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div
      className={`bg-card/50 border border-border rounded-lg p-6 transition-all duration-200 hover:bg-card/70 hover:border-slate-600 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-slate-900/20' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {Icon && (
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-24 mb-1"></div>
              <div className="h-4 bg-slate-700 rounded w-16"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-foreground mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>

              {change && (
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-medium ${getChangeColor()}`}>
                    {getChangeIcon()} {change}
                  </span>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sparkline */}
      {!loading && sparklineData && (
        <div className="mt-4">
          <SparklineChart data={sparklineData} height={20} />
        </div>
      )}
    </div>
  );
};

export default StatCard;