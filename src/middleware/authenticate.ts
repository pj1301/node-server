import { NextFunction, Request, Response } from 'express';

import { logger } from '../lib';
import { Forbidden, NotAuthorised } from '../errors';
import { eTokenType, Token } from '../types';

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { cookie, authorization } = req.headers;
	let accessor: any;

	try {
		if (!cookie && !authorization) throw new Error('No Token provided');
		const token = cookie
			? cookie.replace(/token=/, '')
			: (authorization as string).replace(/Bearer /, '');

		accessor = await Token.verify(token, res.locals.tokenAccess);
		/* If no accessor, not authorised */
		if (!accessor) throw new Error('Not authorised');
		/*
		If a regular auth token has somehow been
		copied from the browser memory and submitted
		as an auth token inside the authorization
		header, delete the token and throw an error
		*/
		if (accessor.type === eTokenType.AUTH && authorization) {
			await Token.deleteOne({ token });
			throw new Error('Token type not allowed');
		}
	} catch (e) {
		// logger.error('ERROR: Authentication Middleware');
		// logger.error(e);
		return next(new NotAuthorised());
	}

	if (!res.locals.allowedRoles.includes(accessor.role))
		return next(new Forbidden());

	// set user in res.locals
	res.locals.accessor = accessor;
	next();
}
