import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { eTokenType, iToken, iUser, Token, User } from '../types';
import { formatQuery, logger } from '../lib';

async function createUser(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { email, firstName, lastName, username } = req.body;
	let user;
	try {
		user = await User.create({ email, firstName, lastName, username });
	} catch (e) {
		return next(e);
	}
	res.status(201).send({ message: 'User created', data: user });
}

async function getUsers(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { query } = req;
	let users;
	try {
		users = await User.find(formatQuery(query)).select('-password');
	} catch (e) {
		return next(e);
	}
	res
		.status(200)
		.send({ message: 'A list of queried users', query, data: users });
}

async function getUserById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { id } = req.params;
	let user;
	try {
		user = await User.findById(id).select('-password');
	} catch (e) {
		return next(e);
	}
	res
		.status(200)
		.send({ message: `A user queried by id => ${id}`, data: user });
}

async function updateUser(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { id } = req.params;
	// eslint-disable-next-line prefer-const
	let { firstName, lastName, username, email, role, active } = req.body;
	const update: {
		username?: string;
		lastName?: string;
		firstName?: string;
		email?: string;
		role?: string;
		active?: boolean;
	} = {};
	if (firstName) update['firstName'] = firstName;
	if (lastName) update.lastName = lastName;
	if (username) update.username = username;
	if (email) update.email = email;
	if (role) update.role = role;
	if (active || active === false) update.active = active;
	let user;

	try {
		user = await User.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: update },
			{ new: true }
		);
	} catch (e) {
		return next(e);
	}
	res
		.status(200)
		.send({ message: `Updated user with id => ${id}`, data: user });
}

async function deleteUser(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		await User.deleteOne({ _id: req.params.id });
	} catch (e) {
		return next(e);
	}
	res.status(200).send({ message: 'User deleted' });
}

async function getLoggedInUser(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	if (!res.locals.accessor) throw new Error('User not found');
	res
		.status(200)
		.send({ message: 'Logged in user', data: res.locals.accessor });
}

async function getPasswordResetLink(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	let url: string;
	try {
		const user = await User.findById(req.params.id);
		if (!user) return next(new Error('No user with specified id'));

		const storedToken = (await Token.create({
			identifier: user._id,
			type: eTokenType.SINGLE_AUTH,
			docModel: 'User'
		})) as unknown as iToken;

		url = `${process.env.URL}/password-reset#token=${storedToken.token}`;
	} catch (e) {
		return next(e);
	}
	res.status(200).send({ message: 'Password reset url', data: { url } });
}

async function passwordResetRequest(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	let user: iUser | null,
		storedToken: iToken | null = null;
	try {
		user = await User.findOne({ email: req.body.email });

		if (user) {
			storedToken = (await Token.create({
				identifier: user._id,
				type: eTokenType.SINGLE_AUTH,
				docModel: 'User'
			})) as unknown as iToken;
		}
	} catch (e) {
		logger.error(e);
		return next(e);
	}

	res.status(200).send({
		message:
			'A password reset link will be sent to the provided email address if an account exists'
	});
}

async function performPasswordReset(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	let result: boolean | null;
	try {
		result = await User.findOneAndUpdate(
			{ _id: res.locals.accessor._id },
			{ password: req.body.password }
		);
	} catch (e) {
		return next(e);
	}
	res.status(200).send({ message: 'Password reset' });
}

export {
	createUser,
	deleteUser,
	getUsers,
	getUserById,
	passwordResetRequest,
	updateUser,
	getLoggedInUser,
	getPasswordResetLink,
	performPasswordReset
};
