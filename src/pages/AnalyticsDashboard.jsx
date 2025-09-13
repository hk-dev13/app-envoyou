import React, { useState } from 'react';
import LockedModule from '../components/LockedModule';
import { usePlan } from '../hooks/usePlan';
import ThemeToggle from '../components/ThemeToggle.jsx';

function ToggleMode({ mode, onChange }) {
  return (
    <div className="inline-flex items-center rounded border border-[#1f2a33] bg-[#11161d] overflow-hidden">
      {['investor','company'].map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1.5 text-[10px] tracking-wide transition-colors font-medium ${mode===m ? 'text-primary' : 'text-secondary hover:text-primary'}`}
        >{m === 'investor' ? 'INVESTOR' : 'COMPANY'}</button>
      ))}
    </div>
  );
}

function PortfolioAggregation() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">PORTFOLIO AGGREGATION</h3>
      <p className="text-[10px] muted mb-3">Weighted composite across holdings.</p>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">chart</div>
    </div>
  );
}

function RiskOutliers() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">RISK OUTLIERS</h3>
      <ul className="text-[10px] text-secondary space-y-1">
        <li>CO2 intensity high · COMP-23</li>
        <li>Water usage spike · COMP-11</li>
        <li>Low governance score · COMP-07</li>
      </ul>
      <div className="h-20 rounded mt-3 flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">dist plot</div>
    </div>
  );
}

function ScenarioAnalysis() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">SCENARIO ANALYSIS</h3>
      <div className="space-y-2 text-[10px] text-secondary">
        <p>Carbon +30% → score -1.8</p>
        <p>Reg delay 6m → risk +0.7</p>
        <p>Intensity -5% YoY → score +2.3</p>
      </div>
      <button className="mt-3 w-full btn btn-outline">Custom Scenario</button>
    </div>
  );
}

function FacilityBreakdown() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">FACILITY BREAKDOWN</h3>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">heatmap</div>
    </div>
  );
}

function CrossFacilityBenchmark() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">FACILITY BENCHMARK</h3>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">ranking</div>
    </div>
  );
}

function EfficiencyOpportunities() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">EFFICIENCY OPS</h3>
      <ul className="text-[10px] text-secondary space-y-1">
        <li>Cooling cycle adj → water -8%</li>
        <li>Boiler tuning → CO2e -3%</li>
        <li>LED retrofit P4 → energy -5%</li>
      </ul>
      <button className="mt-3 w-full btn btn-primary">Full List</button>
    </div>
  );
}

function TargetsProgress() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">TARGETS</h3>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">forecast</div>
      <p className="text-[10px] mt-2 text-secondary">2025 target -7% (now -4.2%)</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [mode, setMode] = useState('investor');
  const { plan, featureInfo } = usePlan();
  const portfolio = featureInfo('analyticsPortfolio');
  const scenario = featureInfo('analyticsScenario');
  const facility = featureInfo('facilityBenchmark');
  const efficiency = featureInfo('efficiencyOpportunities');

  function openUpgrade() { console.log('Upgrade clicked from AnalyticsDashboard'); }

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p className="subtext">Unified {mode === 'investor' ? 'portfolio' : 'operational'} intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleMode mode={mode} onChange={setMode} />
            <ThemeToggle compact />
          </div>
        </div>
        {mode === 'investor' ? (
          <div className="grid-gap md:grid-cols-2 lg:grid-cols-3 mb-6">
            {portfolio.enabled ? <PortfolioAggregation /> : (
              <LockedModule required={portfolio.required} current={plan} onUpgrade={openUpgrade}><PortfolioAggregation /></LockedModule>
            )}
            <RiskOutliers />
            {scenario.enabled ? <ScenarioAnalysis /> : (
              <LockedModule required={scenario.required} current={plan} onUpgrade={openUpgrade}><ScenarioAnalysis /></LockedModule>
            )}
          </div>
        ) : (
          <div className="grid-gap md:grid-cols-2 lg:grid-cols-3 mb-6">
            {facility.enabled ? <FacilityBreakdown /> : (
              <LockedModule required={facility.required} current={plan} onUpgrade={openUpgrade}><FacilityBreakdown /></LockedModule>
            )}
            <CrossFacilityBenchmark />
            {efficiency.enabled ? <EfficiencyOpportunities /> : (
              <LockedModule required={efficiency.required} current={plan} onUpgrade={openUpgrade}><EfficiencyOpportunities /></LockedModule>
            )}
            <TargetsProgress />
          </div>
        )}
      </div>
    </div>
  );
}
