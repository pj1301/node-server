import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { User } from '../types';
import { encrypt, generateToken, formatQuery } from '../lib';

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
		users = await User.find(formatQuery(query))
			.select('-password')
			.populate('tags', 'title type');
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
		user = await User.findById(id)
			.select('-password')
			.populate('tags', 'title type');
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
	let { firstName, lastName, username, role, active, tags } = req.body;
	const update: {
		username?: string;
		lastName?: string;
		firstName?: string;
		role?: string;
		active?: boolean;
		tags?: Array<string>;
	} = {};
	if (firstName) update['firstName'] = firstName;
	if (lastName) update.lastName = lastName;
	if (username) update.username = username;
	if (role) update.role = role;
	if (tags) update.tags = tags;
	if (active || active === false) update.active = active;
	let user;

	try {
		user = await User.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: update },
			{ new: true }
		).populate('tags', 'title type');
	} catch (e) {
		return next(e);
	}
	res
		.status(200)
		.send({ message: `A user queried by id => ${id}`, data: user });
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
	if (!res.locals.user) throw new Error('User not found');
	res.status(200).send({ message: 'Logged in user', data: res.locals.user });
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
		url = `${process.env.URL}/password-reset#token=${generateToken(
			user._id.toString(),
			{ expiry: '5m' }
		)}`;
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
	throw new Error('Not implemented');
}

async function performPasswordReset(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	let result: boolean | null;
	try {
		result = await User.findOneAndUpdate(
			{ _id: res.locals.user._id },
			{ password: encrypt(req.body.password) }
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
	performPasswordReset,
};
