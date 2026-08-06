/**
 * LoadingSkeleton — skeleton rows for the transaction table / card list.
 *
 * Shows realistic placeholder rows instead of a plain spinner.
 */

interface LoadingSkeletonProps {
  count?: number;
}

// ─── Table skeleton row ─────────────────────────────────────────────────────────

const TableSkeletonRow = ({ index }: { index: number }) => (
  <tr className="txskel__row" aria-hidden="true">
    <td className="txtable__td txtable__td--icon">
      <div className="txskel__circle" />
    </td>
    <td className="txtable__td">
      <div className="txskel__line" style={{ width: `${55 + (index % 3) * 15}%` }} />
    </td>
    <td className="txtable__td txtable__td--desc">
      <div className="txskel__line" style={{ width: `${40 + (index % 4) * 12}%` }} />
    </td>
    <td className="txtable__td txtable__td--amount">
      <div className="txskel__line txskel__line--bold" style={{ width: '80px' }} />
    </td>
    <td className="txtable__td">
      <div className="txskel__badge" />
    </td>
    <td className="txtable__td">
      <div className="txskel__line" style={{ width: '90px' }} />
    </td>
    <td className="txtable__td txtable__td--actions">
      <div className="txskel__actions">
        <div className="txskel__btn" />
        <div className="txskel__btn" />
      </div>
    </td>
  </tr>
);

// ─── Card skeleton ──────────────────────────────────────────────────────────────

const CardSkeletonItem = () => (
  <div className="txskel__card" aria-hidden="true">
    <div className="txskel__circle" />
    <div className="txskel__card-info">
      <div className="txskel__line" style={{ width: '60%' }} />
      <div className="txskel__line txskel__line--sm" style={{ width: '40%' }} />
    </div>
    <div className="txskel__card-right">
      <div className="txskel__line txskel__line--bold" style={{ width: '70px' }} />
      <div className="txskel__badge" />
    </div>
  </div>
);

// ─── Component ─────────────────────────────────────────────────────────────────

const LoadingSkeleton = ({ count = 8 }: LoadingSkeletonProps) => (
  <>
    {/* Desktop table skeleton */}
    <div className="txtable-wrap txskel--desktop" aria-busy="true" aria-label="Loading transactions">
      <table className="txtable">
        <thead className="txtable__head">
          <tr>
            <th className="txtable__th txtable__th--icon" />
            <th className="txtable__th">Category</th>
            <th className="txtable__th txtable__th--desc">Description</th>
            <th className="txtable__th txtable__th--amount">Amount</th>
            <th className="txtable__th">Type</th>
            <th className="txtable__th">Date</th>
            <th className="txtable__th txtable__th--actions" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: count }, (_, i) => (
            <TableSkeletonRow key={i} index={i} />
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile card skeleton */}
    <div className="txskel--mobile" aria-busy="true" aria-label="Loading transactions">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeletonItem key={i} />
      ))}
    </div>
  </>
);

export default LoadingSkeleton;
