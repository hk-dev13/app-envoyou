export const TIERS = ['FREE', 'BUILD', 'SCALE', 'ENTERPRISE'];

export const FEATURE_MIN_TIER = {
  alerts: 'BUILD',
  benchmarks: 'BUILD',
  analyticsPortfolio: 'BUILD',
  analyticsScenario: 'SCALE',
  facilityBenchmark: 'BUILD',
  efficiencyOpportunities: 'SCALE',
  reportingExports: 'SCALE',
  taxonomyMapping: 'SCALE',
  webhookDelivery: 'SCALE',
  advancedMappings: 'ENTERPRISE',
  anomalyDetection: 'ENTERPRISE'
};

export const LIMITS_BY_TIER = {
  FREE: { monthlyCalls: 5000, alertRules: 2, apiKeys: 2, exports: 1 },
  BUILD: { monthlyCalls: 50000, alertRules: 10, apiKeys: 5, exports: 5 },
  SCALE: { monthlyCalls: 250000, alertRules: 50, apiKeys: 10, exports: 25 },
  ENTERPRISE: { monthlyCalls: Infinity, alertRules: Infinity, apiKeys: 25, exports: Infinity }
};

export function tierRank(tier) {
  return TIERS.indexOf(tier);
}
