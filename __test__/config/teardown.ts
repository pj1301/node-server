import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
	/*
	This will terminate the mongo memory
	database once the tests have all been
	run
	*/
	const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
	await instance.stop();
	/*
	This will stop the express server once
	the test suite has run
	*/
	process.exit(0);
};
