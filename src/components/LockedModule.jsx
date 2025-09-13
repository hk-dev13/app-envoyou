import React, { useCallback } from 'react';

/**
 * LockedModule wraps gated content and provides accessible overlay with upgrade CTA.
 * Accessibility features:
 * - aria-describedby linking to explanation text
 * - role="group" to associate label + description
 * - Keyboard activation (Enter/Space) on container focusing the Upgrade button
 */
export default function LockedModule({ required, current, children, onUpgrade, inline }) {
  const upgradeRef = React.useRef(null);
  const onKey = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (upgradeRef.current) upgradeRef.current.focus();
    }
  }, []);

  const descriptionId = React.useId();
  const labelId = React.useId();

  return (
    <div className="relative group" role="group" aria-labelledby={labelId} aria-describedby={descriptionId} tabIndex={0} onKeyDown={onKey}>
      <div className={inline ? 'opacity-40 pointer-events-none' : 'opacity-40 pointer-events-none'} aria-hidden="true">
        {children}
      </div>
      <div className="locked-module-overlay absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-800 p-3 text-center">
        <div className="flex flex-col items-center text-center px-2">
          <span id={labelId} className="text-[11px] font-medium text-white tracking-wide">Requires {required} Plan</span>
          <span className="text-[10px] text-secondary">Current: {current}</span>
        </div>
        <button
          ref={upgradeRef}
          onClick={(e) => {
            if (onUpgrade) onUpgrade(e);
            else window.dispatchEvent(new CustomEvent('open-upgrade-modal', { detail: { feature: 'unknown' } }));
          }}
          className="btn btn-primary text-[11px] px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          aria-label={`Upgrade to access feature requiring ${required} plan`}
        >Upgrade</button>
        <div id={descriptionId} className="text-[10px] text-secondary max-w-[160px] leading-snug">Unlock enhanced analytics & capacity.</div>
      </div>
    </div>
  );
}
