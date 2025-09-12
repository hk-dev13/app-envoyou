import React, { useState } from 'react';

const DateRangePicker = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const ranges = [
    { key: 'today', label: 'Today', value: 'today' },
    { key: '7days', label: 'Last 7 days', value: '7days' },
    { key: '30days', label: 'Last 30 days', value: '30days' },
    { key: '90days', label: 'Last 90 days', value: '90days' },
    { key: 'custom', label: 'Custom range', value: 'custom' }
  ];

  const getCurrentLabel = () => {
    const range = ranges.find(r => r.value === selectedRange);
    return range ? range.label : 'Last 30 days';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{getCurrentLabel()}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {ranges.map((range) => (
              <button
                key={range.key}
                onClick={() => {
                  onRangeChange(range.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                  selectedRange === range.value
                    ? 'text-emerald-400 bg-slate-700/50'
                    : 'text-slate-300'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;