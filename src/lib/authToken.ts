import { EnvironmentError, ParameterError } from '../errors';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

interface iTokenOptions {
	expiry?: string | number;
}

export function generateToken(id: string, options: iTokenOptions = {}): string {
	if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRY)
		throw new EnvironmentError(
			'Environment variables are missing JWT defaults'
		);

	if (!id) throw new ParameterError('User id is required');
	return sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: options.expiry ?? process.env.JWT_EXPIRY
	});
}

export async function validateToken(
	token: string
): Promise<string | JwtPayload> {
	if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRY)
		throw new EnvironmentError(
			'Environment variables are missing JWT defaults'
		);
	return await verify(token, process.env.JWT_SECRET as string);
}
