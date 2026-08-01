/**
 * Response helper utilities.
 * Enforce the CLAUDE.md response envelope on every API response.
 */

import { Response } from 'express';
import { HTTP_STATUS } from '../constants';

/**
 * Send a success response.
 * Shape: { success: true, data: T }
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = HTTP_STATUS.OK,
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Send an error response.
 * Shape: { success: false, message: string }
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
