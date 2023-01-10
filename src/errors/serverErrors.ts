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

export class ParameterError implements iServerError {
	public statusCode = 500;
	public message: string;
	public name = 'Parameter';

	constructor(message?: string) {
		this.message = message ?? 'Incorrect parameter or parameter(s) missing';
	}
}

export class DatabaseError implements iServerError {
	public statusCode = 500;
	public message: string;
	public name = 'Database';

	constructor(message?: string) {
		this.message = message ?? 'An error occurred during a database operation';
	}
}
