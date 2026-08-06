import { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Table, EmptyState, type TableColumn } from '@/components/ui';

type Filter = 'all' | 'income' | 'expense';

interface TxRow { id: string; date: string; description: string; category: string; type: string; amount: string; }

const columns: TableColumn<TxRow>[] = [
  { key: 'date',        header: 'Date',        width: '110px' },
  { key: 'description', header: 'Description' },
  { key: 'category',   header: 'Category',    width: '130px' },
  {
    key: 'type',
    header: 'Type',
    width: '100px',
    render: (row) => (
      <Badge variant={row.type === 'Income' ? 'success' : 'danger'} size="sm">
        {row.type}
      </Badge>
    ),
  },
  { key: 'amount', header: 'Amount', width: '110px', align: 'right' },
];

const InboxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 28l5-13h20l5 13H5z" />
    <path d="M5 28h30" />
    <path d="M14 28a6 6 0 0 0 12 0" />
  </svg>
);

const TransactionsPage = () => {
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'income',  label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  return (
    <div className="page page-enter">
      <div className="page__header">
        <div>
          <h1 className="page__title">Transactions</h1>
          <p className="page__subtitle">All your income and expense records in one place.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={['filter-btn', filter === f.key ? 'filter-btn--active' : ''].filter(Boolean).join(' ')}
            aria-pressed={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <Card variant="default" padding="none">
        <CardHeader>
          <div className="card-section-header" style={{ padding: '20px 24px 0' }}>
            <h2 className="card-section-title">Transaction History</h2>
            <Badge variant="neutral" size="sm">0 records</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <Table<TxRow>
            columns={columns}
            data={[]}
            keyExtractor={r => r.id}
            loading={false}
            emptyMessage=""
          />
          <EmptyState
            icon={<InboxIcon />}
            title="No transactions found"
            description="Your transaction history will appear here once you add entries."
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default TransactionsPage;
