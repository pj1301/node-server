import { NextFunction, Request, Response } from 'express';

import { logger } from '../lib';
import { iThrownError } from '../types';

export function errorHandler(
	err: iThrownError,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (res.headersSent) return next(err);
	logger.error(err);
	res.status(err.metadata?.statusCode ?? 500).send({ message: err.message });
}
