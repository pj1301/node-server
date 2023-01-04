import { Request, generateToken } from '../lib';
import { users } from '../data';
import { User } from '../../src/types';

const http = new Request();

describe('Query Users', () => {
	beforeAll(async () => {
		await User.create(users[0], users[1], users[2]);
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.get('users');
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Gets all users', async () => {
		const { body, status } = await http.get('users', {
			headers: {
				cookie: [`token=${generateToken(users[0])}`]
			}
		});

		expect(status).toBe(200);
		expect(body.message).toBe('A list of queried users');
		expect(body.data).toHaveLength(3);
	});
});
