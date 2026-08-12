import { Response } from 'express';
export declare const sendSuccess: <T>(res: Response, data: T, statusCode?: number) => Response;
export declare const sendError: (res: Response, message: string, statusCode?: number) => Response;
//# sourceMappingURL=response.d.ts.map