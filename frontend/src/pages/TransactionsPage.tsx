/**
 * TransactionsPage — the most important feature page in FundWave.
 *
 * Architecture:
 *  - All business logic lives in useTransactions hook
 *  - Desktop: sticky-header table (TransactionTable)
 *  - Mobile:  card list (TransactionCard)
 *  - Filtering / search via TransactionToolbar
 *  - Add / Edit via TransactionModal
 *  - Delete via DeleteDialog
 *  - Toast feedback via ToastContainer
 *  - Loading: skeleton rows
 *  - Empty: beautiful illustrated state
 */

import { useTransactions } from '@/hooks/useTransactions';

import TransactionToolbar   from '@/components/transactions/TransactionToolbar';
import TransactionTable     from '@/components/transactions/TransactionTable';
import TransactionCard      from '@/components/transactions/TransactionCard';
import TransactionModal     from '@/components/transactions/TransactionModal';
import DeleteDialog         from '@/components/transactions/DeleteDialog';
import Pagination           from '@/components/transactions/Pagination';
import EmptyTransactions    from '@/components/transactions/EmptyTransactions';
import LoadingSkeleton      from '@/components/transactions/LoadingSkeleton';
import ToastContainer       from '@/components/transactions/ToastContainer';

// ─── Add button icon ───────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

// ─── Error fallback ────────────────────────────────────────────────────────────

interface TxErrorProps { message: string; onRetry: () => void }
const TxError = ({ message, onRetry }: TxErrorProps) => (
  <div className="tx-page-error">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="var(--color-danger-muted)" strokeWidth="2" fill="var(--color-danger-muted)" />
      <path d="M24 14v12" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="32" r="2" fill="var(--color-danger)" />
    </svg>
    <h2 className="tx-page-error__title">Failed to load transactions</h2>
    <p className="tx-page-error__desc">{message}</p>
    <button type="button" className="btn btn--primary btn--md" onClick={onRetry}>
      Try again
    </button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const TransactionsPage = () => {
  const {
    // data
    transactions,
    categories,
    isLoading,
    error,
    refetch,
    // filtered & paginated
    filtered,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    // filters
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    // CRUD
    createTransaction,
    updateTransaction,
    deleteTransaction,
    // modal state
    modalOpen,
    editingTx,
    deletingTx,
    deleteLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteDialog,
    closeDeleteDialog,
    // toasts
    toasts,
    dismissToast,
  } = useTransactions();

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleModalSubmit = editingTx
    ? (payload: Parameters<typeof updateTransaction>[1]) =>
        updateTransaction(editingTx.id, payload)
    : (payload: Parameters<typeof createTransaction>[0]) =>
        createTransaction(payload);

  const handleDeleteConfirm = () => {
    if (deletingTx) void deleteTransaction(deletingTx.id);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="page page-enter tx-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="page__header">
        <div>
          <h1 className="page__title">Transactions</h1>
          <p className="page__subtitle">Track every rupee with clarity.</p>
        </div>
        <button
          type="button"
          id="add-transaction-btn"
          className="btn btn--primary btn--md tx-page__add-btn"
          onClick={openCreateModal}
          aria-label="Add new transaction"
        >
          <span className="btn__icon"><PlusIcon /></span>
          <span>Add Transaction</span>
        </button>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && !isLoading && (
        <TxError message={error} onRetry={refetch} />
      )}

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      {!error && (
        <TransactionToolbar
          filters={filters}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={v    => updateFilter('search', v)}
          onTypeChange={v      => updateFilter('type', v)}
          onCategoryChange={v  => updateFilter('category', v)}
          onStartDateChange={v => updateFilter('startDate', v)}
          onEndDateChange={v   => updateFilter('endDate', v)}
          onSortChange={v      => updateFilter('sort', v)}
          onClearFilters={clearFilters}
          totalCount={transactions.length}
          filteredCount={filtered.length}
        />
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="tx-page__content">
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : !error && filtered.length === 0 ? (
          <EmptyTransactions
            hasFilters={hasActiveFilters}
            onAdd={openCreateModal}
            onClear={clearFilters}
          />
        ) : !error && (
          <>
            {/* Desktop table */}
            <div className="tx-page__table">
              <TransactionTable
                transactions={paginated}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
              />
            </div>

            {/* Mobile cards */}
            <div className="tx-page__cards" aria-label="Transactions">
              {paginated.map(tx => (
                <TransactionCard
                  key={tx.id}
                  tx={tx}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setCurrentPage}
              totalItems={filtered.length}
              pageSize={15}
            />
          </>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <TransactionModal
        open={modalOpen}
        onClose={closeModal}
        editingTx={editingTx}
        categories={categories}
        onSubmit={handleModalSubmit}
        isEdit={Boolean(editingTx)}
      />

      <DeleteDialog
        open={Boolean(deletingTx)}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        tx={deletingTx}
      />

      {/* ── Toasts ────────────────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default TransactionsPage;
