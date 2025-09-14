import React from 'react';
import { Link } from 'react-router-dom';
import LockedModule from '../components/LockedModule';
import { usePlan } from '../hooks/usePlan';
import ThemeToggle from '../components/ThemeToggle.jsx';
import PlanStatus from '../components/PlanStatus.jsx';

// Placeholder components (replace with real implementations later)
function CEVSScorePanel() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold text-primary mb-2 tracking-wide">CEVS SCORE</h3>
      <div className="metric-large">78.4</div>
      <p className="text-[10px] muted mt-1">+2.1 vs last period • 84th percentile</p>
      <div className="h-14 mt-4 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">sparkline</div>
    </div>
  );
}

function CompetitorComparisonPanel() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">BENCHMARKS</h3>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">radar/bars</div>
      <ul className="mt-3 space-y-1 text-[10px] font-mono text-secondary">
        <li>YOU 78.4</li>
        <li>PEER1 72.9</li>
        <li>PEER2 69.3</li>
        <li>IND 70.1</li>
      </ul>
    </div>
  );
}

function AlertsPanel() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 flex items-center justify-between tracking-wide">ALERTS <Link to="/developer/rate-limits" className="text-[10px] text-primary hover:underline">manage</Link></h3>
      <ul className="space-y-2 text-[10px] text-secondary">
        <li className="flex items-start justify-between">
          <span>Water discharge &gt; 120 ppm</span><span className="status-chip active">TRIGGERED</span>
        </li>
        <li className="flex items-start justify-between">
          <span>CEVS drop &gt; 5% / 24h</span><span className="status-chip">WATCH</span>
        </li>
        <li className="flex items-start justify-between">
          <span>New regulation: EU Wastewater</span><span className="status-chip active">NEW</span>
        </li>
      </ul>
      <button className="mt-4 w-full btn btn-primary">Create Alert</button>
    </div>
  );
}

function RegulationsFeed() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">REGULATORY</h3>
      <div className="space-y-3 text-[10px] text-secondary">
        <div>
          <p className="font-medium text-primary">EU Water Directive Update</p>
          <p>Scope expansion for discharge reporting (Q4 2025)</p>
        </div>
        <div>
          <p className="font-medium text-primary">US EPA Baseline Adjustment</p>
          <p>Revised CO2e intensity method</p>
        </div>
        <div>
          <p className="font-medium text-primary">APAC Disclosure Draft</p>
          <p>Consultation open until Nov 15</p>
        </div>
      </div>
      <button className="mt-4 w-full btn btn-outline">View All</button>
    </div>
  );
}

function FacilityDrilldown() {
  return (
    <div className="panel app-card col-span-full">
      <h3 className="text-xs font-semibold mb-3 tracking-wide">FACILITY DRILLDOWN</h3>
      <div className="h-48 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">map / table</div>
    </div>
  );
}

export default function MonitoringDashboard() {
  const { plan, featureInfo } = usePlan();
  const bench = featureInfo('benchmarks');
  const alerts = featureInfo('alerts');

  function openUpgrade() {
    console.log('Upgrade clicked from MonitoringDashboard');
    // Future: open modal
  }

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="page-header">
          <div>
            <h1>ESG Monitoring</h1>
            <p className="subtext">Real-time awareness & mitigation</p>
          </div>
          <div className="flex gap-2 items-center">
            <PlanStatus compact />
            <button className="btn btn-outline">Refresh</button>
            <button className="btn btn-primary">Configure</button>
            <ThemeToggle compact />
          </div>
        </div>
        <div className="grid-gap md:grid-cols-2 lg:grid-cols-4 mb-6">
          <CEVSScorePanel />
          {bench.enabled ? <CompetitorComparisonPanel /> : (
            <LockedModule featureKey="benchmarks" required={bench.required} current={plan} onUpgrade={openUpgrade}>
              <CompetitorComparisonPanel />
            </LockedModule>
          )}
          {alerts.enabled ? <AlertsPanel /> : (
            <LockedModule featureKey="alerts" required={alerts.required} current={plan} onUpgrade={openUpgrade}>
              <AlertsPanel />
            </LockedModule>
          )}
          <RegulationsFeed />
        </div>
        <div className="grid-gap grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <FacilityDrilldown />
        </div>
      </div>
    </div>
  );
}
