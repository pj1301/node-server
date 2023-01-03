import { connect, set } from 'mongoose';

import { logger } from '../lib';

export function dBInit() {
	logger.info('SERVER INITIALISATION::Mongoose Database Driver');
	try {
		set('strictQuery', false);
		connect(process.env.MONGO_URL as string);
	} catch (e) {
		logger.error(e);
		throw new Error('Database connection failed');
	}
}
