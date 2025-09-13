import React, { Suspense } from 'react';

// Chart is optional; only load when actually rendered.
const ChartImpl = React.lazy(() => import('./charts/ChartImpl.jsx'));

export default function LazyChart(props) {
  return (
    <Suspense fallback={<div className="text-[10px] text-secondary">Loading chart…</div>}>
      <ChartImpl {...props} />
    </Suspense>
  );
}
