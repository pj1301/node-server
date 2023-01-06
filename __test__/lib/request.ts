import supertest, { SuperTest, Test } from 'supertest';

import env from '../../.env/test.json';
import expressServer from '../config/server';

for (const [key, value] of Object.entries(env as Record<string, string>))
	process.env[key] = value;

interface iRequestOptions {
	headers?: Record<string, any>;
}

export class Request {
	private _request: SuperTest<Test> = supertest(expressServer.server);

	constructor() {}

	/**
	 * @method get
	 * @param url Should start from the first path segment following the api - i.e. /api/v1 will be added by the class
	 * @param options Should include all options for the request including queries, headers etc.
	 * @returns Test
	 * @description Performs a HTTP GET request via Supertest
	 * @example
	 * get('/users', { headers: { cookie: ['token=2163183'] } })
	 */
	public get(url: string, options: iRequestOptions = {}): Test {
		const r = this._request.get(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send();
	}

	/**
	 * @method post
	 * @param url Should start from the first path segment following the api - i.e. /api/v1 will be added by the class
	 * @param body Should include the body content for the request
	 * @param options Should include all options for the request including queries, headers etc.
	 * @returns Test
	 * @description Performs a HTTP POST request via Supertest
	 * @example
	 * post('/auth/login', { username: 'user@test', password: 'Pass123' }, { headers: { cookie: ['token=2163183'] } })
	 */
	public post(url: string, body: any, options: iRequestOptions = {}): Test {
		const r = this._request.post(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	/**
	 * @method patch
	 * @param url Should start from the first path segment following the api - i.e. /api/v1 will be added by the class
	 * @param body Should include the body content for the request
	 * @param options Should include all options for the request including queries, headers etc.
	 * @returns Test
	 * @description Performs a HTTP PATCH request via Supertest
	 * @example
	 * patch('/item', { title: 'a new title' }, { headers: { cookie: ['token=2163183'] } })
	 */
	public patch(url: string, body: any, options: iRequestOptions = {}) {
		const r = this._request.patch(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	/**
	 * @method delete
	 * @param url Should start from the first path segment following the api - i.e. /api/v1 will be added by the class
	 * @param options Should include all options for the request including queries, headers etc.
	 * @returns Test
	 * @description Performs a HTTP DELETE request via Supertest
	 * @example
	 * delete('/item/:id', { headers: { cookie: ['token=2163183'] } })
	 */
	public delete(url: string, options: iRequestOptions = {}) {
		const r = this._request.delete(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send();
	}

	/**
	 * @method addHeaders
	 * @private
	 * @param {Test} request
	 * @param headers
	 * @description Adds headers to supertest request using set method
	 */
	private addHeaders(request: Test, headers: Record<string, any> = {}) {
		for (let [k, v] of Object.entries(headers)) request.set(k, v);
	}

	/**
	 * @method formatUrl
	 * @private
	 * @param {string} url Expects a url which starts the first variable segment, e.g. /users or /auth/login
	 * @returns {string} Formatted url in the form /api/v1/<rest-of-url>
	 * @description Formats urls for supertest request; adds suffix for server url taken from environment variables
	 */
	private formatUrl(url: string): string {
		let prefix = process.env.ROOT_PATH;
		return url.slice(0, 1) === '/' ? prefix + url : prefix + '/' + url;
	}
}
