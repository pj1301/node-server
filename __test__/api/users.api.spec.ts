import { Request, createCookie, userToken } from '../lib';
import { users } from '../data';
import { User, Token, iToken, iUser } from '../../src/types';
import { duplicateWithoutId } from '../helpers';
import { ObjectId } from 'mongodb';

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

describe('GET LOGGED IN USER', () => {
	const URL = '/users/me';
	let adminToken: string;
	let devToken: string;
	let standardToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
		devToken = await createCookie(users[1], 'User');
		standardToken = await createCookie(users[2], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.get(URL);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Allows any user to retrieve their own record', async () => {
		let body: any, status: number;

		const runTest = async (user: iUser, token: string) => {
			({ body, status } = await http.get(URL, {
				headers: { cookie: [token] }
			}));
			expect(status).toBe(200);
			expect(body.message).toContain('Logged in user');
			expect(body.data).toEqual(
				expect.objectContaining({
					_id: (user._id as ObjectId).toString(),
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName
				})
			);
		};

		await Promise.all([
			runTest(users[0], adminToken),
			runTest(users[1], devToken),
			runTest(users[2], standardToken)
		]);
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

describe('UPDATE USERS', () => {
	const URL = '/users';
	let adminToken: string;
	let standardToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
		standardToken = await createCookie(users[2], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.patch(
			`${URL}/${users[1]._id.toString()}`,
			{}
		);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Does not update a user if operating user does not have permission', async () => {
		const { body, status } = await http.patch(
			`${URL}/${users[1]._id.toString()}`,
			{
				username: 'anewusername',
				email: 'anewemail@test.com'
			},
			{ headers: { cookie: [standardToken] } }
		);

		expect(status).toBe(403);
		expect(body.message).toBe('Forbidden');
	});

	it('Updates a user if operating user is logged in and has permission', async () => {
		const { body, status } = await http.patch(
			`${URL}/${users[1]._id.toString()}`,
			{
				username: 'anewusername',
				email: 'anewemail@test.com'
			},
			{ headers: { cookie: [adminToken] } }
		);

		expect(status).toBe(200);
		expect(body.message).toBe(
			`Updated user with id => ${users[1]._id.toString()}`
		);
		expect(body.data).toEqual(
			expect.objectContaining({
				username: 'anewusername',
				email: 'anewemail@test.com'
			})
		);
	});
});

describe('DELETE USERS', () => {
	const URL = '/users';
	let adminToken: string;
	let standardToken: string;

	beforeEach(async () => {
		await User.create(users[0], users[1], users[2]);

		adminToken = await createCookie(users[0], 'User');
		standardToken = await createCookie(users[2], 'User');
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.delete(
			`${URL}/${users[1]._id.toString()}`
		);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Does not delete a user if operating user does not have permission', async () => {
		const { body, status } = await http.delete(
			`${URL}/${users[1]._id.toString()}`,
			{ headers: { cookie: [standardToken] } }
		);

		expect(status).toBe(403);
		expect(body.message).toBe('Forbidden');
	});

	it('Deletes a user if operating user is logged in and has permission', async () => {
		const { body, status } = await http.delete(
			`${URL}/${users[1]._id.toString()}`,
			{ headers: { cookie: [adminToken] } }
		);

		expect(status).toBe(200);
		expect(body.message).toBe('User deleted');
	});
});
