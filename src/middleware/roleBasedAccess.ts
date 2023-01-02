import { NextFunction, Request, Response } from 'express';

import { eRoles } from '../types';

const BASE_ROLES: Array<eRoles> = [eRoles.D1, eRoles.A1];

type tMiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

function setAuthorisedRoles(): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.allowedRoles = BASE_ROLES;
		next();
	};
}

function updateAuthorisedRoles(allowedRoles: Array<eRoles>): tMiddlewareFn {
	return (req: Request, res: Response, next: NextFunction) => {
		res.locals.allowedRoles = allowedRoles;
		next();
	};
}

export { BASE_ROLES, setAuthorisedRoles, updateAuthorisedRoles };
