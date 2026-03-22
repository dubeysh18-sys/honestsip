import React, { Suspense, lazy } from 'react';

const GrowthChartInner = lazy(() => import('./GrowthChartInner'));

export default function GrowthChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Suspense
      fallback={
        <div className="mt-6">
          <p className="label-overline mb-3 text-on-surface-var">Year-by-Year Growth</p>
          <div className="min-h-[220px] w-full animate-pulse rounded-lg bg-surface-highest/20" />
        </div>
      }
    >
      <GrowthChartInner data={data} />
    </Suspense>
  );
}
