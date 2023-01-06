import { iUser } from 'types';

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

export function userToken(user: iUser | string, options = null): string {
	const id = typeof user === 'string' ? user : user._id;

	return jwt.sign(
		{ id },
		secret,
		options || {
			algorithm: 'HS256',
			expiresIn: '1d'
		}
	);
}

export function userCookie(
	user: iUser | string,
	options = null
): Array<string> {
	const id = typeof user === 'string' ? user : user._id;

	return [
		`token=${jwt.sign(
			{ id },
			secret,
			options || {
				algorithm: 'HS256',
				expiresIn: '1d'
			}
		)}`
	];
}
