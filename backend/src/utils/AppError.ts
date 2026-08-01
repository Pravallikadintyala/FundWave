/**
 * AppError — a typed, operational error class.
 *
 * Distinguishes expected operational errors (bad input, not found, etc.)
 * from unexpected programmer errors so the global error handler can
 * respond appropriately.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper prototype chain in transpiled ES5 output
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture clean stack trace (Node.js V8 only)
    Error.captureStackTrace(this, this.constructor);
  }
}
