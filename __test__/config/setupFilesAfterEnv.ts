import { Model } from 'mongoose';

import * as MODELS from '../../src/types/models';
import expressServer from './server';

beforeAll(() => {
	// This happens before all tests
});

beforeEach(async () => {
	await Promise.all(
		Object.values(MODELS).map((m: Model<any>) => m.deleteMany({}))
	);
});

afterAll(() => {
	// This happens after all tests
	expressServer.close();
});
