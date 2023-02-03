import express, { Application } from 'express';
import path from 'path';

import authRouter from './auth.routes';
import userRouter from './user.routes';

const PATH = path.join(__dirname, '../../dist/client');

function configureRoutes(server: Application) {
	/*
	API ROUTES
	api routes will be activated
	when calling any of the below
	strings
	*/
	server.use('/api/v1/auth', authRouter).use('/api/v1/users', userRouter);

	/* UNCOMMENT BELOW TO SERVE UI
	UI ROUTES
	the ui will be served when
	accessing the root url with
	no matches against the urls
	above

	styles do not need to be
	included as webpack will
	bundle them in with the
	bundled javascript
	*/
	// server.use('/public', express.static(path.join(__dirname, '../../public')));
	// server
	// 	.use(express.static(PATH))
	// 	.get('/*.js', (req, res) => res.sendFile(`${PATH}/index.js`))
	// 	.get('/*.js.map', (req, res) => res.sendFile(`${PATH}/index.js.map`))
	// 	.get('/*', (req, res) => res.sendFile(`${PATH}/index.html`));
}

export { configureRoutes };
