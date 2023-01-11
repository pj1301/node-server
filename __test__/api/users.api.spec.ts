import { Request, createCookie, userToken } from '../lib';
import { users } from '../data';
import { User, Token, iToken } from '../../src/types';
import { duplicateWithoutId } from '../helpers';

const http = new Request();

describe('QUERY USERS', () => {
	const URL = '/users';
	let adminToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.get(URL);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Gets all users', async () => {
		const { body, status } = await http.get(URL, {
			headers: { cookie: [adminToken] }
		});

		expect(status).toBe(200);
		expect(body.message).toBe('A list of queried users');
		expect(body.data).toHaveLength(3);
	});
});

describe('QUERY USERS BY ID', () => {
	const URL = '/users';
	let adminToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.get(URL);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Gets a user by id', async () => {
		const { body, status } = await http.get(
			`${URL}/${users[1]._id.toString()}`,
			{
				headers: { cookie: [adminToken] }
			}
		);

		expect(status).toBe(200);
		expect(body.message).toContain('A user queried by id');
		expect(body.data._id).toBe(users[1]._id.toString());
	});
});

describe('CREATE USERS', () => {
	const URL = '/users';
	let adminToken: string;
	let standardToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[2]);

		adminToken = await createCookie(users[0], 'User');
		standardToken = await createCookie(users[2], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.post(URL, duplicateWithoutId(users[2]));
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Does not create a new user if operating user does not have permission', async () => {
		const { body, status } = await http.post(
			URL,
			duplicateWithoutId(users[1]),
			{ headers: { cookie: [standardToken] } }
		);

		expect(status).toBe(403);
		expect(body.message).toBe('Forbidden');
	});

	it('Creates a new user if operating user is logged in and has permission', async () => {
		const newUser = duplicateWithoutId(users[3]);

		const { body, status } = await http.post(URL, newUser, {
			headers: { cookie: [adminToken] }
		});

		expect(status).toBe(201);
		expect(body.message).toBe('User created');
		expect(body.data).toEqual(expect.objectContaining(newUser));
	});
});

describe('PASSWORD RESET', () => {
	const URL = '/users/password-reset';

	beforeEach(async () => {
		await User.create(users[2]);
	});

	it('Allows a user to request a password reset', async () => {
		const { body, status } = await http.post(URL, { email: users[2].email });

		expect(status).toBe(200);
		expect(body.message).toBe(
			'A password reset link will be sent to the provided email address if an account exists'
		);
	});

	it('Will still be successful even if the email address/user does not exist in the system (security)', async () => {
		const { body, status } = await http.post(URL, {
			email: 'arandomemail@testme.io'
		});

		expect(status).toBe(200);
		expect(body.message).toBe(
			'A password reset link will be sent to the provided email address if an account exists'
		);
	});

	it('Allows a valid user to reset their password with the provided link', async () => {
		await http.post(URL, { email: users[2].email });

		const storedToken = (await Token.findOne()) as iToken;

		const { body, status } = await http.patch(
			URL,
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
			URL,
			{
				password: 'acompletelynewpassword'
			},
			{
				headers: { authorization: userToken(users[1]) }
			}
		);

		expect(status).toBe(401);
	});

	it('Deletes a single use password reset token after attempting a password reset', async () => {
		await http.post(URL, { email: users[2].email });

		let storedToken = (await Token.findOne()) as iToken;

		await http.patch(
			URL,
			{
				password: 'acompletelynewpassword'
			},
			{
				headers: { authorization: storedToken.token }
			}
		);

		storedToken = (await Token.findOne()) as iToken;

		expect(storedToken).toBeNull();
	});
});

/* UPDATE USER */
/* DELETE USER */
/*
CHECK TOKEN TYPES
If using a single use token - fail except
for password reset and check token is removed
If using a regular auth token but submitted
as an authorization token - fail and check
token is deleted
*/
