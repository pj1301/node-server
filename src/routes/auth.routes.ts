import { Router } from 'express';
import { login, logout } from '../controllers';
import { authenticate, updateAuthorisedRoles } from '../middleware';
import { eRoles } from '../types';

const router = Router();

router
	.route('/login')
	.post(login)
	.delete(
		updateAuthorisedRoles([eRoles.D1, eRoles.A1, eRoles.U1, eRoles.U2]),
		authenticate,
		logout
	);

export default router;
