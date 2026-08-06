/**
 * DashboardSkeleton — full-page professional skeleton loader.
 *
 * Mirrors the layout of the real dashboard so the transition feels smooth.
 * No spinners — uses pulsing blocks.
 */

import { Skeleton } from '@/components/ui';

const CardSkeleton = ({ height = 200 }: { height?: number }) => (
  <div className="skeleton skeleton--card" style={{ height, borderRadius: 'var(--radius-xl)' }} />
);

const DashboardSkeleton = () => (
  <div className="db-skeleton" aria-busy="true" aria-label="Loading dashboard">
    {/* Header */}
    <div className="db-skeleton__header">
      <Skeleton variant="line" width={240} height={28} />
      <Skeleton variant="line" width={160} height={14} />
    </div>

    {/* KPI grid */}
    <div className="kpi-grid">
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} height={116} />
      ))}
    </div>

    {/* Charts row */}
    <div className="db-charts-grid">
      <CardSkeleton height={320} />
      <CardSkeleton height={320} />
    </div>

    {/* Bottom row */}
    <div className="db-bottom-grid">
      <CardSkeleton height={280} />
      <CardSkeleton height={280} />
    </div>
  </div>
);

export default DashboardSkeleton;
