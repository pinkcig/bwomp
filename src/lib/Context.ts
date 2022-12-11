import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Application } from './App';
import type { Route } from './Route';

interface IReplyData {
	data: unknown;
	message: string;
	status: number;
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
