import { Request, Response, NextFunction, RequestHandler } from 'express';
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const asyncHandler: (fn: AsyncRouteHandler) => RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map