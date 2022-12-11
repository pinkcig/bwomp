import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Application } from './Application';
import type { Route } from './Route';

/**
 * The reply data interface
 */
interface IReplyData {
	/**
	 * The data to send
	 */
	data: unknown;

	/**
	 * The message to send
	 * @default 'OK'
	 */
	message?: string;

	/**
	 * The status code to send
	 * @default 200
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	status?: number;
}

class Context {
	#app: Application;
	#route: Route;
	#request: FastifyRequest;
	#response: FastifyReply;

	constructor(app: Application, route: Route, request: FastifyRequest, response: FastifyReply) {
		this.#app = app;
		this.#route = route;
		this.#request = request;
		this.#response = response;
	}

	get app() {
		return this.#app;
	}

	get route() {
		return this.#route;
	}

	get request() {
		return this.#request;
	}

	get response() {
		return this.#response;
	}
}

export { Context, IReplyData };
