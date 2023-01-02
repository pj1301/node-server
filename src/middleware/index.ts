/* eslint-disable quotes */
import { Application, json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { logger } from '../lib';

export function middleware(server: Application): void {
	logger.info('SERVER INITIALISATION::Standard Middleware');

	server.use(morgan('combined'));
	server.use(json());

	// server.use(
	// 	helmet.contentSecurityPolicy({
	// 		directives: {
	// 			...helmet.contentSecurityPolicy.getDefaultDirectives(),
	// 			'script-src': ['http: data:', "'self'", "'unsafe-inline'"],
	// 			'script-src-attr': ['http: data:', "'self'", "'unsafe-inline'", "'unsafe-eval'"],
	// 			'media-src': ['http: data:', "'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
	// 			'img-src': ['http: data:', "'self'", "'unsafe-inline'", "'unsafe-eval'"],
	// 			'frame-src': ['http: data:', "'self'", "'unsafe-inline'", "'unsafe-eval'"],
	// 		},
	// 	})
	// );
	// server.use(helmet.dnsPrefetchControl());
	// server.use(helmet.expectCt());
	// server.use(helmet.frameguard());
	// server.use(helmet.hidePoweredBy());
	// server.use(helmet.hsts());
	// server.use(helmet.ieNoOpen());
	// server.use(helmet.noSniff());
	// server.use(helmet.permittedCrossDomainPolicies());
	// server.use(helmet.referrerPolicy());
	// server.use((req, res, next) => {
	// 	res.setHeader('X-XSS-Protection', '1; mode=block');
	// 	next();
	// });
}

export * from './authenticate';
export * from './errorHandler';
export * from './roleBasedAccess';
