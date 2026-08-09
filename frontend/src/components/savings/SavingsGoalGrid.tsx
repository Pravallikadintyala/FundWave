/**
 * SavingsGoalGrid — responsive grid of goal cards.
 *
 * Active goals are surfaced before completed/archived ones so the things the
 * user is still working towards stay at the top of the page.
 */

import { useMemo } from 'react';
import SavingsGoalCard from '@/components/savings/SavingsGoalCard';
import type { SavingsGoal } from '@/types';

const STATUS_WEIGHT: Record<SavingsGoal['status'], number> = {
  Active: 0,
  Completed: 1,
  Archived: 2,
};

interface SavingsGoalGridProps {
  goals:        SavingsGoal[];
  onView:       (goal: SavingsGoal) => void;
  onEdit:       (goal: SavingsGoal) => void;
  onDelete:     (goal: SavingsGoal) => void;
  onContribute: (goal: SavingsGoal) => void;
}

const SavingsGoalGrid = ({
  goals,
  onView,
  onEdit,
  onDelete,
  onContribute,
}: SavingsGoalGridProps) => {
  const ordered = useMemo(
    () => [...goals].sort((a, b) => STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status]),
    [goals],
  );

  return (
    <div className="goals-grid" role="list" aria-label="Savings goals">
      {ordered.map(goal => (
        <div role="listitem" key={goal.id}>
          <SavingsGoalCard
            goal={goal}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onContribute={onContribute}
          />
        </div>
      ))}
    </div>
  );
};

export default SavingsGoalGrid;
