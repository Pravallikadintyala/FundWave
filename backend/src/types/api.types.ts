/**
 * Shared TypeScript interfaces for API request/response contracts.
 * Per CLAUDE.md: prefer interfaces for request/response models.
 */


/** Standard success response envelope */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/** Standard error response envelope */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

/** Union of both response shapes */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

