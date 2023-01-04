import { createServer, Server } from 'http';

import app from '../../src/app';
import { dBInit } from '../../src/infrastructure';
import env from '../../.env/test.json';
import { logger } from '../../src/lib';

class ExpressServer {
	private _server!: Server;

	constructor() {
		this.init();
	}

	public get server(): Server {
		return this._server;
	}

	public init(): void {
		for (const [key, value] of Object.entries(env as Record<string, string>))
			process.env[key] = value;

		const port = process.env.PORT || 2000;
		try {
			dBInit();
			this._server = createServer(app());
			this._server.listen(port, () => {
				logger.info(`TEST SERVER INITIALISED::Listening on ${port}`);
			});
		} catch (e: unknown) {
			logger.error('ERROR IN STARTING TEST SERVER');
			logger.error(e);
		}
	}

	public close(): void {
		this._server.close();
	}
}

export default new ExpressServer();
