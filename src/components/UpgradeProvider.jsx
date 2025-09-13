import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import UpgradeModal from './UpgradeModal';
import { usePlan } from '../hooks/usePlan';

const UpgradeContext = createContext(null);

export function UpgradeProvider({ children }) {
  const { plan } = usePlan();
  const [open, setOpen] = useState(false);
  const [originFeature, setOriginFeature] = useState(null);

  const trigger = useCallback((feature) => {
    setOriginFeature(feature || null);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const selectPlan = useCallback((targetPlan) => {
    // Placeholder: integrate billing redirect here
    console.log('Selected plan', targetPlan, 'origin feature', originFeature);
    setOpen(false);
  }, [originFeature]);

  useEffect(() => {
    function handler(e) {
      trigger(e.detail?.feature);
    }
    window.addEventListener('open-upgrade-modal', handler);
    return () => window.removeEventListener('open-upgrade-modal', handler);
  }, [trigger]);

  return (
    <UpgradeContext.Provider value={{ open, trigger, close }}>
      {children}
      <UpgradeModal open={open} currentPlan={plan} onClose={close} onSelectPlan={selectPlan} />
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  return useContext(UpgradeContext);
}
