import { scryptSync, randomBytes } from 'crypto';
import { logger } from './logger';

export function encrypt(password: string) {
	let salt: string, hashed: string;
	try {
		salt = randomBytes(128).toString('hex');
		hashed = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
	return hashed;
}

export function compare(password: string, hash: string): boolean {
	const [salt, key] = hash.split(':');
	return key === scryptSync(password, salt, 64).toString('hex');
}
