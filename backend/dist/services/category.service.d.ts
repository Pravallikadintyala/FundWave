import { CategoryData, CreateCategoryBody, UpdateCategoryBody } from '../types/finance.types';
export declare const seedDefaultCategories: (userId: string) => Promise<void>;
export declare const createCategory: (userId: string, body: CreateCategoryBody) => Promise<CategoryData>;
export declare const getCategories: (userId: string) => Promise<CategoryData[]>;
export declare const updateCategory: (userId: string, categoryId: string, body: UpdateCategoryBody) => Promise<CategoryData>;
export declare const deleteCategory: (userId: string, categoryId: string) => Promise<void>;
//# sourceMappingURL=category.service.d.ts.map