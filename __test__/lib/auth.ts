import { TestHelperError } from '../../src/errors';
import {
	eTokenType,
	iDatabaseObject,
	iToken,
	iUser,
	Token
} from '../../src/types';

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

export async function createCookie(
	accessor: iDatabaseObject,
	docModel: string,
	type: eTokenType = eTokenType.AUTH
): Promise<string> {
	let storedToken: iToken | null;

	try {
		storedToken = await Token.create({
			identifier: accessor._id,
			type,
			docModel
		});
	} catch (e: unknown) {
		throw new TestHelperError('createCookie function failed');
	}

	return `token=${storedToken?.token}`;
}
