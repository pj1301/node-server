import { Request, createCookie } from '../lib';
import { users } from '../data';
import { User, Token } from '../../src/types';

const http = new Request();

describe('Login', () => {
	beforeEach(async () => {
		await User.create(users[0]);
	});

	it('Prevents an invalid user from logging in', async () => {
		const { body, status } = await http.post('/auth/login', {
			username: users[1].email,
			password: users[1].password
		});

		expect(status).toBe(401);
		expect(body.message).toBe('Not authenticated');
	});

	it('Allows a valid user to log in', async () => {
		const { body, status } = await http.post('/auth/login', {
			username: users[0].email,
			password: users[0].password
		});

		expect(status).toBe(200);
		expect(body.data).toEqual(
			expect.objectContaining({
				_id: users[0]._id.toString(),
				username: users[0].username,
				email: users[0].email,
				active: true
			})
		);

		const storedTokens = await Token.find();
		expect(storedTokens).toHaveLength(1);
		expect(storedTokens[0].identifier.toString()).toBe(users[0]._id.toString());
	});
});

describe('Login', () => {
	let adminToken: string;

	beforeEach(async () => {
		await User.create(users[0]);
		adminToken = await createCookie(users[0], 'User');
	});

	it('Fails to log out without a token', async () => {
		const { status } = await http.delete('/auth/login');

		expect(status).toBe(401);
	});

	it('Allows a valid user to log in', async () => {
		const { body, status } = await http.delete('/auth/login', {
			headers: { cookie: [adminToken] }
		});

		expect(status).toBe(200);
		expect(body.message).toBe('Logout successful');

		const storedTokens = await Token.find();
		expect(storedTokens).toHaveLength(0);
	});
});
