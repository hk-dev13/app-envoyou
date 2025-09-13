import React, { useEffect } from 'react';
import { TIERS, FEATURE_MIN_TIER, tierRank } from '../config/plans';

/**
 * Minimal upgrade modal (accessible): focus trap + ESC close.
 */
export default function UpgradeModal({ open, currentPlan, onClose, onSelectPlan }) {
  const ref = React.useRef(null);

  useEffect(() => {
    if (open && ref.current) {
      const prev = document.activeElement;
      ref.current.focus();
      return () => prev && prev.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const tierList = [TIERS.FREE, TIERS.BUILD, TIERS.SCALE, TIERS.ENTERPRISE];

  function featuresForTier(t) {
    return Object.entries(FEATURE_MIN_TIER)
      .filter(([_, req]) => tierRank(t) >= tierRank(req))
      .map(([feat]) => feat)
      .sort();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Upgrade plan"
        tabIndex={-1}
        className="relative w-full max-w-3xl app-card panel shadow-md border border-[var(--color-border)]"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-wide">Upgrade Plan</h2>
            <p className="text-[12px] muted">Current plan: {currentPlan}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost text-[12px]">Close</button>
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <th className="text-left">Tier</th>
                <th className="text-left">Included Features</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tierList.map(t => (
                <tr key={t} className={t === currentPlan ? 'bg-[rgba(255,255,255,0.02)]' : ''}>
                  <td className="align-top py-2 font-medium">
                    {t}
                    {t === currentPlan && <span className="status-chip active ml-2">Current</span>}
                  </td>
                  <td className="align-top py-2 pr-4">
                    <ul className="space-y-1">
                      {featuresForTier(t).map(f => (
                        <li key={f} className="text-secondary">{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="align-top py-2">
                    {tierRank(t) > tierRank(currentPlan) ? (
                      <button
                        onClick={() => onSelectPlan(t)}
                        className="btn btn-primary text-[11px]"
                      >Choose</button>
                    ) : tierRank(t) === tierRank(currentPlan) ? (
                      <span className="text-[10px] text-secondary">Active</span>
                    ) : (
                      <span className="text-[10px] text-secondary">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline text-[11px]">Done</button>
        </div>
      </div>
    </div>
  );
}
