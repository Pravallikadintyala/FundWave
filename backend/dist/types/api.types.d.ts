export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
}
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
//# sourceMappingURL=api.types.d.ts.map