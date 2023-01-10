import { Router } from 'express';
import {
	createUser,
	deleteUser,
	getLoggedInUser,
	getUserById,
	getUsers,
	passwordResetRequest,
	updateUser,
	getPasswordResetLink,
	performPasswordReset
} from '../controllers';
import {
	authenticate,
	setAuthorisedRoles,
	setTokenAccess
} from '../middleware';
import { eRoles, eTokenType } from '../types';

const router = Router();

router
	.route('/')
	.post(setAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, createUser)
	.get(setAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, getUsers);

router
	.route('/password-reset')
	.post(passwordResetRequest)
	.patch(
		setTokenAccess([eTokenType.SINGLE_AUTH]),
		setAuthorisedRoles([eRoles.D1, eRoles.A1, eRoles.U1, eRoles.U2]),
		authenticate,
		performPasswordReset
	);

router
	.route('/me')
	.get(
		setAuthorisedRoles([eRoles.D1, eRoles.A1, eRoles.U1, eRoles.U2]),
		authenticate,
		getLoggedInUser
	);

router
	.route('/:id')
	.get(setAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, getUserById)
	.patch(setAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, updateUser)
	.delete(setAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, deleteUser);

export default router;
