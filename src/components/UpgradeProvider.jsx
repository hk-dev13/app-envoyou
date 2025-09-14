import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UpgradeModal from './UpgradeModal';
import { usePlan } from '../hooks/usePlan';
import { track } from '../analytics/track';
import { UpgradeContext } from './UpgradeProviderContext';

export function UpgradeProvider({ children }) {
  const { plan } = usePlan();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [originFeature, setOriginFeature] = useState(null);

  const trigger = useCallback((feature) => {
    setOriginFeature(feature || null);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const selectPlan = useCallback((targetPlan) => {
    // Navigate to billing page with origin and target plan
    const params = new URLSearchParams({
      origin: originFeature || 'unknown',
      target: targetPlan
    });
    navigate(`/billing?${params.toString()}`);
    setOpen(false);
  }, [originFeature, navigate]);

  // Track modal impression when it opens
  useEffect(() => {
    if (open && originFeature) {
      track('open_upgrade_modal', { feature: originFeature });
    }
  }, [open, originFeature]);

  useEffect(() => {
    function openHandler(e) {
      trigger(e.detail?.feature);
    }
    function clickHandler(e) {
      const d = e.detail || {};
      track('feature_upgrade_click', d);
    }
    window.addEventListener('open-upgrade-modal', openHandler);
    window.addEventListener('feature-upgrade-click', clickHandler);
    return () => {
      window.removeEventListener('open-upgrade-modal', openHandler);
      window.removeEventListener('feature-upgrade-click', clickHandler);
    };
  }, [trigger]);

  return (
    <UpgradeContext.Provider value={{ open, trigger, close }}>
      {children}
      <UpgradeModal open={open} currentPlan={plan} onClose={close} onSelectPlan={selectPlan} />
    </UpgradeContext.Provider>
  );
}

