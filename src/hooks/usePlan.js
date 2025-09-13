import { useMemo, useEffect, useState } from 'react';
import { FEATURE_MIN_TIER, LIMITS_BY_TIER, TIERS, tierRank } from '../config/plans';
import { useAuth } from './useAuth';

// Temporary mapping user email domain or metadata to plan
function derivePlan(user) {
  // Placeholder logic: enterprise if email ends with corporate domain sample
  if (!user) return 'FREE';
  if (user?.email?.endsWith('@envoyou.com')) return 'ENTERPRISE';
  return 'FREE';
}

export function usePlan() {
  const { user } = useAuth();
  const [remotePlan, setRemotePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // derive fallback while remote not loaded
  const fallbackPlan = derivePlan(user);

  useEffect(() => {
    if (!user) {
      setRemotePlan(null);
      return;
    }
    let abort = false;
    async function fetchPlan() {
      setLoading(true); setError(null);
      try {
        const res = await fetch('/api/plan', { headers: { 'Accept': 'application/json' }, credentials: 'include' });
        if (!res.ok) throw new Error('plan request failed ' + res.status);
        const data = await res.json();
        if (!abort) setRemotePlan(data.plan || data.tier || fallbackPlan);
      } catch (e) {
        if (!abort) setError(e.message);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    fetchPlan();
    return () => { abort = true; };
  }, [user]);

  const plan = remotePlan || fallbackPlan;
  const limits = LIMITS_BY_TIER[plan];

  function hasFeature(featureKey) {
    const required = FEATURE_MIN_TIER[featureKey] || 'FREE';
    return tierRank(plan) >= tierRank(required);
  }

  function featureInfo(featureKey) {
    const required = FEATURE_MIN_TIER[featureKey] || 'FREE';
    return { required, enabled: hasFeature(featureKey) };
  }

  const value = useMemo(() => ({ plan, limits, hasFeature, featureInfo, tiers: TIERS, loadingPlan: loading, planError: error, remote: !!remotePlan }), [plan, loading, error, remotePlan]);
  return value;
}
