import React from 'react';

const SparklineChart = ({ data, color = '#10b981', height = 24 }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create path for the sparkline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * (height - 4) + 2; // Add padding
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] > data[0];

  return (
    <div className="flex items-end">
      <svg width="80" height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          className="transition-all duration-300"
        />
        {/* Trend indicator */}
        <circle
          cx="76"
          cy={((max - data[data.length - 1]) / range) * (height - 4) + 2}
          r="2"
          fill={color}
          className="animate-pulse"
        />
      </svg>
      <div className="ml-2 flex items-center">
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '↗' : '↘'}
        </span>
      </div>
    </div>
  );
};

export default SparklineChart;