import { iServerError } from '../types';

export class NotAuthorised implements iServerError {
	public statusCode = 401;
	public message: string;
	public name = 'NotAuthorised';

	constructor(message?: string) {
		this.message = message ?? 'Not authorised';
	}
}
