import { NextFunction, Request, Response } from 'express';

export type tMiddlewareFn = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
