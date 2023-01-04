import { NextFunction, Request, Response } from 'express';

import { logger } from '../lib';
import { NotAuthorised } from '../errors';
import { iUser, User } from '../types';

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { cookie } = req.headers;
	let user: iUser | null;

	try {
		if (!cookie) throw new Error('No Token provided');

		/*
		Use the authentication method on the User model
		to check token is valid and user exists.
		If either conditions is not satisfied, throw error
		*/
		user = await User.authenticate(cookie.replace(/token=/, ''));
		if (!user) throw new Error('Not authorised');
		if (!res.locals.allowedRoles.includes(user.role))
			throw new Error('Not authorised');
	} catch (e) {
		logger.error('ERROR: Authentication Middleware');
		logger.error(e);
		return next(new NotAuthorised());
	}

	// set user in res.locals
	res.locals.user = user;
	next();
}
