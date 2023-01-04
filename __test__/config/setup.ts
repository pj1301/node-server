import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, disconnect, set } from 'mongoose';

import env from '../../.env/test.json';

export default async () => {
	/*
	There should only be one instance of the
	memory server, which should be available
	globally following initialisation
	*/
	const instance = await MongoMemoryServer.create();
	const uri = instance.getUri();
	(global as any).__MONGOINSTANCE = instance;
	process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf('/'));

	/* Clean db prior to starting tests */
	set('strictQuery', false);
	await connect(`${process.env.MONGO_URL}/${env.DB_NAME}`);
	await connection.db.dropDatabase();
	await disconnect();
};
