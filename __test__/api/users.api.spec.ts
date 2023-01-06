import { Request, userCookie } from '../lib';
import { users } from '../data';
import { User } from '../../src/types';
import { duplicateWithoutId } from '../helpers';

const http = new Request();

describe('QUERY USERS', () => {
	beforeEach(async () => {
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
				cookie: userCookie(users[0])
			}
		});

		expect(status).toBe(200);
		expect(body.message).toBe('A list of queried users');
		expect(body.data).toHaveLength(3);
	});
});

describe('CREATE USERS', () => {
	beforeEach(async () => {
		await User.create(users[0]);
	});

	it('Fails if authentication is not provided', async () => {
		const { body, status } = await http.post(
			'users',
			duplicateWithoutId(users[2])
		);
		expect(status).toBe(401);
		expect(body.message).toBe('Not authorised');
	});

	it('Does not create a new user if operating user does not have permission', async () => {
		await User.create(users[2]);

		const { body, status } = await http.post(
			'users',
			duplicateWithoutId(users[1]),
			{
				headers: { cookie: userCookie(users[2]) }
			}
		);

		expect(status).toBe(403);
		expect(body.message).toBe('Forbidden');
	});

	it('Creates a new user if operating user is logged in and has permission', async () => {
		const newUser = duplicateWithoutId(users[2]);

		const { body, status } = await http.post('users', newUser, {
			headers: { cookie: userCookie(users[0]) }
		});

		expect(status).toBe(201);
		expect(body.message).toBe('User created');
		expect(body.data).toEqual(expect.objectContaining(newUser));
	});
});
