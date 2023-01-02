import express, { Application } from 'express';

import { configureRoutes } from './routes';
import { middleware, setAuthorisedRoles, errorHandler } from './middleware';

const app = (): Application => {
	const server: Application = express();
	// configure role based access
	server.use(setAuthorisedRoles());
	// configure server middleware
	middleware(server);
	// configure server routes
	configureRoutes(server);
	// error handler - must be initialised after routes
	server.use(errorHandler);

	return server;
};

export default app;
