import React from 'react';

export default function LockedModule({ required, current, children, onUpgrade, inline }) {
  return (
    <div className="relative group">
      <div className={inline ? 'opacity-40 pointer-events-none' : 'opacity-40 pointer-events-none'}>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm gap-3 rounded-lg border border-slate-800">
        <div className="flex flex-col items-center text-center px-4">
          <span className="text-xs font-medium text-slate-200">Requires {required} Plan</span>
          <span className="text-[10px] text-slate-400">Current: {current}</span>
        </div>
        <button
          onClick={onUpgrade}
          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium shadow"
        >Upgrade</button>
        <div className="text-[10px] text-slate-500 max-w-[160px]">Unlock enhanced analytics & capacity.</div>
      </div>
    </div>
  );
}
