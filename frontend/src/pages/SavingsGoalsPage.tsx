/**
 * SavingsGoalsPage — the Savings Goals experience.
 *
 * Architecture:
 *  - All state & business logic lives in the useSavingsGoals hook
 *  - SavingsSummary:    four derived headline statistics
 *  - SavingsGoalGrid:   responsive grid of SavingsGoalCard
 *  - SavingsGoalModal:  create + edit (one reusable modal)
 *  - ContributionModal: "Add Money"
 *  - DeleteGoalDialog:  confirmation before a permanent delete
 *  - SavingsGoalDetailModal: single-goal view (GET /savings-goals/:id)
 *  - Loading: skeleton summary + cards · Empty: illustrated state · Error: retry
 *  - Toast feedback through the shared ToastContainer
 */

import { useSavingsGoals, type GoalFilter } from '@/hooks/useSavingsGoals';

import SavingsSummary          from '@/components/savings/SavingsSummary';
import SavingsGoalGrid         from '@/components/savings/SavingsGoalGrid';
import SavingsGoalModal        from '@/components/savings/SavingsGoalModal';
import ContributionModal       from '@/components/savings/ContributionModal';
import DeleteGoalDialog        from '@/components/savings/DeleteGoalDialog';
import SavingsGoalDetailModal  from '@/components/savings/SavingsGoalDetailModal';
import SavingsEmptyState       from '@/components/savings/SavingsEmptyState';
import SavingsSkeleton         from '@/components/savings/SavingsSkeleton';
import ToastContainer          from '@/components/transactions/ToastContainer';
import type { SavingsGoal }    from '@/types';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

// ─── Error fallback ────────────────────────────────────────────────────────────

interface SavingsErrorProps {
  message: string;
  onRetry: () => void;
}

const SavingsError = ({ message, onRetry }: SavingsErrorProps) => (
  <div className="sg-error" role="alert">
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="var(--color-danger-muted)" stroke="var(--color-danger-muted)" strokeWidth="2" />
      <path d="M24 14v12" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="32" r="2" fill="var(--color-danger)" />
    </svg>
    <h2 className="sg-error__title">Something went wrong</h2>
    <p className="sg-error__desc">{message}</p>
    <button type="button" className="btn btn--primary btn--md" onClick={onRetry}>
      Try again
    </button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const SavingsGoalsPage = () => {
  const {
    goals,
    filteredGoals,
    summary,
    isLoading,
    error,
    refetch,
    filter,
    setFilter,
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    detailGoal,
    detailLoading,
    detailError,
    openDetail,
    closeDetail,
    goalModalOpen,
    editingGoal,
    contributingGoal,
    deletingGoal,
    deleteLoading,
    openCreateModal,
    openEditModal,
    closeGoalModal,
    openContributeModal,
    closeContributeModal,
    openDeleteDialog,
    closeDeleteDialog,
    toasts,
    dismissToast,
  } = useSavingsGoals();

  const filterOptions: { value: GoalFilter; label: string; count: number }[] = [
    { value: 'all',       label: 'All',       count: summary.totalGoals },
    { value: 'Active',    label: 'Active',    count: summary.activeGoals },
    { value: 'Completed', label: 'Completed', count: summary.completedGoals },
  ];

  // Only one modal at a time — jumping from the detail view closes it first.
  const handleDetailEdit = (goal: SavingsGoal) => {
    closeDetail();
    openEditModal(goal);
  };

  const handleDetailContribute = (goal: SavingsGoal) => {
    closeDetail();
    openContributeModal(goal);
  };

  const handleDetailDelete = (goal: SavingsGoal) => {
    closeDetail();
    openDeleteDialog(goal);
  };

  const handleDeleteConfirm = () => {
    if (deletingGoal) void deleteGoal(deletingGoal.id);
  };

  const handleViewGoal = (goal: SavingsGoal) => {
    void openDetail(goal);
  };

  const showFilters = !error && !isLoading && goals.length > 0;

  return (
    <div className="page page-enter sg-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="page__header">
        <div>
          <h1 className="page__title">Savings Goals</h1>
          <p className="page__subtitle">Turn your plans into progress.</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--md sg-page__create-btn"
          onClick={openCreateModal}
          aria-label="Create a new savings goal"
        >
          <span className="btn__icon"><PlusIcon /></span>
          <span>Create Goal</span>
        </button>
      </div>

      {/* ── Summary ───────────────────────────────────────────────────────── */}
      {!isLoading && !error && <SavingsSummary summary={summary} />}

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="sg-page__toolbar">
          <div className="filter-bar" role="group" aria-label="Filter goals by status">
            {filterOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={['filter-btn', filter === option.value ? 'filter-btn--active' : ''].filter(Boolean).join(' ')}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                <span className="sg-page__filter-count">{option.count}</span>
              </button>
            ))}
          </div>
          <p className="sg-page__count" aria-live="polite">
            Showing {filteredGoals.length} of {goals.length} goal{goals.length === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {isLoading ? (
        <SavingsSkeleton count={4} />
      ) : error ? (
        <SavingsError message={error} onRetry={refetch} />
      ) : filteredGoals.length === 0 ? (
        <SavingsEmptyState
          filter={filter}
          onCreate={openCreateModal}
          onShowAll={() => setFilter('all')}
        />
      ) : (
        <SavingsGoalGrid
          goals={filteredGoals}
          onView={handleViewGoal}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          onContribute={openContributeModal}
        />
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <SavingsGoalModal
        open={goalModalOpen}
        onClose={closeGoalModal}
        editingGoal={editingGoal}
        onCreate={createGoal}
        onUpdate={updateGoal}
      />

      <ContributionModal
        open={Boolean(contributingGoal)}
        goal={contributingGoal}
        onClose={closeContributeModal}
        onSubmit={contributeToGoal}
      />

      <DeleteGoalDialog
        open={Boolean(deletingGoal)}
        goal={deletingGoal}
        loading={deleteLoading}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <SavingsGoalDetailModal
        open={Boolean(detailGoal)}
        goal={detailGoal}
        loading={detailLoading}
        error={detailError}
        onClose={closeDetail}
        onEdit={handleDetailEdit}
        onDelete={handleDetailDelete}
        onContribute={handleDetailContribute}
      />

      {/* ── Toasts ────────────────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default SavingsGoalsPage;
