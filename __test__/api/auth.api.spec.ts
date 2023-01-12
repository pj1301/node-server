import { Request, createCookie, userToken } from '../lib';
import { users } from '../data';
import { User, Token, eTokenType } from '../../src/types';

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

/*
CHECK TOKEN TYPES
If using a single use token - fail except
for password reset and check token is removed
If using a regular auth token but submitted
as an authorization token - fail and check
token is deleted

Can test any url(s) to confirm, so long
as they have the correct token type
configuration
*/
describe('TOKEN TYPES', () => {
	it('Does not allow a single use token to access a general auth route', async () => {
		await Token.create({
			identifier: users[0]._id,
			type: eTokenType.SINGLE_AUTH,
			docModel: 'User'
		});

		const { body, status } = await http.get('/users', {
			headers: { authorization: userToken(users[0]) }
		});

		expect(status).toBe(401);
		expect(body.message).toContain('Not authorised');
	});

	it('Does not allow general auth tokens to be submitted outside of a cookie', async () => {
		await Token.create({
			identifier: users[0]._id,
			type: eTokenType.AUTH,
			docModel: 'User'
		});

		const { body, status } = await http.get('/users', {
			headers: { authorization: userToken(users[0]) }
		});

		expect(status).toBe(401);
		expect(body.message).toContain('Not authorised');
	});
});
