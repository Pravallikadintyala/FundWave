import { TransactionData, CreateTransactionBody, UpdateTransactionBody, TransactionQuery } from '../types/finance.types';
export declare const createTransaction: (userId: string, body: CreateTransactionBody) => Promise<TransactionData>;
export declare const getTransactions: (userId: string, query: TransactionQuery) => Promise<TransactionData[]>;
export declare const getTransactionById: (userId: string, transactionId: string) => Promise<TransactionData>;
export declare const updateTransaction: (userId: string, transactionId: string, body: UpdateTransactionBody) => Promise<TransactionData>;
export declare const deleteTransaction: (userId: string, transactionId: string) => Promise<void>;
//# sourceMappingURL=transaction.service.d.ts.map