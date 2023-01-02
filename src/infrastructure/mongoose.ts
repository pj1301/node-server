import { connect } from 'mongoose';

import { logger } from '../lib';

export function dBInit() {
	logger.info('SERVER INITIALISATION::Mongoose Database Driver');
	try {
		connect(process.env.DB_CONNECT_URL as string);
	} catch (e) {
		logger.error(e);
		throw new Error('Database connection failed');
	}
}
