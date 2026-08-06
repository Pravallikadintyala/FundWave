import { Card, CardBody, EmptyState, Badge } from '@/components/ui';

const GoalIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="14" />
    <circle cx="20" cy="20" r="8" />
    <circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const mockGoalColors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-secondary)', 'var(--color-warning)'];

const GoalCardPlaceholder = ({ index }: { index: number }) => (
  <Card variant="default" padding="lg" hover className="goal-card">
    <div className="goal-card__color-bar" style={{ background: mockGoalColors[index % mockGoalColors.length] }} />
    <CardBody>
      <div className="goal-card__header">
        <div className="goal-card__icon" style={{ color: mockGoalColors[index % mockGoalColors.length] }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="8" />
            <circle cx="10" cy="10" r="4" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <Badge variant="neutral" size="sm">Active</Badge>
      </div>
      <h3 className="goal-card__title">Example Goal {index + 1}</h3>
      <p className="goal-card__amounts">₹0 <span>of ₹10,000</span></p>
      <div className="progress-bar-track" style={{ marginTop: 'var(--space-3)' }}>
        <div className="progress-bar-fill" style={{ width: '0%', background: mockGoalColors[index % mockGoalColors.length] }} />
      </div>
      <p className="goal-card__percent caption">0% complete</p>
    </CardBody>
  </Card>
);

const SavingsGoalsPage = () => (
  <div className="page page-enter">
    <div className="page__header">
      <div>
        <h1 className="page__title">Savings Goals</h1>
        <p className="page__subtitle">Track and manage your financial milestones.</p>
      </div>
    </div>

    {/* Summary strip */}
    <div className="savings-summary-strip">
      {[
        { label: 'Total Goals', value: '0' },
        { label: 'Active',      value: '0' },
        { label: 'Completed',   value: '0' },
        { label: 'Total Saved', value: '₹0' },
      ].map(s => (
        <div key={s.label} className="savings-summary-item">
          <span className="savings-summary-item__value">{s.value}</span>
          <span className="savings-summary-item__label">{s.label}</span>
        </div>
      ))}
    </div>

    {/* Goals grid */}
    <div className="goals-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <GoalCardPlaceholder key={i} index={i} />
      ))}
    </div>

    {/* True empty state */}
    <Card variant="bordered" padding="lg" style={{ marginTop: 'var(--space-6)' }}>
      <CardBody>
        <EmptyState
          icon={<GoalIcon />}
          title="No savings goals yet"
          description="Create your first goal to start saving towards what matters most."
        />
      </CardBody>
    </Card>
  </div>
);

export default SavingsGoalsPage;
