import { connect, set, plugin, Schema } from 'mongoose';

import { logger } from '../lib';

export function dBInit() {
	logger.info('SERVER INITIALISATION::Mongoose Database Driver');

	function setValidators(this: any) {
		this.setOptions({ runValidators: true });
	}

	try {
		set('strictQuery', false);
		/*
		Update operations do not run
		validators by default, they
		must be enabled manually.
		*/
		plugin((schema: Schema) => {
			schema.pre('findOneAndUpdate', setValidators);
			schema.pre('updateOne', setValidators);
			schema.pre('updateMany', setValidators);
		});

		connect(process.env.MONGO_URL as string);
	} catch (e) {
		logger.error(e);
		throw new Error('Database connection failed');
	}
}
