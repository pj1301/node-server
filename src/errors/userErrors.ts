import { iServerError } from '../types';

export class NotAuthorised implements iServerError {
	public statusCode = 401;
	public message: string;
	public name = 'NotAuthorised';

	constructor(message?: string) {
		this.message = message ?? 'Not authorised';
	}
}

export class Forbidden implements iServerError {
	public statusCode = 403;
	public message: string;
	public name = 'Forbidden';

	constructor(message?: string) {
		this.message = message ?? 'Forbidden';
	}
}
