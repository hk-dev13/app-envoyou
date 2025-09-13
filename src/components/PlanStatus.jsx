import React from 'react';
import { usePlan } from '../hooks/usePlan';

export default function PlanStatus({ compact }) {
  const { plan, loadingPlan, planError, remote } = usePlan();

  let content;
  if (loadingPlan) {
    content = <span className="text-[10px] text-secondary animate-pulse">Resolving plan…</span>;
  } else if (planError) {
    content = <span className="text-[10px] text-[#f87171]" title={planError}>Plan offline (fallback: {plan})</span>;
  } else {
    content = <span className="text-[10px] text-secondary">Plan: <span className="text-primary font-medium">{plan}</span>{remote ? '' : ' (derived)'}</span>;
  }

  return (
    <div className={compact ? 'px-2 py-1 rounded bg-[#11161d] border border-[#1f2a33]' : 'px-3 py-1.5 rounded bg-[#11161d] border border-[#1f2a33]'}>
      {content}
    </div>
  );
}
