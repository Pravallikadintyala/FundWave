import type { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => ReactNode;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function Table<T = Record<string, unknown>>({
  columns, data, keyExtractor, loading = false, emptyMessage = 'No data', className = '',
}: TableProps<T>) {
  return (
    <div className={['table-wrap', className].filter(Boolean).join(' ')}>
      <table className="table" role="table">
        <thead className="table__head">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="table__th"
                style={{ width: col.width, textAlign: col.align ?? 'left' }}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="table__row">
                {columns.map(col => (
                  <td key={col.key} className="table__td">
                    <div className="skeleton skeleton--line" style={{ width: '80%', height: 14 }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={keyExtractor(row, i)} className="table__row">
                {columns.map(col => (
                  <td key={col.key} className="table__td" style={{ textAlign: col.align ?? 'left' }}>
                    {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
