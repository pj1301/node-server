import { createServer } from 'http';

import app from './app';
import * as DEV_ENV from '../.env/development.json';
import * as PROD_ENV from '../.env/production.json';
import { logger } from './lib/logger';
import { dBInit } from './infrastructure';

let env: Record<string, string>;

switch (process.env.NODE_ENV) {
	case 'production':
		env = PROD_ENV;
		break;
	case 'development':
		env = DEV_ENV;
		break;
	default:
		env = PROD_ENV;
		break;
}

for (const [key, value] of Object.entries(env as Record<string, string>))
	process.env[key] = value;

const port = process.env.PORT || 2000;
dBInit();
const server = createServer(app());
server.listen(port);

server.on('listening', () => {
	logger.info(`SERVER INITIALISATION::Running on port ${port}`);
});
