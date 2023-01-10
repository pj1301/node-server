import { NextFunction, Request, Response } from 'express';

import { eTokenType, tMiddlewareFn } from '../types';

export function tokenAccessDefaults(): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.tokenAccess = [eTokenType.AUTH];
		next();
	};
}

export function setTokenAccess(types: Array<eTokenType>): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.tokenAccess = types;
		next();
	};
}
