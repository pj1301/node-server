import { EnvironmentError } from '../errors';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

interface iTokenOptions {
	expiry?: string | number;
}

/*
these two values should be present upon
starting the server, otherwise errors
will arise during operation
*/
const secret = process.env.JWT_SECRET;
const defaultExpiry = process.env.JWT_EXPIRY;

if (!secret || !defaultExpiry)
	throw new EnvironmentError('Environment variables are missing JWT defaults');

export function generateToken(id: string, options: iTokenOptions = {}): string {
	return sign({ id }, secret as string, {
		expiresIn: options.expiry ?? defaultExpiry
	});
}

export async function validateToken(
	token: string
): Promise<string | JwtPayload> {
	return await verify(token, secret as string);
}
