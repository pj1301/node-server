import { Request, generateToken } from '../lib';
import { users } from '../data';

const http = new Request();

describe('Query Users', () => {
	it('Gets all users', async () => {
		const { body, status } = await http.get('users', {
			cookie: [`token=${generateToken(users[0])}`]
		});
		expect(status).toBe(200);
		expect(body.users).toHaveLength(users.length);
	});
});
