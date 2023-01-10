import { NextFunction, Request, Response } from 'express';

import { eTokenType, iUser, User, Token, iToken } from '../types';
import { DatabaseError, NotAuthorised } from '../errors';

async function login(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { username, password } = req.body;
	let storedToken: iToken, user: iUser | null;

	try {
		user = await User.login(username, password);
		if (!user) throw Error('Not authenticated');

		storedToken = (await Token.create({
			identifier: user._id,
			type: eTokenType.AUTH,
			docModel: 'User'
		})) as unknown as iToken;

		if (!storedToken) throw new DatabaseError();
	} catch (e) {
		next(new NotAuthorised((e as Error).message ?? 'Not authenticated'));
		return;
	}

	res
		.cookie('token', storedToken.token, {
			maxAge: parseInt(process.env.MAX_COOKIE_AGE as string, 10),
			httpOnly: true
		})
		.status(200)
		.send({ message: 'Successfully logged in', data: { user } });
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
