/**
 * Pagination — simple, accessible prev/next + numbered page buttons.
 */

import type { Dispatch, SetStateAction } from 'react';

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 4L6 8l4 4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 4l4 4-4 4" />
  </svg>
);

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  setPage:      Dispatch<SetStateAction<number>>;
  totalItems:   number;
  pageSize:     number;
}

const Pagination = ({ currentPage, totalPages, setPage, totalItems, pageSize }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalItems);

  // Compute which page numbers to show: always first, last, and up to 3 around current
  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__info">
        {start}–{end} of {totalItems}
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          onClick={() => setPage(p => p - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis" aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={['pagination__btn', currentPage === p ? 'pagination__btn--active' : ''].filter(Boolean).join(' ')}
              onClick={() => setPage(p as number)}
              aria-label={`Page ${p}`}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination__btn"
          onClick={() => setPage(p => p + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
