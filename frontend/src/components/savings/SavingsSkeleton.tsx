/**
 * SavingsSkeleton — loading placeholder that mirrors the real layout:
 * four summary tiles + a grid of goal cards. No full-page spinner.
 *
 * Reuses the shared `txskel__*` skeleton primitives from the design system.
 */

interface SavingsSkeletonProps {
  /** How many placeholder cards to show. */
  count?: number;
}

const SummaryTileSkeleton = () => (
  <div className="savings-summary-item savings-summary-item--skeleton">
    <div className="txskel__line" style={{ width: '55%' }} />
    <div className="txskel__line txskel__line--bold" style={{ width: '70%', height: 26 }} />
    <div className="txskel__line txskel__line--sm" style={{ width: '40%' }} />
  </div>
);

const GoalCardSkeleton = () => (
  <div className="goal-card goal-card--skeleton">
    <div className="goal-card__top">
      <div className="goal-card__identity">
        <div className="txskel__circle" style={{ width: 40, height: 40 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="txskel__line" style={{ width: '60%' }} />
          <div className="txskel__line txskel__line--sm" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="txskel__badge" />
    </div>

    <div className="txskel__line txskel__line--bold" style={{ width: '55%', height: 22 }} />
    <div className="txskel__line" style={{ width: '100%', height: 8 }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <div className="txskel__line txskel__line--sm" style={{ width: 90 }} />
      <div className="txskel__line txskel__line--sm" style={{ width: 110 }} />
    </div>

    <div className="goal-card__stats">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="goal-card__stat">
          <div className="txskel__line txskel__line--sm" style={{ width: 46 }} />
          <div className="txskel__line" style={{ width: 62, marginTop: 8 }} />
        </div>
      ))}
    </div>

    <div className="goal-card__actions">
      <div className="txskel__line" style={{ width: 120, height: 32, borderRadius: 8 }} />
      <div className="txskel__actions">
        <div className="txskel__btn" />
        <div className="txskel__btn" />
        <div className="txskel__btn" />
      </div>
    </div>
  </div>
);

const SavingsSkeleton = ({ count = 4 }: SavingsSkeletonProps) => (
  <>
    <div className="savings-summary-strip" aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => <SummaryTileSkeleton key={i} />)}
    </div>

    <div className="goals-grid" aria-busy="true" aria-label="Loading savings goals">
      {Array.from({ length: count }, (_, i) => <GoalCardSkeleton key={i} />)}
    </div>
  </>
);

export default SavingsSkeleton;
