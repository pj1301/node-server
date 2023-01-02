import { iUser } from 'types';

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

export function generateToken(user: iUser | string, options = null) {
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
