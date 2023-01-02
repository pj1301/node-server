import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, disconnect } from 'mongoose';

export default async () => {
	// it's needed in global space, because we don't want to create a new instance every test-suite
	const instance = await MongoMemoryServer.create();
	const uri = instance.getUri();
	(global as any).__MONGOINSTANCE = instance;
	process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf('/'));

	// The following is to make sure the database is clean before an test starts
	await connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
	await connection.db.dropDatabase();
	await disconnect();
};
