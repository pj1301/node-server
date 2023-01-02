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
	performPasswordReset,
} from '../controllers';
import { authenticate, updateAuthorisedRoles } from '../middleware';
import { eRoles } from '../types';

const router = Router();

router
	.route('/')
	.post(updateAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, createUser)
	.get(updateAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, getUsers);

router
	.route('/password-reset')
	.post(passwordResetRequest)
	.patch(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1, eRoles.U1, eRoles.U2]),
		authenticate,
		performPasswordReset
	);

router
	.route('/me')
	.get(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1, eRoles.U1, eRoles.U2]),
		authenticate,
		getLoggedInUser
	);

router
	.route('/:id')
	.get(updateAuthorisedRoles([eRoles.D1, eRoles.A1]), authenticate, getUserById)
	.patch(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1]),
		authenticate,
		updateUser
	)
	.delete(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1]),
		authenticate,
		deleteUser
	);

router
	.route('/password-reset-link/:id')
	.get(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1]),
		authenticate,
		getPasswordResetLink
	);

export default router;
