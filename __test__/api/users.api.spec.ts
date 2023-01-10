import { Request, createCookie, userToken } from '../lib';
import { users } from '../data';
import { User, Token, iToken } from '../../src/types';
import { duplicateWithoutId } from '../helpers';

const http = new Request();

describe('QUERY USERS', () => {
	let adminToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.get('/users');
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Gets all users', async () => {
		const { body, status } = await http.get('/users', {
			headers: { cookie: [adminToken] }
		});

		expect(status).toBe(200);
		expect(body.message).toBe('A list of queried users');
		expect(body.data).toHaveLength(3);
	});
});

describe('CREATE USERS', () => {
	let adminToken: string;
	let standardToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[2]);

		adminToken = await createCookie(users[0], 'User');
		standardToken = await createCookie(users[2], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.post(
			'/users',
			duplicateWithoutId(users[2])
		);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Does not create a new user if operating user does not have permission', async () => {
		const { body, status } = await http.post(
			'/users',
			duplicateWithoutId(users[1]),
			{ headers: { cookie: [standardToken] } }
		);

		expect(status).toBe(403);
		expect(body.message).toBe('Forbidden');
	});

	it('Creates a new user if operating user is logged in and has permission', async () => {
		const newUser = duplicateWithoutId(users[3]);

		const { body, status } = await http.post('/users', newUser, {
			headers: { cookie: [adminToken] }
		});

		expect(status).toBe(201);
		expect(body.message).toBe('User created');
		expect(body.data).toEqual(expect.objectContaining(newUser));
	});
});

describe('PASSWORD RESET', () => {
	beforeEach(async () => {
		await User.create(users[2]);
	});

	it('Allows a user to request a password reset', async () => {
		const { body, status } = await http.post('/users/password-reset', {
			email: users[2].email
		});

		expect(status).toBe(200);
		expect(body.message).toBe(
			'A password reset link will be sent to the provided email address if an account exists'
		);
	});

	it('Will still be successful even if the email address/user does not exist in the system (security)', async () => {
		const { body, status } = await http.post('/users/password-reset', {
			email: 'arandomemail@testme.io'
		});

		expect(status).toBe(200);
		expect(body.message).toBe(
			'A password reset link will be sent to the provided email address if an account exists'
		);
	});

	it('Allows a valid user to reset their password with the provided link', async () => {
		await http.post('/users/password-reset', {
			email: users[2].email
		});

		const storedToken = (await Token.findOne()) as iToken;

		const { body, status } = await http.patch(
			'/users/password-reset',
			{
				password: 'acompletelynewpassword'
			},
			{
				headers: { authorization: storedToken.token }
			}
		);

		expect(status).toBe(200);
		expect(body.message).toBe('Password reset');
	});

	it('Does not perform a password reset for an invalid user/account', async () => {
		const { status } = await http.patch(
			'/users/password-reset',
			{
				password: 'acompletelynewpassword'
			},
			{
				headers: { authorization: userToken(users[1]) }
			}
		);

		expect(status).toBe(401);
	});
});
