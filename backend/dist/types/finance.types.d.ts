import { Types } from 'mongoose';
export declare const TRANSACTION_TYPES: readonly ["Income", "Expense"];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export interface ICategory {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CategoryData {
    id: string;
    user: string;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateCategoryBody {
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
}
export interface UpdateCategoryBody {
    name?: string;
    icon?: string;
    color?: string;
}
export interface ITransaction {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    category: Types.ObjectId;
    type: TransactionType;
    amount: number;
    description?: string;
    transactionDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TransactionData {
    id: string;
    user: string;
    category: string | CategoryData;
    type: TransactionType;
    amount: number;
    description?: string;
    transactionDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateTransactionBody {
    category: string;
    type: TransactionType;
    amount: number;
    description?: string;
    transactionDate: string;
}
export interface UpdateTransactionBody {
    category?: string;
    type?: TransactionType;
    amount?: number;
    description?: string;
    transactionDate?: string;
}
export interface TransactionQuery {
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
}
//# sourceMappingURL=finance.types.d.ts.map