import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, disconnect, set } from 'mongoose';

import env from '../../.env/test.json';

export default async () => {
	// it's needed in global space, because we don't want to create a new instance every test-suite
	const instance = await MongoMemoryServer.create();
	const uri = instance.getUri();
	(global as any).__MONGOINSTANCE = instance;
	process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf('/'));

	// The following is to make sure the database is clean before an test starts
	set('strictQuery', false);
	await connect(`${process.env.MONGO_URL}/${env.DB_NAME}`);
	await connection.db.dropDatabase();
	await disconnect();
};
