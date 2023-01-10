import { NextFunction, Request, Response } from 'express';

import { eRoles, tMiddlewareFn } from '../types';

const BASE_ROLES: Array<eRoles> = [eRoles.D1, eRoles.A1];

function initRBAC(): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.allowedRoles = BASE_ROLES;
		next();
	};
}

function setAuthorisedRoles(allowedRoles: Array<eRoles>): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.allowedRoles = allowedRoles;
		next();
	};
}

export { BASE_ROLES, setAuthorisedRoles, initRBAC };
