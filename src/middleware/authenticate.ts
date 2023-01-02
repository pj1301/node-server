import { NextFunction, Request, Response } from 'express';

import { NotAuthorised } from '../errors';
import { iUser, User } from '../types';

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { authorization } = req.headers;
	let user: iUser | null;

	try {
		if (!authorization) throw new Error('No Token provided');
		user = await User.authenticate(authorization.replace(/Bearer /, ''));
		if (!user) throw new Error('Not authorised');
		if (!res.locals.allowedRoles.includes(user.role))
			throw new Error('Not authorised');
	} catch (e) {
		return next(new NotAuthorised());
	}

	// set user in res.locals
	res.locals.user = user;
	next();
}
