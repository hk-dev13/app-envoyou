import { useMemo } from 'react';
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
  const plan = derivePlan(user);
  const limits = LIMITS_BY_TIER[plan];

  function hasFeature(featureKey) {
    const required = FEATURE_MIN_TIER[featureKey] || 'FREE';
    return tierRank(plan) >= tierRank(required);
  }

  function featureInfo(featureKey) {
    const required = FEATURE_MIN_TIER[featureKey] || 'FREE';
    return { required, enabled: hasFeature(featureKey) };
  }

  const value = useMemo(() => ({ plan, limits, hasFeature, featureInfo, tiers: TIERS }), [plan]);
  return value;
}
