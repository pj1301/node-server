import { NextFunction, Request, Response } from 'express';

import { iUser, User } from '../types';
import { NotAuthorised } from '../errors';

async function login(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { username, password } = req.body;
	let token: string | null, user: iUser | null;

	try {
		token = await User.login(username, password);
		if (!token) throw Error('Not authenticated');
		user = await User.findOne({ username }).select('-password');
	} catch (e) {
		next(new NotAuthorised((e as Error).message ?? 'Not authenticated'));
		return;
	}

	res
		.status(200)
		.send({ message: 'Successfully logged in', data: { token, user } });
	return;
}

async function logout(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	res.status(200).send({ message: 'logout' });
	return;
}

export { login, logout };
