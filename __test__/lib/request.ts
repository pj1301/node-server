import supertest, { SuperTest, Test } from 'supertest';

import env from '../../.env/test.json';
import server from '../../src/server';

for (const [key, value] of Object.entries(env as Record<string, string>))
	process.env[key] = value;

interface iRequestOptions {
	headers?: Record<string, any>;
	cookie: Array<string>;
}

export class Request {
	private _request: SuperTest<Test> = supertest(server);

	constructor() {}

	public get(url: string, options: iRequestOptions) {
		const r = this._request.get(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		console.log(r.url);

		return r.send();
	}

	public post(url: string, body: any, options: iRequestOptions) {
		const r = this._request.post(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	public patch(url: string, body: any, options: iRequestOptions) {
		const r = this._request.patch(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	public delete(url: string, options: iRequestOptions) {
		const r = this._request.delete(this.formatUrl(url));

		options.headers && this.addHeaders(r, options.headers);

		return r.send();
	}

	private addHeaders(request: Test, headers: Record<string, any>) {
		for (let [k, v] of Object.entries(headers)) request.set(k, v);
	}

	private formatUrl(url: string): string {
		return url.slice(0, 1) !== '/' ? `/${url}` : url;
	}
}
