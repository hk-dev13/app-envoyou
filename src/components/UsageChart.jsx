import React from 'react';

const UsageChart = ({ data, title = "API Usage Over Time", height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`h-${height/16} flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg`}>
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-slate-400">No usage data available</p>
          <p className="text-sm text-slate-500 mt-1">Data will appear here once you start using the API</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Create points for the line chart
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - point.value) / range) * 80 + 10; // 10% margin top/bottom
    return `${x},${y}`;
  }).join(' ');

  // Create area fill points
  const areaPoints = points + ` 100,90 0,90`;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-400">API Calls</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(71, 85, 105, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill="url(#gradient)"
            opacity="0.1"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points={points}
            className="transition-all duration-300"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / range) * 80 + 10;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="#10b981"
                className="hover:r-4 transition-all duration-200"
              />
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 py-2">
          <span>{maxValue.toLocaleString()}</span>
          <span>{Math.round((maxValue + minValue) / 2).toLocaleString()}</span>
          <span>{minValue.toLocaleString()}</span>
        </div>

        {/* X-axis labels (show first, middle, last dates) */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 px-2 pb-2">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</p>
          <p className="text-xs text-slate-400">Total Calls</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">
            +{Math.round((data[data.length - 1]?.value - data[0]?.value) / data[0]?.value * 100) || 0}%
          </p>
          <p className="text-xs text-slate-400">Growth</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}</p>
          <p className="text-xs text-slate-400">Daily Avg</p>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;