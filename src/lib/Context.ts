import type { ObjectValidator } from '@sapphire/shapeshift';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Application } from './Application';
import type { Route, Validation, ValidatorDictionary } from './Route';

type WrapDictionary<V extends ValidatorDictionary | undefined> = ObjectValidator<NonNullable<V>>;

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

class Context<V extends Validation> {
	#app: Application;
	#route: Route<V>;
	#request: FastifyRequest;
	#response: FastifyReply;

	bodyShape!: WrapDictionary<V['body']>;
	queryShape!: WrapDictionary<V['query']>;
	paramsShape!: WrapDictionary<V['params']>;

	constructor(app: Application, route: Route<V>, request: FastifyRequest, response: FastifyReply) {
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

export { Context, IReplyData, WrapDictionary };
