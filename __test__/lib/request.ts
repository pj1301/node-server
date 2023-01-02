import supertest, { SuperTest, Test } from 'supertest';

import app from '../../src/server';

interface iRequestOptions {
	headers?: Record<string, any>;
	cookie: Array<string>;
}

export class Request {
	_request: SuperTest<Test> = supertest(app);

	constructor() {}

	get(url: string, options: iRequestOptions) {
		const r = this._request.get(url);

		options.headers && this.addHeaders(r, options.headers);

		return r.send();
	}

	post(url: string, body: any, options: iRequestOptions) {
		const r = this._request.post(url);

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	patch(url: string, body: any, options: iRequestOptions) {
		const r = this._request.patch(url);

		options.headers && this.addHeaders(r, options.headers);

		return r.send(body);
	}

	delete(url: string, options: iRequestOptions) {
		const r = this._request.delete(url);

		options.headers && this.addHeaders(r, options.headers);

		return r.send();
	}

	addHeaders(request: Test, headers: Record<string, any>) {
		for (let [k, v] of Object.entries(headers)) request.set(k, v);
	}
}
