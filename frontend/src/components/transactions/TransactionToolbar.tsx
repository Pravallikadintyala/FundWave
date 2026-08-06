/**
 * TransactionToolbar — search, type filter, category filter, date range, sort.
 *
 * Collapses elegantly on mobile: all filters live in a toggleable row.
 */

import { useId, useRef, useState } from 'react';
import type { TxFilters, TxTypeFilter, SortOption } from '@/hooks/useTransactions';
import type { Category } from '@/types';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 4h12M4 8h8M6 12h4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 5l4 4 4-4" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 3L3 11M3 3l8 8" />
  </svg>
);

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TransactionToolbarProps {
  filters: TxFilters;
  categories: Category[];
  hasActiveFilters: boolean;
  onSearchChange:    (v: string) => void;
  onTypeChange:      (v: TxTypeFilter) => void;
  onCategoryChange:  (v: string) => void;
  onStartDateChange: (v: string) => void;
  onEndDateChange:   (v: string) => void;
  onSortChange:      (v: SortOption) => void;
  onClearFilters:    () => void;
  totalCount:        number;
  filteredCount:     number;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const TypeButton = ({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: TxTypeFilter;
  active: boolean;
  onClick: (v: TxTypeFilter) => void;
}) => (
  <button
    type="button"
    className={['tx-toolbar__type-btn', active ? 'tx-toolbar__type-btn--active' : ''].filter(Boolean).join(' ')}
    onClick={() => onClick(value)}
    aria-pressed={active}
  >
    {label}
  </button>
);

// ─── Component ─────────────────────────────────────────────────────────────────

const TransactionToolbar = ({
  filters,
  categories,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: TransactionToolbarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);

  const typeOptions: { label: string; value: TxTypeFilter }[] = [
    { label: 'All',     value: 'all' },
    { label: 'Income',  value: 'Income' },
    { label: 'Expense', value: 'Expense' },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest first',   value: 'newest' },
    { label: 'Oldest first',   value: 'oldest' },
    { label: 'Highest amount', value: 'highest' },
    { label: 'Lowest amount',  value: 'lowest' },
  ];

  return (
    <div className="tx-toolbar">
      {/* ── Top row: search + toggle ─────────────────────────────────────── */}
      <div className="tx-toolbar__top">
        {/* Search */}
        <div className="tx-toolbar__search-wrap">
          <span className="tx-toolbar__search-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            ref={searchRef}
            id={searchId}
            type="search"
            placeholder="Search transactions…"
            className="tx-toolbar__search"
            value={filters.search}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search transactions"
          />
          {filters.search && (
            <button
              type="button"
              className="tx-toolbar__search-clear"
              onClick={() => { onSearchChange(''); searchRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Count badge */}
        <span className="tx-toolbar__count" aria-live="polite">
          {filteredCount === totalCount
            ? `${totalCount} transaction${totalCount !== 1 ? 's' : ''}`
            : `${filteredCount} of ${totalCount}`}
        </span>

        {/* Mobile filter toggle */}
        <button
          type="button"
          className={['tx-toolbar__filter-toggle', filtersOpen ? 'tx-toolbar__filter-toggle--open' : ''].filter(Boolean).join(' ')}
          onClick={() => setFiltersOpen(p => !p)}
          aria-expanded={filtersOpen}
          aria-label="Toggle filters"
        >
          <FilterIcon />
          Filters
          {hasActiveFilters && <span className="tx-toolbar__filter-dot" aria-hidden="true" />}
          <ChevronDownIcon />
        </button>
      </div>

      {/* ── Filter row ───────────────────────────────────────────────────── */}
      <div className={['tx-toolbar__filters', filtersOpen ? 'tx-toolbar__filters--open' : ''].filter(Boolean).join(' ')}>
        {/* Type chips */}
        <div className="tx-toolbar__type-group" role="group" aria-label="Filter by type">
          {typeOptions.map(o => (
            <TypeButton key={o.value} label={o.label} value={o.value} active={filters.type === o.value} onClick={onTypeChange} />
          ))}
        </div>

        {/* Category */}
        <select
          className="tx-toolbar__select"
          value={filters.category}
          onChange={e => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="tx-toolbar__date-range">
          <input
            type="date"
            className="tx-toolbar__date"
            value={filters.startDate}
            onChange={e => onStartDateChange(e.target.value)}
            aria-label="Start date"
            max={filters.endDate || undefined}
          />
          <span className="tx-toolbar__date-sep">—</span>
          <input
            type="date"
            className="tx-toolbar__date"
            value={filters.endDate}
            onChange={e => onEndDateChange(e.target.value)}
            aria-label="End date"
            min={filters.startDate || undefined}
          />
        </div>

        {/* Sort */}
        <select
          className="tx-toolbar__select"
          value={filters.sort}
          onChange={e => onSortChange(e.target.value as SortOption)}
          aria-label="Sort transactions"
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            className="tx-toolbar__clear"
            onClick={onClearFilters}
          >
            <XIcon />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionToolbar;
