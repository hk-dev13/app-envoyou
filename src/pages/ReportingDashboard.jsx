import React from 'react';
import LockedModule from '../components/LockedModule';
import { usePlan } from '../hooks/usePlan';

function ExportCard({ framework }) {
  return (
    <div className="panel app-card flex flex-col">
      <h3 className="text-xs font-semibold mb-1 tracking-wide">{framework.toUpperCase()} EXPORT</h3>
      <p className="text-[10px] muted mb-4">Generate structured bundle.</p>
      <button className="mt-auto btn btn-primary">Generate</button>
    </div>
  );
}

function RecentExports() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">RECENT EXPORTS</h3>
      <ul className="text-[10px] text-secondary space-y-2">
        <li className="flex items-center justify-between"><span>GRI 2025 Q2</span><span className="muted">32 MB</span></li>
        <li className="flex items-center justify-between"><span>SASB 2025 Q2</span><span className="muted">28 MB</span></li>
        <li className="flex items-center justify-between"><span>CSRD Draft 2025</span><span className="muted">41 MB</span></li>
      </ul>
      <button className="mt-4 w-full btn btn-outline">View All</button>
    </div>
  );
}

function WebhookConfig() {
  return (
    <div className="panel app-card col-span-2">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">WEBHOOK DELIVERY</h3>
      <p className="text-[10px] muted mb-4">Push bundles to downstream systems.</p>
      <div className="space-y-3 text-[10px] text-secondary">
        <div className="flex items-center justify-between">
          <span>https://ingest.company.com/envoyou/report-hook</span>
          <span className="status-chip active">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between">
          <span>https://data.company.com/csrd</span>
          <span className="status-chip">PAUSED</span>
        </div>
      </div>
      <button className="mt-4 btn btn-primary">Add Webhook</button>
    </div>
  );
}

function TaxonomyMapping() {
  return (
    <div className="panel app-card">
      <h3 className="text-xs font-semibold mb-2 tracking-wide">TAXONOMY MAPPING</h3>
      <div className="h-32 rounded flex items-center justify-center text-[10px] text-secondary bg-[#11161d] border border-[#1f2a33]">diff</div>
      <button className="mt-4 w-full btn btn-outline">Details</button>
    </div>
  );
}

export default function ReportingDashboard() {
  const { plan, featureInfo } = usePlan();
  const exportsFeature = featureInfo('reportingExports');
  const taxonomy = featureInfo('taxonomyMapping');
  const webhooks = featureInfo('webhookDelivery');

  function openUpgrade() { console.log('Upgrade clicked from ReportingDashboard'); }

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="page-header">
          <div>
            <h1>Reporting & Disclosure</h1>
            <p className="subtext">Accelerate multi-framework exports</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">History</button>
            <button className="btn btn-primary">Settings</button>
          </div>
        </div>
        <div className="grid-gap md:grid-cols-2 lg:grid-cols-4 mb-6">
          {exportsFeature.enabled ? <ExportCard framework="GRI" /> : (
            <LockedModule required={exportsFeature.required} current={plan} onUpgrade={openUpgrade}><ExportCard framework="GRI" /></LockedModule>
          )}
          {exportsFeature.enabled ? <ExportCard framework="SASB" /> : (
            <LockedModule required={exportsFeature.required} current={plan} onUpgrade={openUpgrade}><ExportCard framework="SASB" /></LockedModule>
          )}
          {exportsFeature.enabled ? <ExportCard framework="CSRD" /> : (
            <LockedModule required={exportsFeature.required} current={plan} onUpgrade={openUpgrade}><ExportCard framework="CSRD" /></LockedModule>
          )}
          {taxonomy.enabled ? <TaxonomyMapping /> : (
            <LockedModule required={taxonomy.required} current={plan} onUpgrade={openUpgrade}><TaxonomyMapping /></LockedModule>
          )}
        </div>
        <div className="grid-gap grid-cols-1 lg:grid-cols-3 mb-6">
          {webhooks.enabled ? <WebhookConfig /> : (
            <LockedModule required={webhooks.required} current={plan} onUpgrade={openUpgrade}><WebhookConfig /></LockedModule>
          )}
          <RecentExports />
        </div>
      </div>
    </div>
  );
}
