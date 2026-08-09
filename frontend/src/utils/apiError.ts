/**
 * extractApiError — pulls a human-readable message out of an Axios error.
 *
 * The backend always answers failures with `{ success: false, message: string }`,
 * so that message is preferred; network/unknown errors fall back gracefully.
 */

interface AxiosLikeError {
  response?: { data?: { message?: string } };
  message?: string;
}

export const extractApiError = (
  error: unknown,
  fallback = 'Something went wrong',
): string => {
  const err = error as AxiosLikeError | null | undefined;
  return err?.response?.data?.message ?? err?.message ?? fallback;
};
