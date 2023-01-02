import { iServerError } from '../types';

export class EnvironmentError implements iServerError {
	public statusCode = 500;
	public message: string;
	public name = 'Environment';

	constructor(message?: string) {
		this.message =
			message ?? 'Environment variables have not been set up correctly';
	}
}
