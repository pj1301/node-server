import expressServer from './server';

beforeAll(() => {
	// This happens before all tests
});

afterAll(() => {
	// This happens after all tests
	expressServer.close();
});
