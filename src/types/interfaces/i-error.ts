export interface iServerError extends Error {
	statusCode: number;
	data?: any;
}

export interface iThrownError {
	message: string;
	level: string;
	timestamp: string;
	label: string;
	metadata: { statusCode?: number; name?: string; },
}